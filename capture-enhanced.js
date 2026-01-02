import { chromium } from 'playwright';

(async () => {
  console.log('🔥 Capturing Enhanced Portfolio...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('📸 Loading enhanced portfolio...');
    await page.goto('http://localhost:5173');
    
    // Wait for hero section
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    console.log('✨ Capturing Featured section...');
    await page.evaluate(() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }));
    await page.waitForTimeout(2000);
    
    // Take screenshot of featured section
    await page.screenshot({ 
      path: 'portfolio-featured.png', 
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    console.log('🎯 Capturing full page...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'portfolio-enhanced-full.png', fullPage: true });
    
    console.log('🚀 Enhanced Portfolio Captured Successfully!');
    console.log('📁 Screenshots saved:');
    console.log('   - portfolio-featured.png (Featured section)');
    console.log('   - portfolio-enhanced-full.png (Full page)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();