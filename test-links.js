import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Testing project links...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('📸 Loading portfolio...');
    await page.goto('http://localhost:5173');
    
    // Wait for projects section
    console.log('⏳ Scrolling to projects...');
    await page.evaluate(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    
    // Try clicking on Bar Inventory demo button
    console.log('🔍 Looking for Bar Inventory demo button...');
    const barInventoryButton = await page.locator('text=Live Demo').first();
    
    if (await barInventoryButton.isVisible()) {
      console.log('✅ Found demo button - clicking...');
      await barInventoryButton.click();
      
      // Wait for navigation
      console.log('⏳ Waiting for navigation...');
      await page.waitForTimeout(2000);
      
      // Check current URL
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);
      
      // Take screenshot
      await page.screenshot({ path: 'test-project-click.png', fullPage: false });
      console.log('📸 Screenshot saved: test-project-click.png');
      
      if (currentUrl.includes('/projects/')) {
        console.log('✅ SUCCESS: Navigation to project works!');
      } else {
        console.log('❌ FAILED: Did not navigate to project');
      }
    } else {
      console.log('❌ Demo button not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();