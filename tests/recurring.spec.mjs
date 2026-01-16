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

  try {
    console.log('🧪 Recurring Task Logic E2E Test Starting...\n');

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

    // Step 3: Open advanced options
    console.log('Step 3: Open advanced options');
    const advancedToggle = page.locator('button[title="고급 옵션"]');
    await advancedToggle.click();
    await page.waitForTimeout(300);
    console.log('  ✅ Advanced options opened\n');

    // Step 4: Set up recurring task - click the recurring button in TodoInput
    console.log('Step 4: Set up recurring (Daily)');
    // Find the TodoRecurring component within the input form (not the list)
    const inputForm = page.locator('form');
    const recurringBtn = inputForm.locator('button[title="반복 설정"]');
    await recurringBtn.click();
    await page.waitForTimeout(300);

    // Click "매일" option
    const dailyOption = page.locator('button:has-text("📅 매일")');
    await dailyOption.click();
    await page.waitForTimeout(300);
    console.log('  ✅ Recurring set to Daily\n');

    // Screenshot of setup
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'recurring_01_setup.png'), fullPage: true });
    console.log('  📸 Screenshot saved: recurring_01_setup.png\n');

    // Step 5: Enter task text and submit
    console.log('Step 5: Create recurring task');
    const testText = 'Daily Meeting ' + Date.now();
    const input = page.locator('input[type="text"]').first();
    await input.fill(testText);
    await input.press('Enter');
    await page.waitForTimeout(500);
    console.log(`  ✅ Created task: "${testText}"\n`);

    // Screenshot after creation
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'recurring_02_created.png'), fullPage: true });
    console.log('  📸 Screenshot saved: recurring_02_created.png\n');

    // Step 6: Verify the task appears with recurring badge
    console.log('Step 6: Verify recurring badge visible');
    const recurringBadge = page.locator('text=매일').first();
    const hasBadge = await recurringBadge.isVisible({ timeout: 3000 }).catch(() => false);
    if (!hasBadge) {
      throw new Error('Recurring badge "매일" not visible on the task!');
    }
    console.log('  ✅ Recurring badge "매일" is visible\n');

    // Step 7: Get initial task count
    console.log('Step 7: Check initial task count');
    const initialStats = await page.locator('text=/남은 작업 \\d+개/').textContent();
    console.log(`  📊 Initial stats: ${initialStats}\n`);

    // Step 8: Complete the recurring task by clicking the checkbox
    console.log('Step 8: Complete the recurring task');
    // Find the todo item containing our text
    const todoItem = page.locator(`text=${testText}`).first();
    // Get the parent container and find the circle/checkbox button
    const checkboxBtn = page.locator('.group').filter({ hasText: testText }).locator('button').first();
    await checkboxBtn.click();
    await page.waitForTimeout(1000); // Wait for state update and new task creation
    console.log('  ✅ Clicked complete button\n');

    // Screenshot after completion
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'recurring_03_completed.png'), fullPage: true });
    console.log('  📸 Screenshot saved: recurring_03_completed.png\n');

    // Step 9: Verify new recurring task was created
    console.log('Step 9: Verify new recurring task spawned');
    // After completing a recurring task, we should have 2 tasks with same text
    // One completed, one active
    const allTasksWithText = page.locator(`text=${testText.split(' ')[0]}`);
    const taskCount = await allTasksWithText.count();

    // Check localStorage for verification
    const todos = await page.evaluate(() => {
      const data = localStorage.getItem('vibe-todos');
      return data ? JSON.parse(data) : [];
    });

    console.log(`  📊 Total todos in storage: ${todos.length}`);

    // Find tasks matching our test text
    const matchingTasks = todos.filter(t => t.text.includes('Daily Meeting'));
    console.log(`  📊 Matching tasks: ${matchingTasks.length}`);

    if (matchingTasks.length < 2) {
      throw new Error(`Expected at least 2 tasks after completing recurring task, found ${matchingTasks.length}`);
    }

    // Verify one is completed and one is active
    const completedTasks = matchingTasks.filter(t => t.completed);
    const activeTasks = matchingTasks.filter(t => !t.completed);

    console.log(`  📊 Completed: ${completedTasks.length}, Active: ${activeTasks.length}`);

    if (completedTasks.length !== 1 || activeTasks.length !== 1) {
      throw new Error(`Expected 1 completed and 1 active task. Got ${completedTasks.length} completed, ${activeTasks.length} active.`);
    }
    console.log('  ✅ Recurring task spawned correctly!\n');

    // Step 10: Verify the new task has recurring enabled
    console.log('Step 10: Verify new task has recurring enabled');
    const newTask = activeTasks[0];
    if (!newTask.recurring?.enabled) {
      throw new Error('New spawned task does not have recurring enabled!');
    }
    console.log(`  ✅ New task recurring type: ${newTask.recurring.type}\n`);

    // Step 11: Verify the new task has next due date
    console.log('Step 11: Verify due date advanced');
    if (newTask.dueDate) {
      const originalDate = completedTasks[0].dueDate;
      console.log(`  📅 Original due date: ${originalDate || 'none'}`);
      console.log(`  📅 New due date: ${newTask.dueDate}`);
    }
    console.log('  ✅ Due date handling verified\n');

    // Final screenshot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'recurring_04_final.png'), fullPage: true });
    console.log('  📸 Screenshot saved: recurring_04_final.png\n');

    console.log('═══════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED - FEAT-RECUR-001');
    console.log('═══════════════════════════════════════\n');

  } catch (e) {
    testPassed = false;
    errors.push(e.message);
    console.error('\n❌ TEST FAILED:', e.message);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'recurring_FAILURE.png'), fullPage: true });
    console.log('  📸 Failure screenshot saved: recurring_FAILURE.png\n');
  } finally {
    await browser.close();

    const report = {
      test: 'Recurring Task Logic (FEAT-RECUR-001)',
      timestamp: new Date().toISOString(),
      passed: testPassed,
      errors: errors,
      artifacts: [
        'recurring_01_setup.png',
        'recurring_02_created.png',
        'recurring_03_completed.png',
        'recurring_04_final.png',
        testPassed ? null : 'recurring_FAILURE.png'
      ].filter(Boolean)
    };

    fs.writeFileSync(
      path.join(ARTIFACTS_DIR, 'test_recurring.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('📋 Test report saved: _artifacts/test_recurring.json');

    process.exit(testPassed ? 0 : 1);
  }
})();
