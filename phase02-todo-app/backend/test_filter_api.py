
import requests
import sys

BASE_URL = "http://localhost:8001"

def test_filters():
    # 1. Signup/Login
    email = "test_filter_user@example.com"
    password = "password123"
    
    # Try to signup
    signup_resp = requests.post(f"{BASE_URL}/api/auth/sign-up/email", json={
        "email": email,
        "password": password,
        "name": "Test Filter User"
    })
    
    if signup_resp.status_code == 201:
        print("User created.")
    elif signup_resp.status_code == 400:
        print("User already exists, proceeding to login.")
    else:
        print(f"Signup failed: {signup_resp.text}")
        return

    # Login
    login_data = {
        "email": email,
        "password": password
    }
    login_resp = requests.post(f"{BASE_URL}/api/auth/sign-in/email", json=login_data)
    
    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.text}")
        return
        
    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    user_id = login_resp.json()["user"]["id"]

    # 2. Create Tasks
    # Delete existing tasks first to have a clean slate
    tasks_resp = requests.get(f"{BASE_URL}/api/{user_id}/tasks", headers=headers)
    for task in tasks_resp.json():
        requests.delete(f"{BASE_URL}/api/{user_id}/tasks/{task['id']}", headers=headers)

    # Create Pending Task
    requests.post(f"{BASE_URL}/api/{user_id}/tasks", headers=headers, json={
        "title": "Pending Task",
        "description": "This is a pending task",
        "completed": False
    })
    
    # Create Completed Task
    requests.post(f"{BASE_URL}/api/{user_id}/tasks", headers=headers, json={
        "title": "Completed Task",
        "description": "This is a completed task",
        "completed": True
    })
    
    # 3. Test Filters
    print("\nTesting Filters...")
    
    # Test Pending Filter
    pending_resp = requests.get(f"{BASE_URL}/api/{user_id}/tasks?status=pending", headers=headers)
    pending_tasks = pending_resp.json()
    print(f"Pending tasks count: {len(pending_tasks)}")
    if all(not t['completed'] for t in pending_tasks):
        print("✅ Pending filter works correctly (backend).")
    else:
        print("❌ Pending filter failed: returned completed tasks.")
        
    # Test Completed Filter
    completed_resp = requests.get(f"{BASE_URL}/api/{user_id}/tasks?status=completed", headers=headers)
    completed_tasks = completed_resp.json()
    print(f"Completed tasks count: {len(completed_tasks)}")
    if all(t['completed'] for t in completed_tasks):
        print("✅ Completed filter works correctly (backend).")
    else:
        print("❌ Completed filter failed: returned pending tasks.")
        
    # Test All Filter
    all_resp = requests.get(f"{BASE_URL}/api/{user_id}/tasks?status=all", headers=headers)
    all_tasks = all_resp.json()
    print(f"All tasks count: {len(all_tasks)}")
    if len(all_tasks) == 2:
        print("✅ All filter works correctly (backend).")
    else:
        print(f"❌ All filter failed: expected 2 tasks, got {len(all_tasks)}")

if __name__ == "__main__":
    test_filters()
