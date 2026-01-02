import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Testing project section clicks...');
  
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
    
    // Take screenshot of projects section
    await page.screenshot({ path: 'projects-section.png', fullPage: false });
    console.log('📸 Screenshot saved: projects-section.png');
    
    // Try to find all buttons and links in projects section
    console.log('🔍 Looking for project links...');
    
    // Get all anchor tags in projects section
    const projectLinks = await page.locator('#projects a').all();
    console.log(`📊 Found ${projectLinks.length} links in projects section`);
    
    // Log all link hrefs
    for (let i = 0; i < projectLinks.length; i++) {
      const href = await projectLinks[i].getAttribute('href');
      const text = await projectLinks[i].textContent();
      console.log(`   ${i + 1}. "${text?.trim()}" -> ${href}`);
    }
    
    // Try clicking the first project link
    if (projectLinks.length > 0) {
      console.log('🖱️ Clicking first project link...');
      const firstLink = projectLinks[0];
      const beforeUrl = page.url();
      
      await firstLink.click();
      await page.waitForTimeout(2000);
      
      const afterUrl = page.url();
      console.log(`📍 URL changed from: ${beforeUrl}`);
      console.log(`📍 URL changed to: ${afterUrl}`);
      
      if (beforeUrl !== afterUrl) {
        console.log('✅ Navigation successful!');
      } else {
        console.log('❌ Navigation failed - URL did not change');
      }
      
      await page.screenshot({ path: 'after-click.png', fullPage: false });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();