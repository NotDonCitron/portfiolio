import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Checking for React errors...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('❌ Page Error:', error.message);
  });
  
  try {
    console.log('📸 Loading portfolio...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    // Wait a bit for animations
    await page.waitForTimeout(5000);
    
    // Check for React error overlay
    const hasReactError = await page.locator('text=/Application Error|TypeError/i').count();
    
    if (hasReactError > 0) {
      console.log('❌ React Error Overlay detected!');
    }
    
    // Check page title
    const title = await page.title();
    console.log(`📄 Page Title: ${title}`);
    
    // Check if main content loaded
    const mainHeading = await page.locator('h1').first().textContent();
    console.log(`🎯 Main Heading: ${mainHeading}`);
    
    if (errors.length > 0) {
      console.log(`\n❌ Found ${errors.length} errors`);
    } else {
      console.log('\n✅ No errors detected - Portfolio is healthy!');
    }
    
    await page.screenshot({ path: 'error-check.png' });
    console.log('📸 Screenshot saved: error-check.png');
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
  } finally {
    await browser.close();
  }
})();