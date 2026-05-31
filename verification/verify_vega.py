from playwright.sync_api import sync_playwright
import time

def run_cuj(page):
    try:
        page.goto("http://localhost:3000", timeout=30000)
        page.wait_for_timeout(5000)
        page.screenshot(path="/app/verification/screenshots/verification.png")
        print("Screenshot saved.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/app/verification/videos")
        page = context.new_page()
        run_cuj(page)
        context.close()
        browser.close()
