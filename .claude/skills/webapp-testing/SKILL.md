---
name: webapp-testing
description: Expert capability to write and execute robust E2E tests using Puppeteer/Playwright.
version: 1.0.0
---

# WebApp Testing Skill

This skill empowers the agent to autonomously generate, execute, and debug End-to-End (E2E) tests for web applications. It focuses on user-centric scenarios rather than implementation details.

## When to use this skill
- When verifying a new feature works as intended from a user's perspective.
- When reproducing a reported bug ("reproduction script").
- When performing regression testing before sensitive changes.
- When the `QA Agent` needs to validate "Vibe" and Functionality objectively.

## Core Capabilities
1.  **Scenario Generation**: Translating `feature_list.json` user stories into executable scripts.
2.  **Visual Verification**: Taking screenshots at key steps to verify UI state.
3.  **Resilient Selectors**: Using `data-testid`, text content, or ARIA roles instead of brittle CSS classes.

## How to use

### 1. Identify the Test Scope
Read the `user_story` from the task definition.
*Example*: "User logs in, sees dashboard, clicks 'New Item'."

### 2. Generate the Test Script
Create a standalone Node.js script (e.g., `tests/repro_login.mjs`) using Puppeteer.

**Template:**
```javascript
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // headless: false for debugging
  const page = await browser.newPage();
  
  try {
    console.log('Step 1: Navigate to app');
    await page.goto('http://localhost:5173');
    
    console.log('Step 2: Perform Action');
    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]', 'Test Item');
    await page.keyboard.press('Enter');
    
    console.log('Step 3: Verify Result');
    await page.waitForSelector('.todo-item');
    const text = await page.$eval('.todo-item', el => el.textContent);
    
    if (!text.includes('Test Item')) throw new Error('Item not added');
    
    console.log('✅ Test Passed');
  } catch (e) {
    console.error('❌ Test Failed:', e);
    await page.screenshot({ path: 'test-failure.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
```

### 3. Execute
```bash
node tests/repro_login.mjs
```

### 4. Self-Correction
If the test fails:
1.  Check `test-failure.png`.
2.  Read the error log.
3.  Adjust the selector or wait time (`waitForSelector`).
4.  Retry.
