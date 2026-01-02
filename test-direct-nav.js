import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Testing direct navigation to projects...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('📍 Navigating directly to project...');
    await page.goto('http://localhost:5173/projects/bar-inventory/');
    
    const url = page.url();
    console.log(`📍 Current URL: ${url}`);
    
    // Check page content
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    const bodyText = await page.evaluate(() => document.body.innerText?.substring(0, 100));
    console.log(`📝 Page content preview: ${bodyText}`);
    
    if (url.includes('/projects/bar-inventory/')) {
      console.log('✅ SUCCESS: Direct navigation works!');
    } else {
      console.log('❌ FAILED: Could not navigate to project');
    }
    
    await page.screenshot({ path: 'direct-nav-result.png' });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();