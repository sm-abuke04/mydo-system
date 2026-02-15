from playwright.sync_api import sync_playwright, Page, expect

def test_dashboard_and_settings(page: Page):
    # Enable console logging
    # page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("requestfailed", lambda request: print(f"REQUEST FAILED: {request.url} - {request.failure}"))

    # Mock Auth and Data
    page.route("**/auth/v1/token*", lambda route: route.fulfill(
        status=200, content_type="application/json", body='''{
            "access_token": "fake-token", "token_type": "bearer", "expires_in": 3600, "refresh_token": "fake-refresh",
            "user": {"id": "test-user", "role": "authenticated", "email": "chair@sk.com", "app_metadata": {"provider": "email"}}
        }'''))

    page.route("**/rest/v1/users*", lambda route: route.fulfill(
        status=200, content_type="application/json", body='''{
            "id": "test-user",
            "email": "chair@sk.com",
            "role": "SK_CHAIR",
            "first_name": "Juan",
            "last_name": "Dela Cruz",
            "barangay": "Test Brgy",
            "status": "Active"
        }'''))

    # Empty profiles list for dashboard
    page.route("**/rest/v1/profiles*", lambda route: route.fulfill(status=200, content_type="application/json", body='''[]'''))

    print("Navigating to login...")
    page.goto("http://localhost:5173/login")
    page.fill("input[type='email']", "chair@sk.com")
    page.fill("input[type='password']", "password")
    page.click("button[type='submit']")

    print("Waiting for dashboard...")
    try:
        page.wait_for_url("**/sk/dashboard", timeout=10000)
    except:
        print("Redirect timed out.")

    # 1. Verify Dashboard Reports Toggle
    print("Testing Dashboard Reports Toggle...")
    # Using button name "Manage Reports" from Dashboard.jsx
    page.get_by_role("button", name="Manage Reports").click()

    expect(page.get_by_text("SK Reports Submission")).to_be_visible()

    # Click "Back to Dashboard"
    page.get_by_role("button", name="Back to Dashboard").click()

    # 2. Verify System Settings via Header Profile Menu
    print("Testing System Settings Navigation...")
    # Click Profile Dropdown
    page.get_by_role("button", name="Juan Dela Cruz").click()

    # Click System Settings in dropdown
    page.get_by_role("button", name="System Settings").click()

    print("Waiting for Settings page...")
    # Use heading to be specific
    expect(page.get_by_role("heading", name="System Configuration")).to_be_visible()

    # Change a setting
    print("Testing Settings Form...")
    page.locator("input").first.fill("Barangay Test") # Just fill the first input

    expect(page.get_by_text("Unsaved Changes")).to_be_visible()

    page.screenshot(path="/home/jules/verification/system_settings_final.png")

    # 3. Verify Logout
    print("Testing Logout...")
    # Click Profile Dropdown again
    page.get_by_role("button", name="Juan Dela Cruz").click()

    # Click Sign Out
    page.get_by_role("button", name="Sign Out").click()

    # Should be back at login
    print("Waiting for login page...")
    expect(page.get_by_role("button", name="Sign In")).to_be_visible() # "Sign In" button on login page

    print("Logout successful.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            test_dashboard_and_settings(page)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/home/jules/verification/error_final.png")
        finally:
            browser.close()
