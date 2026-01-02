"""
diagnostic_check.py - Visual & Log Capture for AI Analysis
A standard Playwright script that generates a rich diagnostic report
for an AI (like Antigravity) to analyze.
"""

from playwright.sync_api import sync_playwright
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    
    print("🚀 Starting Diagnostic Check...")
    
    # Capture console logs
    logs = []
    page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))
    
    try:
        page.goto("http://localhost:5173", wait_until="networkidle")
        
        # 1. Homepage Screenshot
        page.screenshot(path="diagnostic_home.png", full_page=True)
        print("✅ Captured Home Screenshot")
        
        # 2. Theme Check
        # Try to find the palette icon and click it
        palette_btn = page.locator("button:has-text('palette'), .theme-switcher-btn").first
        if palette_btn.is_visible():
            palette_btn.click()
            page.wait_for_timeout(1000)
            page.screenshot(path="diagnostic_theme_menu.png")
            print("✅ Captured Theme Menu Screenshot")

        # 3. Export accessibility tree (great for AI reasoning)
        ax_tree = page.accessibility.snapshot()
        with open("diagnostic_ax_tree.json", "w") as f:
            json.dump(ax_tree, f, indent=2)
        print("✅ Exported Accessibility Tree")

        # 4. Save Logs
        with open("diagnostic_logs.txt", "w") as f:
            f.write("\n".join(logs))
        print("✅ Saved Browser Logs")

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        browser.close()
        print("🏁 Diagnostic Check Completed. Review 'diagnostic_home.png' and 'diagnostic_logs.txt'")

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
