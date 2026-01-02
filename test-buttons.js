import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Testing project buttons...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('📸 Loading portfolio...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Scroll to projects section
    console.log('⏳ Scrolling to projects...');
    await page.evaluate(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    
    // Try to find and click on button with "Live Demo" text
    console.log('🔍 Looking for "Live Demo" button...');
    
    // Try all buttons containing project demo text
    const demoButton = page.getByText(/Live Demo|Demo|Tool öffnen|Check Now/i).first();
    
    if (await demoButton.isVisible()) {
      console.log('✅ Found demo button - clicking...');
      const beforeUrl = page.url();
      
      await demoButton.click();
      await page.waitForTimeout(3000);
      
      const afterUrl = page.url();
      console.log(`📍 Before: ${beforeUrl}`);
      console.log(`📍 After: ${afterUrl}`);
      
      if (beforeUrl !== afterUrl) {
        console.log('✅ SUCCESS: Navigation worked!');
      } else {
        console.log('❌ FAILED: URL did not change');
      }
      
      await page.screenshot({ path: 'button-click-result.png', fullPage: false });
    } else {
      console.log('❌ Demo button not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();