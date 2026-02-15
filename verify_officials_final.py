from playwright.sync_api import sync_playwright, Page, expect

def test_sk_officials(page: Page):
    page.route("**/auth/v1/token*", lambda route: route.fulfill(
        status=200, content_type="application/json", body='''{
            "access_token": "fake-token", "token_type": "bearer", "expires_in": 3600, "refresh_token": "fake-refresh",
            "user": {"id": "test-user", "role": "authenticated", "email": "chair@sk.com", "app_metadata": {"provider": "email"}}
        }'''))
    page.route("**/rest/v1/users*", lambda route: route.fulfill(status=200, content_type="application/json", body='''{"id": "test-user", "role": "SK_CHAIR", "status": "Active"}'''))
    page.route("**/rest/v1/sk_officials*", lambda route: route.fulfill(status=200, content_type="application/json", body='''[{"id": 1, "name": "Hon. Juan", "position": "SK Chairperson", "status": "Active"}]'''))

    page.goto("http://localhost:5173/login")
    page.fill("input[type='email']", "chair@sk.com")
    page.fill("input[type='password']", "password")
    page.click("button[type='submit']")
    try: page.wait_for_url("**/sk/dashboard", timeout=5000)
    except: pass

    page.get_by_role("link", name="SK Officials").click()
    page.get_by_role("button", name="Add Official").click()
    expect(page.get_by_text("Add New Official")).to_be_visible()
    page.screenshot(path="/home/jules/verification/sk_officials_modal.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    test_sk_officials(browser.new_page())
    browser.close()
