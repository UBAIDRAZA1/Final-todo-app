'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Menu, X, Plus, ListTodo, CheckSquare, Trash2, Mic } from 'lucide-react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tool_calls?: any[];
}

export default function ChatPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!session.data) {
      router.push('/auth/login');
    }
  }, [session.data, router]);

  const handleSendMessage = () => sendMessage(inputValue);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    let message = suggestion;
    // If user clicks "Add a task", we want the bot to ask for the title.
    // We send a message that implies intent but lacks detail.
    if (suggestion === "Add a task") {
      message = "I want to add a new task";
    }
    // Directly send the message
    sendMessage(message);
  };

  // Refactor handleSendMessage to accept content
  const sendMessage = async (content: string) => {
    if (!content.trim() || !session.data?.user?.id || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/api/${session.data.user.id}/chat`,
        {
          message: content,
          conversation_id: conversationId || undefined,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.data.token}`,
          },
        }
      );

      const { response: botResponse, conversation_id: newConversationId, tool_calls } = response.data;

      if (newConversationId && !conversationId) {
        setConversationId(newConversationId);
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botResponse,
        timestamp: new Date(),
        tool_calls: tool_calls || [],
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const suggestions = [
    { text: "Add a task", icon: <Plus className="w-4 h-4" />, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { text: "Show my pending tasks", icon: <ListTodo className="w-4 h-4" />, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { text: "Mark task 1 as complete", icon: <CheckSquare className="w-4 h-4" />, color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { text: "Delete task 1", icon: <Trash2 className="w-4 h-4" />, color: "bg-red-500/20 text-red-400 border-red-500/30" }
  ];

  if (!session.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            TaskMaster AI Assistant
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
        <div className={`hidden md:block w-64 bg-gray-900/80 backdrop-blur-sm border-r border-gray-800 flex flex-col`}>
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-gray-200">TaskMaster AI</h2>
            <p className="text-xs text-gray-500">Manage tasks with AI</p>
          </div>
          <div className="p-4 flex-1">
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/profile')}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
              >
                Profile
              </button>
              <button 
                onClick={() => router.push('/chat')}
                className="w-full text-left p-2 rounded-lg bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/50 text-white font-medium"
              >
                AI Chat
              </button>
            </div>
          </div>
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Ask me to add, list, complete, delete, or update tasks
            </p>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="absolute left-0 top-0 h-full w-64 bg-gray-900/90 backdrop-blur-sm border-r border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-gray-200">Navigation</h2>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      router.push('/dashboard');
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      router.push('/profile');
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      router.push('/chat');
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/50 text-white font-medium"
                  >
                    AI Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header (Mobile) */}
          <div className="p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm md:hidden">
            <div className="flex items-center">
              <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-lg shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                TaskMaster AI Assistant
              </h1>
            </div>
          </div>

          {/* Chat header (Desktop) */}
          <div className="hidden md:flex p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm justify-between items-center">
            <div className="flex items-center space-x-3">
               <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg shadow-md shadow-purple-500/20">
                 <Bot className="h-5 w-5 text-white" />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-gray-100">TaskMaster AI</h2>
                 <p className="text-xs text-green-400 flex items-center">
                   <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                   Online & Ready
                 </p>
               </div>
            </div>
            <div className="flex items-center space-x-2">
               <span className="text-xs text-gray-500 px-3 py-1 rounded-full border border-gray-800 bg-gray-800/50">
                 Powered by Gemini Pro
               </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 px-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                      TaskMaster AI
                    </h2>
                    <p className="text-gray-400 mb-8 text-center max-w-md">
                      I can help you manage your tasks. Select an option below or type your request.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className={`flex items-center p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${suggestion.color} bg-opacity-10 backdrop-blur-sm border-opacity-20`}
                        >
                          <div className={`p-2 rounded-lg mr-4 ${suggestion.color.split(' ')[0]} bg-opacity-20`}>
                            {suggestion.icon}
                          </div>
                          <span className="font-medium text-left">{suggestion.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                            : 'bg-gray-800 text-gray-100 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user' ? 'bg-indigo-700' : 'bg-purple-700'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            
                            {/* Show tool calls if any */}
                            {message.tool_calls && message.tool_calls.length > 0 && (
                              <div className="mt-2 p-2 bg-gray-700/50 rounded-lg text-sm">
                                <p className="text-gray-300 font-medium mb-1">Tool Calls:</p>
                                <ul className="space-y-1">
                                  {message.tool_calls.map((tool_call, index) => (
                                    <li key={index} className="text-gray-400">
                                      <span className="font-mono bg-gray-600/50 px-2 py-1 rounded text-xs">
                                        {tool_call.name}({JSON.stringify(tool_call.arguments)})
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl rounded-2xl p-4 bg-gray-800 text-gray-100 rounded-bl-none">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to manage your tasks..."
                className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                disabled={isLoading}
              />
              <Button
                onClick={startListening}
                variant="outline"
                size="icon"
                className={`border-gray-700 bg-gray-800 hover:bg-gray-700 ${isListening ? 'text-red-500 animate-pulse border-red-500/50' : 'text-gray-400'}`}
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              TaskMaster AI Assistant can help you manage your tasks using natural language
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}