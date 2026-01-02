// playwright-browserbase.js
// Minimal Playwright script that uses a Browserbase Premium session
// ---------------------------------------------------------------
// 1. Verify API key and Project ID
// 2. Create a Browserbase session (Premium options like long TTL & residential proxy)
// 3. Connect Playwright via CDP to the session
// 4. Perform a simple registration flow (example: KiloCode signup)
// 5. Clean up the session afterwards
// ---------------------------------------------------------------

import { chromium } from 'playwright';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config(); // loads .env if present

// Configuration – replace with your own Browserbase API key
const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;
const BROWSERBASE_URL = 'https://api.browserbase.com/v1';

// We need both the Key and the Project ID for this auth method
if (!BROWSERBASE_API_KEY || !BROWSERBASE_PROJECT_ID) {
    console.error('❌ Missing BROWSERBASE_API_KEY or BROWSERBASE_PROJECT_ID environment variable.');
    process.exit(1);
}

// Helper: verify the API key by making a cheap request
async function verifyApiKey() {
    console.log('Validating credentials via session creation check...');
    const resp = await fetch(`${BROWSERBASE_URL}/sessions`, {
        method: 'POST',
        headers: {
            'x-bb-api-key': BROWSERBASE_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            projectId: BROWSERBASE_PROJECT_ID,
        }),
    });

    if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`🔐 Browserbase authentication/validation failed: ${resp.status} ${err}`);
    }

    const data = await resp.json();
    console.log("✅ Credentials valid.");

    // Cleanup the verification session
    const sessionId = data.id || data.sessionId;
    if (sessionId) {
        await fetch(`${BROWSERBASE_URL}/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: { 'x-bb-api-key': BROWSERBASE_API_KEY },
        });
    }
}

async function createSession() {
    const resp = await fetch(`${BROWSERBASE_URL}/sessions`, {
        method: 'POST',
        headers: {
            'x-bb-api-key': BROWSERBASE_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            projectId: BROWSERBASE_PROJECT_ID,
        }),
    });

    if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`Failed to create Browserbase session: ${resp.status} ${err}`);
    }
    const data = await resp.json();
    console.log('Session response:', data); // Log full response for debug

    const sessionId = data.id || data.sessionId;
    const connectUrl = data.connectUrl;

    if (!sessionId || !connectUrl) {
        throw new Error(`Session ID or connectUrl missing from response: ${JSON.stringify(data)}`);
    }

    console.log(`✅ Session created: ${sessionId}`);
    return { sessionId, connectUrl };
}

async function runPlaywright(sessionInfo) {
    const { sessionId, connectUrl } = sessionInfo;

    // Use the signed connectUrl provided by the API (includes signingKey)
    console.log(`🔌 Connecting to: ${connectUrl}...`);

    const browser = await chromium.connectOverCDP({
        wsEndpoint: connectUrl,
    });
    const page = await browser.newPage();

    try {
        const targetUrl = 'https://app.kilo.ai/users/sign_in';
        console.log(`Navigating to ${targetUrl} ...`);
        await page.goto(targetUrl);

        console.log(`Current URL: ${page.url()}`);
        console.log(`Page Title: ${await page.title()}`);

        // Wait for *something* recognizable
        console.log('Waiting for login form elements...');

        // Race condition: wait for either email input OR a "Connect with..." button
        try {
            await Promise.race([
                page.waitForSelector('input[type="email"]', { timeout: 10000 }),
                page.waitForSelector('button:has-text("Google")', { timeout: 10000 }),
                page.waitForSelector('a:has-text("Sign up")', { timeout: 10000 }),
                page.waitForSelector('button:has-text("Continue with Email")', { timeout: 10000 })
            ]);
            console.log('Found a login element!');
        } catch (waitErr) {
            console.log('⚠️ No obvious login elements found immediately.');
        }

        // Check specifically for email
        let emailInput = await page.$('input[type="email"]');

        if (!emailInput) {
            console.log('Email input not found initially. Checking for "Continue with Email" button...');
            const emailBtn = await page.$('button:has-text("Continue with Email")');
            if (emailBtn) {
                console.log('Found "Continue with Email" button. Clicking...');
                await emailBtn.click();

                console.log('Waiting for email input to appear...');
                await page.waitForSelector('input[type="email"]', { timeout: 10000 });
                emailInput = await page.$('input[type="email"]');
            }
        }

        if (emailInput) {
            console.log('Found email input. Filling...');
            await emailInput.fill('you@example.com');

            // Password might be on next screen or present
            // We'll fill password if present, or just submit email
            const passwordInput = await page.$('input[type="password"]');
            if (passwordInput) {
                await passwordInput.fill('SuperSecret123!');
            }

            // Attempt submission
            const submitBtn = await page.$('button[type="submit"]');
            if (submitBtn) {
                await submitBtn.click();
            } else {
                await emailInput.press('Enter');
            }

            await page.waitForTimeout(5000);
            console.log('✅ Registration/Login action submitted.');
        } else {
            console.log('ℹ️ No email input found even after attempts. Dumping text.');
            const text = await page.evaluate(() => document.body.innerText);
            console.log(text.substring(0, 500));
        }

    } catch (e) {
        console.error('❌ Interaction failed:', e.message);
        console.log('--- Page Visible Text (Start) ---');
        try {
            const text = await page.evaluate(() => document.body.innerText);
            console.log(text.substring(0, 2000));
            if (text.length > 2000) console.log('... [truncated]');
        } catch (err) {
            console.error('Failed to get page text:', err.message);
        }
        console.log('--- Page Visible Text (End) ---');
        throw e;
    } finally {
        await browser.close();
    }
}

(async () => {
    try {
        console.log('🔐 Verifying credentials...');
        await verifyApiKey();

        console.log('🌐 Creating real Browserbase session...');
        const sessionInfo = await createSession();

        try {
            console.log('🤖 Connecting Playwright...');
            await runPlaywright(sessionInfo);
        } finally {
            console.log('🧹 Cleaning up session...');
            await fetch(`${BROWSERBASE_URL}/sessions/${sessionInfo.sessionId}`, {
                method: 'DELETE',
                headers: { 'x-bb-api-key': BROWSERBASE_API_KEY },
            });
            console.log('✨ Done.');
        }
    } catch (e) {
        console.error('❌', e.message);
        process.exit(1);
    }
})();
