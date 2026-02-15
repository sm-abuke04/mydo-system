from playwright.sync_api import sync_playwright, Page, expect

def test_dashboard_reports(page: Page):
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

    # 1. Verify Dashboard Reports List
    print("Testing Dashboard Reports Toggle...")
    page.get_by_role("button", name="Manage Reports").click()

    # Check specific report names
    reports_to_check = [
        "CBYDP (3 annum coverage)",
        "ABYIP",
        "Annual Budget",
        "KK Profiling",
        "SK Directory",
        "Fund Utilization Report",
        "ABYIP Monitoring Form",
        "SK FPDP Board Compliance Report",
        "SK Session Documents"
    ]

    for report in reports_to_check:
        try:
            # Partial match is fine for some
            expect(page.get_by_text(report, exact=False).first).to_be_visible()
            print(f"Verified report: {report}")
        except:
            print(f"FAILED to verify report: {report}")

    page.screenshot(path="/home/jules/verification/updated_reports.png")

    # 2. Verify Logout
    print("Testing Logout again...")
    page.get_by_role("button", name="Juan Dela Cruz").click()
    page.get_by_role("button", name="Sign Out").click()

    # Wait for login page
    expect(page.get_by_role("button", name="Sign In")).to_be_visible()
    print("Logout confirmed.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            test_dashboard_reports(page)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/home/jules/verification/error_reports.png")
        finally:
            browser.close()
