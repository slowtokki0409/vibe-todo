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
    console.log('🧪 Global Gradient Polish E2E Test Starting...\n');

    // Step 1: Navigate to app
    console.log('Step 1: Navigate to app');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('  ✅ App loaded\n');

    // Step 2: Take initial screenshot
    console.log('Step 2: Capture initial state');
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'gradient_01_initial.png'), fullPage: true });
    console.log('  📸 Screenshot saved: gradient_01_initial.png\n');

    // Step 3: Verify breathing animation classes exist
    console.log('Step 3: Verify animation classes');

    const breatheElements = await page.locator('.animate-breathe').count();
    const breatheReverseElements = await page.locator('.animate-breathe-reverse').count();
    const breatheSlowElements = await page.locator('.animate-breathe-slow').count();

    console.log(`  📊 animate-breathe elements: ${breatheElements}`);
    console.log(`  📊 animate-breathe-reverse elements: ${breatheReverseElements}`);
    console.log(`  📊 animate-breathe-slow elements: ${breatheSlowElements}`);

    if (breatheElements === 0 && breatheReverseElements === 0 && breatheSlowElements === 0) {
      throw new Error('No breathing animation classes found! Implementation missing.');
    }
    console.log('  ✅ Breathing animation classes are present\n');

    // Step 4: Verify CSS animation is applied
    console.log('Step 4: Verify CSS animation styles');

    const animationStyle = await page.evaluate(() => {
      const element = document.querySelector('.animate-breathe');
      if (!element) return null;
      const computed = window.getComputedStyle(element);
      return {
        animationName: computed.animationName,
        animationDuration: computed.animationDuration,
        animationTimingFunction: computed.animationTimingFunction,
        animationIterationCount: computed.animationIterationCount
      };
    });

    if (!animationStyle) {
      throw new Error('Could not find .animate-breathe element!');
    }

    console.log(`  📊 Animation name: ${animationStyle.animationName}`);
    console.log(`  📊 Animation duration: ${animationStyle.animationDuration}`);
    console.log(`  📊 Animation timing: ${animationStyle.animationTimingFunction}`);
    console.log(`  📊 Animation iteration: ${animationStyle.animationIterationCount}`);

    if (animationStyle.animationName === 'none' || animationStyle.animationName === '') {
      throw new Error('Animation is not being applied! CSS keyframes may be missing.');
    }

    if (animationStyle.animationIterationCount !== 'infinite') {
      throw new Error('Animation should loop infinitely for breathing effect!');
    }
    console.log('  ✅ CSS animation is properly configured\n');

    // Step 5: Verify gradient orbs exist
    console.log('Step 5: Verify gradient orb elements');

    const blueOrb = await page.locator('.bg-blue-500\\/30').count();
    const purpleOrb = await page.locator('.bg-purple-500\\/30').count();
    const pinkOrb = await page.locator('.bg-pink-500\\/20').count();

    console.log(`  📊 Blue orbs: ${blueOrb}`);
    console.log(`  📊 Purple orbs: ${purpleOrb}`);
    console.log(`  📊 Pink orbs: ${pinkOrb}`);

    if (blueOrb === 0 || purpleOrb === 0 || pinkOrb === 0) {
      throw new Error('Missing gradient orb elements!');
    }
    console.log('  ✅ All gradient orbs present\n');

    // Step 6: Wait and capture animation in progress
    console.log('Step 6: Wait for animation (3 seconds)');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'gradient_02_animating.png'), fullPage: true });
    console.log('  📸 Screenshot saved: gradient_02_animating.png\n');

    // Step 7: Wait more and capture another frame
    console.log('Step 7: Capture another frame (5 seconds later)');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'gradient_03_breathing.png'), fullPage: true });
    console.log('  📸 Screenshot saved: gradient_03_breathing.png\n');

    // Step 8: Verify blur filter is applied
    console.log('Step 8: Verify blur filter');
    const blurredElements = await page.locator('.blur-3xl').count();
    console.log(`  📊 Blurred elements: ${blurredElements}`);

    if (blurredElements === 0) {
      throw new Error('No blur-3xl elements found!');
    }
    console.log('  ✅ Blur filter is applied\n');

    // Step 9: Verify mix-blend-mode
    console.log('Step 9: Verify mix-blend-mode');
    const mixBlendStyle = await page.evaluate(() => {
      const element = document.querySelector('.mix-blend-screen');
      if (!element) return null;
      return window.getComputedStyle(element).mixBlendMode;
    });

    console.log(`  📊 Mix blend mode: ${mixBlendStyle}`);
    if (mixBlendStyle !== 'screen') {
      throw new Error('Mix blend mode should be "screen" for proper gradient effect!');
    }
    console.log('  ✅ Mix blend mode correctly set to screen\n');

    console.log('═══════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED - VISUAL-POLISH-001');
    console.log('═══════════════════════════════════════\n');

  } catch (e) {
    testPassed = false;
    errors.push(e.message);
    console.error('\n❌ TEST FAILED:', e.message);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'gradient_FAILURE.png'), fullPage: true });
    console.log('  📸 Failure screenshot saved: gradient_FAILURE.png\n');
  } finally {
    await browser.close();

    const report = {
      test: 'Global Gradient Polish (VISUAL-POLISH-001)',
      timestamp: new Date().toISOString(),
      passed: testPassed,
      errors: errors,
      artifacts: [
        'gradient_01_initial.png',
        'gradient_02_animating.png',
        'gradient_03_breathing.png',
        testPassed ? null : 'gradient_FAILURE.png'
      ].filter(Boolean)
    };

    fs.writeFileSync(
      path.join(ARTIFACTS_DIR, 'test_gradient.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('📋 Test report saved: _artifacts/test_gradient.json');

    process.exit(testPassed ? 0 : 1);
  }
})();
