import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.join(process.cwd(), '_artifacts');
const BASE_URL = 'http://localhost:5173';

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let testPassed = true;
  const errors = [];

  // Handle alerts
  page.on('dialog', async dialog => {
    console.log(`  📢 Alert: ${dialog.message()}`);
    await dialog.accept();
  });

  try {
    console.log('🧪 Smart Paste Import E2E Test Starting...\n');

    // Step 1: Navigate to app
    console.log('Step 1: Navigate to app');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('  ✅ App loaded\n');

    // Step 2: Clear any existing todos from localStorage
    console.log('Step 2: Clear existing data');
    await page.evaluate(() => localStorage.removeItem('vibe-todos'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    console.log('  ✅ Cleared localStorage\n');

    // Screenshot initial state
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'import_01_initial.png'), fullPage: true });
    console.log('  📸 Screenshot saved: import_01_initial.png\n');

    // Step 3: Click the "붙여넣기" button to open import modal
    console.log('Step 3: Open Paste Import Modal');
    const pasteBtn = page.locator('button:has-text("붙여넣기")');
    await pasteBtn.click();
    await page.waitForTimeout(500);
    console.log('  ✅ Clicked 붙여넣기 button\n');

    // Step 4: Verify modal opened
    console.log('Step 4: Verify modal is visible');
    const modalTitle = page.locator('text=텍스트로 가져오기');
    const isModalVisible = await modalTitle.isVisible({ timeout: 3000 }).catch(() => false);
    if (!isModalVisible) {
      throw new Error('Paste Import Modal did not open!');
    }
    console.log('  ✅ Modal is visible\n');

    // Screenshot modal
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'import_02_modal.png'), fullPage: true });
    console.log('  📸 Screenshot saved: import_02_modal.png\n');

    // Step 5: Paste multiple lines of text
    console.log('Step 5: Paste text with 5 items');
    const testItems = [
      '우유 사기',
      '- 운동하기',
      '- [ ] 책 읽기',
      '1. 코드 리뷰',
      '이메일 확인'
    ];
    const pasteText = testItems.join('\n');

    const textarea = page.locator('textarea');
    await textarea.fill(pasteText);
    console.log(`  ✅ Pasted ${testItems.length} lines of text\n`);

    // Screenshot with text
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'import_03_pasted.png'), fullPage: true });
    console.log('  📸 Screenshot saved: import_03_pasted.png\n');

    // Step 6: Click import button
    console.log('Step 6: Click Import button');
    const importBtn = page.locator('button:has-text("가져오기")');
    await importBtn.click();
    await page.waitForTimeout(1000);
    console.log('  ✅ Import button clicked\n');

    // Step 7: Verify modal closed
    console.log('Step 7: Verify modal closed');
    const isModalGone = await modalTitle.isHidden({ timeout: 2000 }).catch(() => false);
    if (!isModalGone) {
      throw new Error('Modal did not close after import!');
    }
    console.log('  ✅ Modal closed\n');

    // Screenshot after import
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'import_04_result.png'), fullPage: true });
    console.log('  📸 Screenshot saved: import_04_result.png\n');

    // Step 8: Verify todos were created
    console.log('Step 8: Verify todos created');
    const todos = await page.evaluate(() => {
      const data = localStorage.getItem('vibe-todos');
      return data ? JSON.parse(data) : [];
    });

    console.log(`  📊 Total todos in storage: ${todos.length}`);

    if (todos.length !== 5) {
      throw new Error(`Expected 5 todos, but found ${todos.length}`);
    }
    console.log('  ✅ Correct number of todos created (5)\n');

    // Step 9: Verify each todo text was parsed correctly
    console.log('Step 9: Verify parsed text is correct');
    const expectedTexts = ['우유 사기', '운동하기', '책 읽기', '코드 리뷰', '이메일 확인'];
    const actualTexts = todos.map(t => t.text);

    for (const expected of expectedTexts) {
      if (!actualTexts.includes(expected)) {
        throw new Error(`Expected todo "${expected}" not found! Got: ${actualTexts.join(', ')}`);
      }
      console.log(`  ✅ Found: "${expected}"`);
    }
    console.log('');

    // Step 10: Verify todos appear in the UI list
    console.log('Step 10: Verify todos visible in UI');
    for (const text of expectedTexts) {
      const todoItem = page.locator(`text=${text}`).first();
      const isVisible = await todoItem.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isVisible) {
        throw new Error(`Todo "${text}" not visible in UI!`);
      }
    }
    console.log('  ✅ All todos visible in the list\n');

    // Final screenshot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'import_05_final.png'), fullPage: true });
    console.log('  📸 Screenshot saved: import_05_final.png\n');

    console.log('═══════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED - FEAT-IMPORT-001');
    console.log('═══════════════════════════════════════\n');

  } catch (e) {
    testPassed = false;
    errors.push(e.message);
    console.error('\n❌ TEST FAILED:', e.message);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'import_FAILURE.png'), fullPage: true });
    console.log('  📸 Failure screenshot saved: import_FAILURE.png\n');
  } finally {
    await browser.close();

    const report = {
      test: 'Smart Paste Import (FEAT-IMPORT-001)',
      timestamp: new Date().toISOString(),
      passed: testPassed,
      errors: errors,
      artifacts: [
        'import_01_initial.png',
        'import_02_modal.png',
        'import_03_pasted.png',
        'import_04_result.png',
        'import_05_final.png',
        testPassed ? null : 'import_FAILURE.png'
      ].filter(Boolean)
    };

    fs.writeFileSync(
      path.join(ARTIFACTS_DIR, 'test_import.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('📋 Test report saved: _artifacts/test_import.json');

    process.exit(testPassed ? 0 : 1);
  }
})();
