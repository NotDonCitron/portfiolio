import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Debugging project navigation...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  try {
    console.log('📸 Loading portfolio...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Scroll to projects
    await page.evaluate(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    
    // Get first button and inspect it
    const firstButton = await page.locator('button').filter({ hasText: /Demo/i }).first();
    
    console.log('🔍 Checking button properties...');
    const isDisabled = await firstButton.isDisabled();
    const isVisible = await firstButton.isVisible();
    const hasPointerEvents = await firstButton.evaluate(el => {
      return window.getComputedStyle(el).pointerEvents;
    });
    
    console.log(`   Visible: ${isVisible}`);
    console.log(`   Disabled: ${isDisabled}`);
    console.log(`   Pointer events: ${hasPointerEvents}`);
    
    // Try manual navigation
    console.log('🧪 Testing manual window.location.href change...');
    const navResult = await page.evaluate(() => {
      try {
        const buttons = Array.from(document.querySelectorAll('button'));
        const demoBtn = buttons.find(btn => btn.textContent?.includes('Demo'));
        
        if (demoBtn) {
          console.log('Found demo button:', demoBtn.textContent?.trim());
          console.log('Click event listeners:', window.getEventListeners ? window.getEventListeners(demoBtn) : 'N/A');
          
          // Try clicking
          demoBtn.click();
          return { success: true, message: 'Click executed' };
        }
        return { success: false, message: 'Button not found' };
      } catch (e) {
        return { success: false, message: e.message };
      }
    });
    
    console.log('🔧 Navigation result:', navResult);
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-navigation.png' });
    console.log('📸 Debug screenshot saved');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();