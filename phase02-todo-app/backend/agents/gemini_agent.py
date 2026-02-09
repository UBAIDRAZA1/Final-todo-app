import os
import google.generativeai as genai
from typing import Dict, Any, List
import httpx
from datetime import datetime
from dotenv import load_dotenv
from sqlmodel import Session, select
from models import Task, User, Conversation, Message, MessageRole
from utils.database import get_session
from config.settings import settings

load_dotenv()

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-flash-latest')

class GeminiAgent:
    def __init__(self):
        self.client = httpx.AsyncClient()
        self.mcp_server_url = settings.MCP_SERVER_URL
    
    async def get_response(self, message: str, user_id: str, conversation_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Get response from Gemini AI with tool calling capabilities
        """
        # Prepare the conversation context
        context_messages = []
        
        # Add system instruction
        system_instruction = """
        You are a helpful AI assistant for managing tasks. You can help users add, list, complete, delete, and update tasks.
        You have access to the following tools:
        1. add_task: Add a new task with title and optional description
        2. list_tasks: List all tasks or filter by status (pending/completed)
        3. complete_task: Mark a task as completed by ID
        4. delete_task: Delete a task by ID
        5. update_task: Update a task title or description by ID
        
        Always respond in a friendly, helpful manner. If the user wants to perform a task management action, 
        use the appropriate tool. If the user is asking a general question, respond normally.
        """
        
        context_messages.append({"role": "user", "parts": [system_instruction]})
        
        # Add conversation history
        for msg in conversation_history:
            role = "user" if msg["role"] == "user" else "model"
            context_messages.append({"role": role, "parts": [msg["content"]]})
        
        # Add the current user message
        context_messages.append({"role": "user", "parts": [message]})
        
        # Define the tools (functions) that the model can call
        tools = genai.protos.Tool(
            function_declarations=[
                genai.protos.FunctionDeclaration(
                    name="add_task",
                    description="Add a new task with title, description, priority, due date, and tags",
                    parameters=genai.protos.Schema(
                        type=genai.protos.Type.OBJECT,
                        properties={
                            "title": genai.protos.Schema(type=genai.protos.Type.STRING, description="Title of the task"),
                            "description": genai.protos.Schema(type=genai.protos.Type.STRING, description="Description of the task (optional)"),
                            "priority": genai.protos.Schema(type=genai.protos.Type.STRING, description="Priority of the task: urgent, high, medium, or low (optional)"),
                            "due_date": genai.protos.Schema(type=genai.protos.Type.STRING, description="Due date of the task in YYYY-MM-DD format (optional)"),
                            "tags": genai.protos.Schema(type=genai.protos.Type.STRING, description="Comma-separated tags for the task (optional)")
                        },
                        required=["title"]
                    )
                ),
                genai.protos.FunctionDeclaration(
                    name="list_tasks",
                    description="List all tasks or filter by status (pending/completed)",
                    parameters=genai.protos.Schema(
                        type=genai.protos.Type.OBJECT,
                        properties={
                            "status": genai.protos.Schema(type=genai.protos.Type.STRING, description="Filter by status: pending, completed, or all")
                        }
                    )
                ),
                genai.protos.FunctionDeclaration(
                    name="complete_task",
                    description="Mark a task as completed by ID",
                    parameters=genai.protos.Schema(
                        type=genai.protos.Type.OBJECT,
                        properties={
                            "task_id": genai.protos.Schema(type=genai.protos.Type.NUMBER, description="ID of the task to complete")
                        },
                        required=["task_id"]
                    )
                ),
                genai.protos.FunctionDeclaration(
                    name="delete_task",
                    description="Delete a task by ID",
                    parameters=genai.protos.Schema(
                        type=genai.protos.Type.OBJECT,
                        properties={
                            "task_id": genai.protos.Schema(type=genai.protos.Type.NUMBER, description="ID of the task to delete")
                        },
                        required=["task_id"]
                    )
                ),
                genai.protos.FunctionDeclaration(
                    name="update_task",
                    description="Update a task title or description by ID",
                    parameters=genai.protos.Schema(
                        type=genai.protos.Type.OBJECT,
                        properties={
                            "task_id": genai.protos.Schema(type=genai.protos.Type.NUMBER, description="ID of the task to update"),
                            "title": genai.protos.Schema(type=genai.protos.Type.STRING, description="New title for the task (optional)"),
                            "description": genai.protos.Schema(type=genai.protos.Type.STRING, description="New description for the task (optional)")
                        },
                        required=["task_id"]
                    )
                )
            ]
        )
        
        try:
            # Generate content with function calling enabled
            response = await model.generate_content_async(
                contents=context_messages,
                tools=[tools],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                )
            )
            
            # Process the response
            result = {}
            
            # Check if the model decided to call a function
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    # Check for function call
                    if part.function_call:
                        function_call = part.function_call
                        # Ensure we have a valid function call with name
                        if function_call.name:
                            function_name = function_call.name
                            
                            # Safely get arguments
                            function_args = {}
                            if function_call.args:
                                # Convert to dict if it's not already
                                if hasattr(function_call.args, 'items'):
                                    function_args = {key: val for key, val in function_call.args.items()}
                                else:
                                    function_args = dict(function_call.args)
                            
                            # Add user_id to the function arguments
                            function_args['user_id'] = user_id
                            
                            result['tool_calls'] = [{
                                'name': function_name,
                                'arguments': function_args
                            }]
                            
                            # Also include a friendly response
                            if function_name == 'add_task':
                                result['response'] = f"I'll help you add the task '{function_args.get('title', 'unnamed')}' to your list."
                            elif function_name == 'list_tasks':
                                status = function_args.get('status', 'all')
                                result['response'] = f"I'll retrieve your {status} tasks for you."
                            elif function_name == 'complete_task':
                                result['response'] = f"I'll mark task #{function_args.get('task_id')} as completed."
                            elif function_name == 'delete_task':
                                result['response'] = f"I'll delete task #{function_args.get('task_id')}."
                            elif function_name == 'update_task':
                                result['response'] = f"I'll update task #{function_args.get('task_id')}."
                    
                    # Check for text response
                    if part.text:
                        # Only overwrite response if we haven't set a specific tool response yet
                        # or append if you prefer
                        if 'response' not in result:
                            result['response'] = part.text
                        else:
                            # If we already have a tool response, maybe append the text?
                            # For now, let's keep the tool response priority or append
                            pass
            
            # If no response was set from function calls, use the text response
            if 'response' not in result:
                result['response'] = response.text if response.text else "I processed your request."
                
            return result
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Error in Gemini agent: {str(e)}")
            return {
                "response": "Sorry, I encountered an error processing your request.",
                "error": str(e)
            }
    
    def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the tool directly in the backend (simulating MCP call)
        """
        # Ensure task_id is an integer if present (Gemini returns float for NUMBER type)
        if 'task_id' in arguments and isinstance(arguments['task_id'], float):
            arguments['task_id'] = int(arguments['task_id'])

        try:
            # Get database session
            session_gen = get_session()
            session = next(session_gen)
            
            try:
                if tool_name == 'add_task':
                    return self._add_task(session, **arguments)
                elif tool_name == 'list_tasks':
                    return self._list_tasks(session, **arguments)
                elif tool_name == 'complete_task':
                    return self._complete_task(session, **arguments)
                elif tool_name == 'delete_task':
                    return self._delete_task(session, **arguments)
                elif tool_name == 'update_task':
                    return self._update_task(session, **arguments)
                else:
                    return {"error": f"Unknown tool: {tool_name}"}
            finally:
                session.close()
        except Exception as e:
            print(f"Error calling tool {tool_name}: {str(e)}")
            return {"error": str(e)}
    
    def _add_task(self, session: Session, title: str, user_id: str, description: str = None, priority: str = "medium", due_date: str = None, tags: str = None) -> Dict[str, Any]:
        """Add a new task to the user's task list."""
        try:
            # Verify user exists
            user = session.get(User, user_id)
            if not user:
                return {"error": "User not found"}

            # Parse due_date if provided
            parsed_due_date = None
            if due_date:
                try:
                    from datetime import datetime
                    parsed_due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
                except ValueError:
                    # If parsing fails, try simpler format
                    try:
                        parsed_due_date = datetime.strptime(due_date, '%Y-%m-%d')
                    except ValueError:
                        return {"error": f"Invalid date format: {due_date}. Expected YYYY-MM-DD"}

            # Create new task
            new_task = Task(
                title=title,
                description=description,
                user_id=user_id,
                completed=False,
                priority=priority,
                due_date=parsed_due_date,
                tags=tags
            )
            session.add(new_task)
            session.commit()
            session.refresh(new_task)

            return {
                "success": True,
                "task_id": new_task.id,
                "message": f"Task '{title}' added successfully"
            }
        except Exception as e:
            return {"error": str(e)}

    def _list_tasks(self, session: Session, user_id: str, status: str = "all") -> Dict[str, Any]:
        """List all tasks for the user, optionally filtered by status."""
        try:
            # Verify user exists
            user = session.get(User, user_id)
            if not user:
                return {"error": "User not found"}

            # Build query based on status filter
            query = select(Task).where(Task.user_id == user_id)

            if status == "pending":
                query = query.where(Task.completed == False)
            elif status == "completed":
                query = query.where(Task.completed == True)

            tasks = session.exec(query).all()

            task_list = []
            for task in tasks:
                task_dict = {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "priority": task.priority,
                    "due_date": task.due_date.isoformat() if task.due_date else None,
                    "tags": task.tags,
                    "created_at": task.created_at.isoformat() if task.created_at else None
                }
                task_list.append(task_dict)

            return {
                "success": True,
                "tasks": task_list,
                "count": len(task_list)
            }
        except Exception as e:
            return {"error": str(e)}

    def _complete_task(self, session: Session, task_id: int, user_id: str) -> Dict[str, Any]:
        """Mark a task as completed."""
        try:
            # Verify user exists
            user = session.get(User, user_id)
            if not user:
                return {"error": "User not found"}
            
            # Get task
            task = session.get(Task, task_id)
            if not task:
                return {"error": "Task not found"}
            
            # Verify task belongs to user
            if task.user_id != user_id:
                return {"error": "Unauthorized: Task does not belong to user"}
            
            # Update task status
            task.completed = True
            task.completed_at = datetime.utcnow()
            session.add(task)
            session.commit()
            
            return {
                "success": True,
                "message": f"Task '{task.title}' marked as completed"
            }
        except Exception as e:
            return {"error": str(e)}

    def _delete_task(self, session: Session, task_id: int, user_id: str) -> Dict[str, Any]:
        """Delete a task."""
        try:
            # Verify user exists
            user = session.get(User, user_id)
            if not user:
                return {"error": "User not found"}
            
            # Get task
            task = session.get(Task, task_id)
            if not task:
                return {"error": "Task not found"}
            
            # Verify task belongs to user
            if task.user_id != user_id:
                return {"error": "Unauthorized: Task does not belong to user"}
            
            # Delete task
            session.delete(task)
            session.commit()
            
            return {
                "success": True,
                "message": f"Task '{task.title}' deleted successfully"
            }
        except Exception as e:
            return {"error": str(e)}

    def _update_task(self, session: Session, task_id: int, user_id: str, title: str = None, description: str = None, priority: str = None, due_date: str = None, tags: str = None) -> Dict[str, Any]:
        """Update a task's title, description, priority, due date, or tags."""
        try:
            # Verify user exists
            user = session.get(User, user_id)
            if not user:
                return {"error": "User not found"}

            # Get task
            task = session.get(Task, task_id)
            if not task:
                return {"error": "Task not found"}

            # Verify task belongs to user
            if task.user_id != user_id:
                return {"error": "Unauthorized: Task does not belong to user"}

            # Update fields if provided
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if priority is not None:
                task.priority = priority
            if due_date is not None:
                try:
                    from datetime import datetime
                    parsed_due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
                    task.due_date = parsed_due_date
                except ValueError:
                    # If parsing fails, try simpler format
                    try:
                        task.due_date = datetime.strptime(due_date, '%Y-%m-%d')
                    except ValueError:
                        return {"error": f"Invalid date format: {due_date}. Expected YYYY-MM-DD"}
            if tags is not None:
                task.tags = tags

            session.add(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task updated successfully"
            }
        except Exception as e:
            return {"error": str(e)}

# Example of OpenAI code (commented out as requested)
"""
import openai
from typing import Dict, Any, List

class OpenAIAgent:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
    
    async def get_response(self, message: str, user_id: str, conversation_history: List[Dict[str, str]]) -> Dict[str, Any]:
        # Implementation would go here
        pass
"""