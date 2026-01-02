import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Final test - clicking all project links...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Go to main page
    console.log('📸 Loading portfolio...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Scroll to projects
    await page.evaluate(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    
    // Get all project links
    const links = await page.locator('#projects a[href^="/projects/"]').all();
    console.log(`📊 Found ${links.length} project links`);
    
    // Test each link
    for (let i = 0; i < Math.min(3, links.length); i++) {
      const link = links[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      
      console.log(`\n🧪 Testing: ${text?.trim()} -> ${href}`);
      
      // Click and check if navigation works
      await link.click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/projects/')) {
        console.log(`✅ SUCCESS: ${text?.trim()} - Navigated to ${currentUrl}`);
      } else {
        console.log(`❌ FAILED: ${text?.trim()} - Still at ${currentUrl}`);
      }
      
      // Go back
      await page.goBack();
      await page.waitForTimeout(1000);
    }
    
    console.log('\n🎉 Test complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();