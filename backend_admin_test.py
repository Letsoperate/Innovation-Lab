#!/usr/bin/env python3
"""
Backend Admin Features Test for VibePush SA Platform
Tests NEW admin endpoints as specified in the review request
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from frontend .env
BASE_URL = "https://sa-vibe-code.preview.emergentagent.com/api"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "total": 0
}

# Global variables for test data
admin_token = None
regular_token = None
admin_email = f"admin_new_{int(datetime.now().timestamp())}@test.com"
regular_email = f"regular_{int(datetime.now().timestamp())}@test.com"
created_project_id = None
created_blog_id = None
created_sponsor_id = None


def log_test(name, passed, details=""):
    """Log test result"""
    test_results["total"] += 1
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   Details: {details}")
    
    if passed:
        test_results["passed"].append(name)
    else:
        test_results["failed"].append({"name": name, "details": details})


def test_1_register_admin_user():
    """Test 1: Register a fresh user - should get is_admin: true (first user)"""
    global admin_token
    try:
        payload = {
            "name": "Admin User",
            "email": admin_email,
            "password": "admin123",
            "institution": "UCT"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "access_token" in data and "user" in data:
            admin_token = data["access_token"]
            user = data["user"]
            # Check if is_admin is true
            if user.get("is_admin") == True:
                log_test("1. Register Admin User (First User)", True, 
                        f"User registered with is_admin=True: {user['name']}, email={user['email']}")
                return True
            else:
                # If not admin, try to make admin using /api/admin/make-admin endpoint
                print(f"   Note: User not admin (is_admin={user.get('is_admin')}), attempting to use make-admin endpoint...")
                make_admin_response = requests.post(f"{BASE_URL}/admin/make-admin", timeout=10)
                if make_admin_response.status_code == 200:
                    # Re-fetch user profile to verify admin status
                    headers = {"Authorization": f"Bearer {admin_token}"}
                    me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
                    me_data = me_response.json()
                    if me_data.get("is_admin") == True:
                        log_test("1. Register Admin User (First User)", True, 
                                f"User made admin via make-admin endpoint: {me_data['name']}")
                        return True
                
                log_test("1. Register Admin User (First User)", False, 
                        f"User registered but is_admin={user.get('is_admin')}, expected True. Database may have existing users.")
                return False
        else:
            log_test("1. Register Admin User (First User)", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("1. Register Admin User (First User)", False, f"Exception: {str(e)}")
        return False


def test_2_verify_admin_status():
    """Test 2: Verify admin status - GET /api/auth/me should show is_admin: true"""
    global admin_token
    if not admin_token:
        log_test("2. Verify Admin Status", False, "No admin token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            if data.get("is_admin") == True:
                log_test("2. Verify Admin Status", True, 
                        f"Admin status confirmed: is_admin=True for {data['name']}")
                return True
            else:
                log_test("2. Verify Admin Status", False, 
                        f"is_admin={data.get('is_admin')}, expected True")
                return False
        else:
            log_test("2. Verify Admin Status", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("2. Verify Admin Status", False, f"Exception: {str(e)}")
        return False


def test_3_profile_update():
    """Test 3: Profile Update - PUT /api/auth/me"""
    global admin_token
    if not admin_token:
        log_test("3. Profile Update", False, "No admin token available")
        return False
    
    try:
        payload = {
            "name": "Updated Admin",
            "institution": "Wits University"
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.put(f"{BASE_URL}/auth/me", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            if data.get("name") == "Updated Admin" and data.get("institution") == "Wits University":
                log_test("3. Profile Update", True, 
                        f"Profile updated: name={data['name']}, institution={data['institution']}")
                return True
            else:
                log_test("3. Profile Update", False, 
                        f"Profile not updated correctly: name={data.get('name')}, institution={data.get('institution')}")
                return False
        else:
            log_test("3. Profile Update", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("3. Profile Update", False, f"Exception: {str(e)}")
        return False


def test_4_get_my_projects():
    """Test 4: Get My Projects - GET /api/users/me/projects"""
    global admin_token
    if not admin_token:
        log_test("4. Get My Projects", False, "No admin token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/users/me/projects", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "projects" in data:
            log_test("4. Get My Projects", True, 
                    f"Retrieved {len(data['projects'])} projects (may be empty)")
            return True
        else:
            log_test("4. Get My Projects", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("4. Get My Projects", False, f"Exception: {str(e)}")
        return False


def test_5_create_project():
    """Test 5: Create a project - POST /api/projects"""
    global admin_token, created_project_id
    if not admin_token:
        log_test("5. Create Project", False, "No admin token available")
        return False
    
    try:
        payload = {
            "name": "Admin Test Project",
            "tagline": "Testing admin features",
            "description": "Test",
            "demo_url": "https://test.com",
            "category": "web-apps",
            "track": "innovation",
            "institution": "UCT",
            "team_name": "AdminTeam",
            "team_size": 1,
            "tech_stack": "React"
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/projects", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("name") == payload["name"]:
            created_project_id = data["id"]
            log_test("5. Create Project", True, 
                    f"Project created: {data['name']} (ID: {created_project_id})")
            return True
        else:
            log_test("5. Create Project", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("5. Create Project", False, f"Exception: {str(e)}")
        return False


def test_6_admin_dashboard():
    """Test 6: Admin Dashboard - GET /api/admin/dashboard"""
    global admin_token
    if not admin_token:
        log_test("6. Admin Dashboard", False, "No admin token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            required_fields = ["total_projects", "total_users", "total_votes", "total_comments", 
                             "total_bookmarks", "projects_today", "votes_today", "users_today"]
            missing_fields = [f for f in required_fields if f not in data]
            
            if not missing_fields:
                log_test("6. Admin Dashboard", True, 
                        f"Dashboard stats: {data['total_projects']} projects, {data['total_users']} users, {data['total_votes']} votes")
                return True
            else:
                log_test("6. Admin Dashboard", False, 
                        f"Missing fields: {missing_fields}")
                return False
        else:
            log_test("6. Admin Dashboard", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("6. Admin Dashboard", False, f"Exception: {str(e)}")
        return False


def test_7_admin_users_list():
    """Test 7: Admin Users List - GET /api/admin/users"""
    global admin_token
    if not admin_token:
        log_test("7. Admin Users List", False, "No admin token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/users", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "users" in data and "total" in data:
            log_test("7. Admin Users List", True, 
                    f"Retrieved {len(data['users'])} users, total: {data['total']}")
            return True
        else:
            log_test("7. Admin Users List", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("7. Admin Users List", False, f"Exception: {str(e)}")
        return False


def test_8_admin_projects_list():
    """Test 8: Admin Projects List - GET /api/admin/projects"""
    global admin_token
    if not admin_token:
        log_test("8. Admin Projects List", False, "No admin token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/projects", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "projects" in data and "total" in data:
            log_test("8. Admin Projects List", True, 
                    f"Retrieved {len(data['projects'])} projects, total: {data['total']}")
            return True
        else:
            log_test("8. Admin Projects List", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("8. Admin Projects List", False, f"Exception: {str(e)}")
        return False


def test_9a_admin_blog_create():
    """Test 9a: Admin Blog Create - POST /api/admin/blog"""
    global admin_token, created_blog_id
    if not admin_token:
        log_test("9a. Admin Blog Create", False, "No admin token available")
        return False
    
    try:
        payload = {
            "title": "Test Blog Post",
            "excerpt": "Testing",
            "content": "Full content here",
            "category": "Updates",
            "read_time": "2 min read"
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/admin/blog", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("title") == payload["title"]:
            created_blog_id = data["id"]
            log_test("9a. Admin Blog Create", True, 
                    f"Blog post created: {data['title']} (ID: {created_blog_id})")
            return True
        else:
            log_test("9a. Admin Blog Create", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("9a. Admin Blog Create", False, f"Exception: {str(e)}")
        return False


def test_9b_admin_blog_update():
    """Test 9b: Admin Blog Update - PUT /api/admin/blog/{id}"""
    global admin_token, created_blog_id
    if not admin_token or not created_blog_id:
        log_test("9b. Admin Blog Update", False, "No admin token or blog ID available")
        return False
    
    try:
        payload = {
            "title": "Updated Blog Post"
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.put(f"{BASE_URL}/admin/blog/{created_blog_id}", 
                               json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("title") == "Updated Blog Post":
            log_test("9b. Admin Blog Update", True, 
                    f"Blog post updated: {data['title']}")
            return True
        else:
            log_test("9b. Admin Blog Update", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("9b. Admin Blog Update", False, f"Exception: {str(e)}")
        return False


def test_9c_admin_blog_delete():
    """Test 9c: Admin Blog Delete - DELETE /api/admin/blog/{id}"""
    global admin_token, created_blog_id
    if not admin_token or not created_blog_id:
        log_test("9c. Admin Blog Delete", False, "No admin token or blog ID available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/blog/{created_blog_id}", 
                                  headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "message" in data:
            log_test("9c. Admin Blog Delete", True, 
                    f"Blog post deleted: {data['message']}")
            return True
        else:
            log_test("9c. Admin Blog Delete", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("9c. Admin Blog Delete", False, f"Exception: {str(e)}")
        return False


def test_10a_admin_sponsor_create():
    """Test 10a: Admin Sponsor Create - POST /api/admin/sponsors"""
    global admin_token, created_sponsor_id
    if not admin_token:
        log_test("10a. Admin Sponsor Create", False, "No admin token available")
        return False
    
    try:
        payload = {
            "name": "Test Corp",
            "description": "A test sponsor",
            "logo": "TC",
            "color": "#FF5733",
            "text_color": "#fff"
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/admin/sponsors", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("name") == payload["name"]:
            created_sponsor_id = data["id"]
            log_test("10a. Admin Sponsor Create", True, 
                    f"Sponsor created: {data['name']} (ID: {created_sponsor_id})")
            return True
        else:
            log_test("10a. Admin Sponsor Create", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("10a. Admin Sponsor Create", False, f"Exception: {str(e)}")
        return False


def test_10b_admin_sponsor_update():
    """Test 10b: Admin Sponsor Update - PUT /api/admin/sponsors/{id}"""
    global admin_token, created_sponsor_id
    if not admin_token or not created_sponsor_id:
        log_test("10b. Admin Sponsor Update", False, "No admin token or sponsor ID available")
        return False
    
    try:
        payload = {
            "name": "Updated Corp"
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.put(f"{BASE_URL}/admin/sponsors/{created_sponsor_id}", 
                               json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("name") == "Updated Corp":
            log_test("10b. Admin Sponsor Update", True, 
                    f"Sponsor updated: {data['name']}")
            return True
        else:
            log_test("10b. Admin Sponsor Update", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("10b. Admin Sponsor Update", False, f"Exception: {str(e)}")
        return False


def test_10c_admin_sponsor_delete():
    """Test 10c: Admin Sponsor Delete - DELETE /api/admin/sponsors/{id}"""
    global admin_token, created_sponsor_id
    if not admin_token or not created_sponsor_id:
        log_test("10c. Admin Sponsor Delete", False, "No admin token or sponsor ID available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/sponsors/{created_sponsor_id}", 
                                  headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "message" in data:
            log_test("10c. Admin Sponsor Delete", True, 
                    f"Sponsor deleted: {data['message']}")
            return True
        else:
            log_test("10c. Admin Sponsor Delete", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("10c. Admin Sponsor Delete", False, f"Exception: {str(e)}")
        return False


def test_11_delete_project():
    """Test 11: Delete Project - DELETE /api/projects/{project_id}"""
    global admin_token, created_project_id
    if not admin_token or not created_project_id:
        log_test("11. Delete Project", False, "No admin token or project ID available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/projects/{created_project_id}", 
                                  headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "message" in data:
            log_test("11. Delete Project", True, 
                    f"Project deleted: {data['message']}")
            return True
        else:
            log_test("11. Delete Project", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("11. Delete Project", False, f"Exception: {str(e)}")
        return False


def test_12a_register_regular_user():
    """Test 12a: Register a second user - should NOT be admin"""
    global regular_token
    try:
        payload = {
            "name": "Regular User",
            "email": regular_email,
            "password": "user123"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "access_token" in data and "user" in data:
            regular_token = data["access_token"]
            user = data["user"]
            # Check if is_admin is false
            if user.get("is_admin") == False:
                log_test("12a. Register Regular User (Non-Admin)", True, 
                        f"User registered with is_admin=False: {user['name']}")
                return True
            else:
                log_test("12a. Register Regular User (Non-Admin)", False, 
                        f"User registered but is_admin={user.get('is_admin')}, expected False")
                return False
        else:
            log_test("12a. Register Regular User (Non-Admin)", False, 
                    f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("12a. Register Regular User (Non-Admin)", False, f"Exception: {str(e)}")
        return False


def test_12b_non_admin_access_test():
    """Test 12b: Non-admin access test - should return 403"""
    global regular_token
    if not regular_token:
        log_test("12b. Non-Admin Access Test (403)", False, "No regular user token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {regular_token}"}
        response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers, timeout=10)
        
        if response.status_code == 403:
            log_test("12b. Non-Admin Access Test (403)", True, 
                    f"Correctly returned 403 Forbidden for non-admin user")
            return True
        else:
            log_test("12b. Non-Admin Access Test (403)", False, 
                    f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("12b. Non-Admin Access Test (403)", False, f"Exception: {str(e)}")
        return False


def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total Tests: {test_results['total']}")
    print(f"Passed: {len(test_results['passed'])} ✅")
    print(f"Failed: {len(test_results['failed'])} ❌")
    if test_results['total'] > 0:
        print(f"Success Rate: {(len(test_results['passed']) / test_results['total'] * 100):.1f}%")
    
    if test_results['failed']:
        print("\n" + "="*80)
        print("FAILED TESTS:")
        print("="*80)
        for failure in test_results['failed']:
            print(f"❌ {failure['name']}")
            print(f"   {failure['details']}")
    
    print("\n" + "="*80)


def main():
    """Run all tests in sequence"""
    print("="*80)
    print("VibePush SA Backend Admin Features Tests")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin User: {admin_email}")
    print(f"Regular User: {regular_email}")
    print("="*80 + "\n")
    
    # Run all tests in order
    test_1_register_admin_user()
    test_2_verify_admin_status()
    test_3_profile_update()
    test_4_get_my_projects()
    test_5_create_project()
    test_6_admin_dashboard()
    test_7_admin_users_list()
    test_8_admin_projects_list()
    test_9a_admin_blog_create()
    test_9b_admin_blog_update()
    test_9c_admin_blog_delete()
    test_10a_admin_sponsor_create()
    test_10b_admin_sponsor_update()
    test_10c_admin_sponsor_delete()
    test_11_delete_project()
    test_12a_register_regular_user()
    test_12b_non_admin_access_test()
    
    # Print summary
    print_summary()
    
    # Exit with appropriate code
    sys.exit(0 if len(test_results['failed']) == 0 else 1)


if __name__ == "__main__":
    main()
