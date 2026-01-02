import { chromium } from 'playwright';

(async () => {
  console.log('Starting browser test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('Navigating to portfolio...');
    await page.goto('http://localhost:5173');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Page loaded successfully!');
    
    // Take screenshot
    await page.screenshot({ path: 'portfolio-test.png', fullPage: true });
    console.log('Screenshot saved as portfolio-test.png');
    
    // Check main elements
    const title = await page.textContent('h1');
    console.log('Main title found:', title);
    
    // Test navigation
    const projectsLink = await page.locator('text=Projekte').first();
    if (await projectsLink.isVisible()) {
      console.log('Projects link found');
      await projectsLink.click();
      await page.waitForTimeout(1000);
      console.log('Navigation to projects successful');
    }
    
    // Check responsive design
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    console.log('Mobile viewport applied');
    await page.screenshot({ path: 'portfolio-mobile.png', fullPage: true });
    console.log('Mobile screenshot saved');
    
    console.log('Browser test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();