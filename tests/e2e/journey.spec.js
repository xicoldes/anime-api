const { test, expect } = require('@playwright/test');

test('User can visit the Anime app and the UI loads', async ({ page }) => {
    // 1. Open the browser to your local frontend
    await page.goto('http://localhost:5173');

    // Add a quick 2-second pause so your screen recording catches it clearly!
    await page.waitForTimeout(10000);

    // 2. Perform the action (Wait for the body element to render on screen)
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // 3. Verify the result appears on screen (Check the URL)
    await expect(page).toHaveURL(/.*localhost.*/);
});