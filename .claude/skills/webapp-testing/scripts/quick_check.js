import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * Quick Check Script
 * Usage: node check_url.js <url> <selector_to_wait_for>
 */
const [, , url, selector] = process.argv;

if (!url || !selector) {
    console.error('Usage: node quick_check.js <url> <selector>');
    process.exit(1);
}

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.goto(url);

        console.log(`Waiting for selector: ${selector}`);
        await page.waitForSelector(selector, { timeout: 5000 });

        console.log('✅ Found!');
        await page.screenshot({ path: 'check_success.png' });

    } catch (e) {
        console.error('❌ Failed:', e.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
