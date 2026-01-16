import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.join(process.cwd(), '_artifacts');
const BASE_URL = 'http://localhost:5173';

// Ensure artifacts directory exists
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let testPassed = true;
  const errors = [];

  try {
    console.log('🧪 Edit Modal E2E Test Starting...\n');

    // Step 1: Navigate to app
    console.log('Step 1: Navigate to app');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('  ✅ App loaded\n');

    // Step 2: Add a new todo
    console.log('Step 2: Add a new todo item');
    const testText = 'Test Todo Item ' + Date.now();
    const input = page.locator('input[type="text"]').first();
    await input.fill(testText);
    await input.press('Enter');
    await page.waitForTimeout(500);
    console.log(`  ✅ Added todo: "${testText}"\n`);

    // Step 3: Screenshot before edit
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'edit_modal_01_before.png'), fullPage: true });
    console.log('  📸 Screenshot saved: edit_modal_01_before.png\n');

    // Step 4: Click on the todo item to open edit modal
    console.log('Step 3: Click on todo item to open Edit Modal');
    const todoItem = page.locator('text=' + testText).first();
    await todoItem.click();
    await page.waitForTimeout(500);

    // Step 5: Verify modal opened
    console.log('Step 4: Verify Edit Modal is visible');
    const modalTitle = page.locator('text=할 일 수정');
    const isModalVisible = await modalTitle.isVisible({ timeout: 3000 }).catch(() => false);

    if (!isModalVisible) {
      throw new Error('Edit Modal did not open! Modal title "할 일 수정" not found.');
    }
    console.log('  ✅ Edit Modal is visible\n');

    // Screenshot of modal
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'edit_modal_02_opened.png'), fullPage: true });
    console.log('  📸 Screenshot saved: edit_modal_02_opened.png\n');

    // Step 6: Edit the text (use modal context to select correct input)
    console.log('Step 5: Edit the todo text');
    const editedText = 'EDITED: ' + testText;
    const modal = page.locator('.fixed.z-50');
    const titleInput = modal.locator('input[type="text"]').first();
    await titleInput.clear();
    await titleInput.fill(editedText);
    console.log(`  ✅ Changed text to: "${editedText}"\n`);

    // Step 7: Change priority to High (select button within modal context)
    console.log('Step 6: Change priority to High');
    const highPriorityBtn = modal.locator('button:has-text("높음")');
    await highPriorityBtn.click();
    await page.waitForTimeout(300);
    console.log('  ✅ Priority set to High\n');

    // Step 8: Save (use modal context)
    console.log('Step 7: Click Save button');
    const saveBtn = modal.locator('button:has-text("저장")');
    await saveBtn.click();
    await page.waitForTimeout(500);
    console.log('  ✅ Save button clicked\n');

    // Step 9: Verify modal closed
    console.log('Step 8: Verify Modal closed');
    const isModalGone = await modalTitle.isHidden({ timeout: 2000 }).catch(() => false);
    if (!isModalGone) {
      throw new Error('Modal did not close after saving!');
    }
    console.log('  ✅ Modal closed successfully\n');

    // Step 10: Verify the text was updated in the list
    console.log('Step 9: Verify todo text was updated in the list');
    await page.waitForTimeout(500);
    const updatedItem = page.locator(`text=${editedText}`);
    const isUpdated = await updatedItem.isVisible({ timeout: 3000 }).catch(() => false);

    if (!isUpdated) {
      throw new Error(`Updated text "${editedText}" not found in the list!`);
    }
    console.log('  ✅ Todo text successfully updated\n');

    // Final screenshot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'edit_modal_03_after.png'), fullPage: true });
    console.log('  📸 Screenshot saved: edit_modal_03_after.png\n');

    console.log('═══════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED');
    console.log('═══════════════════════════════════════\n');

  } catch (e) {
    testPassed = false;
    errors.push(e.message);
    console.error('\n❌ TEST FAILED:', e.message);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'edit_modal_FAILURE.png'), fullPage: true });
    console.log('  📸 Failure screenshot saved: edit_modal_FAILURE.png\n');
  } finally {
    await browser.close();

    // Write test report
    const report = {
      test: 'Edit Task Modal (FEAT-EDIT-001)',
      timestamp: new Date().toISOString(),
      passed: testPassed,
      errors: errors,
      artifacts: [
        'edit_modal_01_before.png',
        'edit_modal_02_opened.png',
        'edit_modal_03_after.png',
        testPassed ? null : 'edit_modal_FAILURE.png'
      ].filter(Boolean)
    };

    fs.writeFileSync(
      path.join(ARTIFACTS_DIR, 'test_edit_modal.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('📋 Test report saved: _artifacts/test_edit_modal.json');

    process.exit(testPassed ? 0 : 1);
  }
})();
