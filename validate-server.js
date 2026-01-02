
import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Launching browser check...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  try {
    console.log('🌐 Navigating to http://127.0.0.1:5173...');
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2', timeout: 30000 });

    console.log('⏳ Waiting for content...');
    await page.waitForFunction(() => document.body.innerText.includes('PASCAL HINTERMAIER'), { timeout: 10000 });

    const title = await page.title();
    console.log(`✅ Page loaded! Title: "${title}"`);

    // Take a screenshot
    await page.screenshot({ path: 'server_check_screenshot.png' });
    console.log('📸 Screenshot saved to server_check_screenshot.png');

    // Check for the "Pascal Hintermaier" text to ensure content rendered
    const content = await page.content();
    if (content.includes('PASCAL HINTERMAIER')) {
      console.log('✅ Content Verification: "PASCAL HINTERMAIER" found.');
    } else {
      console.error('❌ Content Verification Failed: Name not found.');
    }

  } catch (error) {
    console.error('❌ Error verifying server:', error);
  } finally {
    await browser.close();
  }
})();
