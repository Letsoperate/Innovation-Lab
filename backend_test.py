#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for VibePush SA Platform
Tests all endpoints as specified in the review request
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
auth_token = None
test_user_email = f"thabo.mokoena.{datetime.now().timestamp()}@uct.ac.za"
test_user_password = "VibePush2025!"
created_project_id = None
blog_post_id = None


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


def test_health_check():
    """Test 1: Health Check - GET /api/"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("message") == "VibePush SA API" and data.get("status") == "running":
            log_test("Health Check", True, f"API is running: {data}")
            return True
        else:
            log_test("Health Check", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Health Check", False, f"Exception: {str(e)}")
        return False


def test_seed_database():
    """Test 2: Seed Database - POST /api/seed"""
    try:
        response = requests.post(f"{BASE_URL}/seed", timeout=30)
        data = response.json()
        
        if response.status_code == 200 and "counts" in data:
            log_test("Seed Database", True, f"Database seeded: {data['counts']}")
            return True
        else:
            log_test("Seed Database", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Seed Database", False, f"Exception: {str(e)}")
        return False


def test_get_categories():
    """Test 3: Get Categories - GET /api/categories"""
    try:
        response = requests.get(f"{BASE_URL}/categories", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list) and len(data) > 0:
            log_test("Get Categories", True, f"Retrieved {len(data)} categories")
            return True
        else:
            log_test("Get Categories", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Categories", False, f"Exception: {str(e)}")
        return False


def test_get_tracks():
    """Test 4: Get Tracks - GET /api/tracks"""
    try:
        response = requests.get(f"{BASE_URL}/tracks", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list) and len(data) > 0:
            log_test("Get Tracks", True, f"Retrieved {len(data)} tracks")
            return True
        else:
            log_test("Get Tracks", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Tracks", False, f"Exception: {str(e)}")
        return False


def test_get_audiences():
    """Test 5: Get Audiences - GET /api/audiences"""
    try:
        response = requests.get(f"{BASE_URL}/audiences", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list) and len(data) > 0:
            log_test("Get Audiences", True, f"Retrieved {len(data)} audiences")
            return True
        else:
            log_test("Get Audiences", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Audiences", False, f"Exception: {str(e)}")
        return False


def test_get_sponsors():
    """Test 6: Get Sponsors - GET /api/sponsors"""
    try:
        response = requests.get(f"{BASE_URL}/sponsors", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list) and len(data) > 0:
            log_test("Get Sponsors", True, f"Retrieved {len(data)} sponsors")
            return True
        else:
            log_test("Get Sponsors", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Sponsors", False, f"Exception: {str(e)}")
        return False


def test_get_faq():
    """Test 7: Get FAQ - GET /api/faq"""
    try:
        response = requests.get(f"{BASE_URL}/faq", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list) and len(data) > 0:
            log_test("Get FAQ", True, f"Retrieved {len(data)} FAQ items")
            return True
        else:
            log_test("Get FAQ", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get FAQ", False, f"Exception: {str(e)}")
        return False


def test_get_blog():
    """Test 8: Get Blog Posts - GET /api/blog"""
    global blog_post_id
    try:
        response = requests.get(f"{BASE_URL}/blog", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list) and len(data) > 0:
            blog_post_id = data[0]["id"]
            log_test("Get Blog Posts", True, f"Retrieved {len(data)} blog posts")
            return True
        else:
            log_test("Get Blog Posts", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Blog Posts", False, f"Exception: {str(e)}")
        return False


def test_get_single_blog_post():
    """Test 9: Get Single Blog Post - GET /api/blog/{id}"""
    global blog_post_id
    if not blog_post_id:
        log_test("Get Single Blog Post", False, "No blog post ID available")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/blog/{blog_post_id}", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("id") == blog_post_id:
            log_test("Get Single Blog Post", True, f"Retrieved blog post: {data.get('title')}")
            return True
        else:
            log_test("Get Single Blog Post", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Single Blog Post", False, f"Exception: {str(e)}")
        return False


def test_auth_register():
    """Test 10: Auth Register - POST /api/auth/register"""
    global auth_token
    try:
        payload = {
            "name": "Thabo Mokoena",
            "email": test_user_email,
            "password": test_user_password,
            "institution": "University of Cape Town"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "access_token" in data and "user" in data:
            auth_token = data["access_token"]
            log_test("Auth Register", True, f"User registered: {data['user']['name']}")
            return True
        else:
            log_test("Auth Register", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Auth Register", False, f"Exception: {str(e)}")
        return False


def test_auth_login():
    """Test 11: Auth Login - POST /api/auth/login"""
    global auth_token
    try:
        payload = {
            "email": test_user_email,
            "password": test_user_password
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "access_token" in data:
            auth_token = data["access_token"]
            log_test("Auth Login", True, f"User logged in: {data['user']['email']}")
            return True
        else:
            log_test("Auth Login", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Auth Login", False, f"Exception: {str(e)}")
        return False


def test_auth_get_me():
    """Test 12: Auth Get Me - GET /api/auth/me"""
    global auth_token
    if not auth_token:
        log_test("Auth Get Me", False, "No auth token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("email") == test_user_email:
            log_test("Auth Get Me", True, f"User profile retrieved: {data['name']}")
            return True
        else:
            log_test("Auth Get Me", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Auth Get Me", False, f"Exception: {str(e)}")
        return False


def test_get_projects_top():
    """Test 13: Get Projects (Top) - GET /api/projects?tab=top"""
    try:
        response = requests.get(f"{BASE_URL}/projects?tab=top", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "projects" in data and "total" in data:
            log_test("Get Projects (Top)", True, f"Retrieved {len(data['projects'])} projects, total: {data['total']}")
            return True
        else:
            log_test("Get Projects (Top)", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Projects (Top)", False, f"Exception: {str(e)}")
        return False


def test_get_projects_grouped():
    """Test 14: Get Grouped Projects - GET /api/projects/grouped"""
    try:
        response = requests.get(f"{BASE_URL}/projects/grouped", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "today" in data and "yesterday" in data and "week" in data and "month" in data:
            log_test("Get Grouped Projects", True, f"Retrieved grouped projects: today={len(data['today'])}, week={len(data['week'])}")
            return True
        else:
            log_test("Get Grouped Projects", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Grouped Projects", False, f"Exception: {str(e)}")
        return False


def test_create_project():
    """Test 15: Create Project - POST /api/projects"""
    global auth_token, created_project_id
    if not auth_token:
        log_test("Create Project", False, "No auth token available")
        return False
    
    try:
        payload = {
            "name": "Mzansi Code Hub",
            "tagline": "Community-driven coding platform for South African developers",
            "description": "Mzansi Code Hub connects developers across South Africa, providing resources, mentorship, and collaboration opportunities. Built with modern web technologies and a focus on accessibility.",
            "demo_url": "https://mzansi-code-hub.example.com",
            "category": "web-apps",
            "track": "innovation",
            "institution": "University of Cape Town",
            "team_name": "Code Warriors SA",
            "team_size": 3,
            "tech_stack": "React, Node.js, PostgreSQL, Tailwind CSS"
        }
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/projects", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("name") == payload["name"]:
            created_project_id = data["id"]
            log_test("Create Project", True, f"Project created: {data['name']} (ID: {created_project_id})")
            return True
        else:
            log_test("Create Project", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Create Project", False, f"Exception: {str(e)}")
        return False


def test_get_single_project():
    """Test 16: Get Single Project - GET /api/projects/{id}"""
    global created_project_id
    if not created_project_id:
        log_test("Get Single Project", False, "No project ID available")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/projects/{created_project_id}", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("id") == created_project_id:
            log_test("Get Single Project", True, f"Retrieved project: {data['name']}")
            return True
        else:
            log_test("Get Single Project", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Single Project", False, f"Exception: {str(e)}")
        return False


def test_vote_project_first():
    """Test 17: Vote Project (First Toggle) - POST /api/projects/{id}/vote"""
    global auth_token, created_project_id
    if not auth_token or not created_project_id:
        log_test("Vote Project (First Toggle)", False, "Missing auth token or project ID")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/projects/{created_project_id}/vote", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("voted") == True:
            log_test("Vote Project (First Toggle)", True, f"Vote added: upvotes={data.get('upvotes')}")
            return True
        else:
            log_test("Vote Project (First Toggle)", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Vote Project (First Toggle)", False, f"Exception: {str(e)}")
        return False


def test_vote_project_second():
    """Test 18: Vote Project (Second Toggle) - POST /api/projects/{id}/vote"""
    global auth_token, created_project_id
    if not auth_token or not created_project_id:
        log_test("Vote Project (Second Toggle)", False, "Missing auth token or project ID")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/projects/{created_project_id}/vote", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("voted") == False:
            log_test("Vote Project (Second Toggle)", True, f"Vote removed: upvotes={data.get('upvotes')}")
            return True
        else:
            log_test("Vote Project (Second Toggle)", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Vote Project (Second Toggle)", False, f"Exception: {str(e)}")
        return False


def test_get_vote_ids():
    """Test 19: Get Vote IDs - GET /api/votes/ids"""
    global auth_token
    if not auth_token:
        log_test("Get Vote IDs", False, "No auth token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/votes/ids", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "ids" in data:
            log_test("Get Vote IDs", True, f"Retrieved {len(data['ids'])} voted project IDs")
            return True
        else:
            log_test("Get Vote IDs", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Vote IDs", False, f"Exception: {str(e)}")
        return False


def test_add_comment():
    """Test 20: Add Comment - POST /api/projects/{id}/comments"""
    global auth_token, created_project_id
    if not auth_token or not created_project_id:
        log_test("Add Comment", False, "Missing auth token or project ID")
        return False
    
    try:
        payload = {"text": "This is an amazing project! The UI is clean and the concept addresses a real need in the SA developer community. Well done!"}
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/projects/{created_project_id}/comments", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("text") == payload["text"]:
            log_test("Add Comment", True, f"Comment added by {data['user_name']}")
            return True
        else:
            log_test("Add Comment", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Add Comment", False, f"Exception: {str(e)}")
        return False


def test_get_comments():
    """Test 21: Get Comments - GET /api/projects/{id}/comments"""
    global created_project_id
    if not created_project_id:
        log_test("Get Comments", False, "No project ID available")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/projects/{created_project_id}/comments", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list) and len(data) > 0:
            log_test("Get Comments", True, f"Retrieved {len(data)} comments")
            return True
        else:
            log_test("Get Comments", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Comments", False, f"Exception: {str(e)}")
        return False


def test_bookmark_project_first():
    """Test 22: Bookmark Project (First Toggle) - POST /api/projects/{id}/bookmark"""
    global auth_token, created_project_id
    if not auth_token or not created_project_id:
        log_test("Bookmark Project (First Toggle)", False, "Missing auth token or project ID")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/projects/{created_project_id}/bookmark", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("bookmarked") == True:
            log_test("Bookmark Project (First Toggle)", True, "Bookmark added")
            return True
        else:
            log_test("Bookmark Project (First Toggle)", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Bookmark Project (First Toggle)", False, f"Exception: {str(e)}")
        return False


def test_get_bookmark_ids():
    """Test 23: Get Bookmark IDs - GET /api/bookmarks/ids"""
    global auth_token
    if not auth_token:
        log_test("Get Bookmark IDs", False, "No auth token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/bookmarks/ids", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "ids" in data and len(data["ids"]) > 0:
            log_test("Get Bookmark IDs", True, f"Retrieved {len(data['ids'])} bookmarked project IDs")
            return True
        else:
            log_test("Get Bookmark IDs", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Bookmark IDs", False, f"Exception: {str(e)}")
        return False


def test_get_bookmarks():
    """Test 24: Get Bookmarks - GET /api/bookmarks"""
    global auth_token
    if not auth_token:
        log_test("Get Bookmarks", False, "No auth token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/bookmarks", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "projects" in data and len(data["projects"]) > 0:
            log_test("Get Bookmarks", True, f"Retrieved {len(data['projects'])} bookmarked projects")
            return True
        else:
            log_test("Get Bookmarks", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Bookmarks", False, f"Exception: {str(e)}")
        return False


def test_get_stats():
    """Test 25: Get Stats - GET /api/stats"""
    try:
        response = requests.get(f"{BASE_URL}/stats", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "total_projects" in data and "total_votes" in data:
            log_test("Get Stats", True, f"Stats: {data['total_projects']} projects, {data['total_votes']} votes")
            return True
        else:
            log_test("Get Stats", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Stats", False, f"Exception: {str(e)}")
        return False


def test_get_leaderboard_all():
    """Test 26: Get Leaderboard (All) - GET /api/leaderboard?period=all"""
    try:
        response = requests.get(f"{BASE_URL}/leaderboard?period=all", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "projects" in data:
            log_test("Get Leaderboard (All)", True, f"Retrieved {len(data['projects'])} projects")
            return True
        else:
            log_test("Get Leaderboard (All)", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Leaderboard (All)", False, f"Exception: {str(e)}")
        return False


def test_get_leaderboard_month():
    """Test 27: Get Leaderboard (Month) - GET /api/leaderboard?period=month"""
    try:
        response = requests.get(f"{BASE_URL}/leaderboard?period=month", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "projects" in data:
            log_test("Get Leaderboard (Month)", True, f"Retrieved {len(data['projects'])} projects")
            return True
        else:
            log_test("Get Leaderboard (Month)", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Leaderboard (Month)", False, f"Exception: {str(e)}")
        return False


def test_get_hall_of_fame():
    """Test 28: Get Hall of Fame - GET /api/hall-of-fame"""
    try:
        response = requests.get(f"{BASE_URL}/hall-of-fame", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "items" in data:
            log_test("Get Hall of Fame", True, f"Retrieved {len(data['items'])} hall of fame items")
            return True
        else:
            log_test("Get Hall of Fame", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Get Hall of Fame", False, f"Exception: {str(e)}")
        return False


def test_search_ai():
    """Test 29: Search (AI) - GET /api/search?q=AI"""
    try:
        response = requests.get(f"{BASE_URL}/search?q=AI", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "projects" in data:
            log_test("Search (AI)", True, f"Found {len(data['projects'])} projects matching 'AI'")
            return True
        else:
            log_test("Search (AI)", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Search (AI)", False, f"Exception: {str(e)}")
        return False


def test_search_farm():
    """Test 30: Search (farm) - GET /api/search?q=farm"""
    try:
        response = requests.get(f"{BASE_URL}/search?q=farm", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "projects" in data:
            log_test("Search (farm)", True, f"Found {len(data['projects'])} projects matching 'farm'")
            return True
        else:
            log_test("Search (farm)", False, f"Unexpected response: {response.status_code} - {data}")
            return False
    except Exception as e:
        log_test("Search (farm)", False, f"Exception: {str(e)}")
        return False


def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total Tests: {test_results['total']}")
    print(f"Passed: {len(test_results['passed'])} ✅")
    print(f"Failed: {len(test_results['failed'])} ❌")
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
    print("VibePush SA Backend API Tests")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test User: {test_user_email}")
    print("="*80 + "\n")
    
    # Run all tests in order
    test_health_check()
    test_seed_database()
    test_get_categories()
    test_get_tracks()
    test_get_audiences()
    test_get_sponsors()
    test_get_faq()
    test_get_blog()
    test_get_single_blog_post()
    test_auth_register()
    test_auth_login()
    test_auth_get_me()
    test_get_projects_top()
    test_get_projects_grouped()
    test_create_project()
    test_get_single_project()
    test_vote_project_first()
    test_vote_project_second()
    test_get_vote_ids()
    test_add_comment()
    test_get_comments()
    test_bookmark_project_first()
    test_get_bookmark_ids()
    test_get_bookmarks()
    test_get_stats()
    test_get_leaderboard_all()
    test_get_leaderboard_month()
    test_get_hall_of_fame()
    test_search_ai()
    test_search_farm()
    
    # Print summary
    print_summary()
    
    # Exit with appropriate code
    sys.exit(0 if len(test_results['failed']) == 0 else 1)


if __name__ == "__main__":
    main()
