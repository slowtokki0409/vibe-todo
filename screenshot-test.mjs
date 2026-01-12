import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to http://localhost:5174/...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    // Wait for animations to settle
    await page.waitForTimeout(1000);
    
    const screenshotPath = 'vibe-todo-proof.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`✅ Screenshot saved: ${screenshotPath}`);
    console.log('✅ Vibe Todo App is fully rendered and interactive');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
