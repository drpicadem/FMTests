const { Builder, Browser } = require("selenium-webdriver");
require('chromedriver');
const fs = require('fs');
const path = require('path');

async function saveCookies() {
    console.log("=========================================");
    console.log("TRELLO COOKIE EXTRACTOR");
    console.log("=========================================");
    console.log("1. I will open a browser window going to Trello.");
    console.log("2. Please LOG IN MANUALLY (Google, 2FA, whatever needed).");
    console.log("3. Once you see your Boards, COME BACK HERE and press ENTER.");
    console.log("=========================================");

    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().window().maximize();

    await driver.get("https://trello.com/login");

    // Wait for user confirmation
    await new Promise(resolve => {
        process.stdin.once('data', () => {
            resolve();
        });
    });

    console.log("Extracting cookies...");
    const cookies = await driver.manage().getCookies();

    // Filter cookies if needed, but usually all are safer
    const cookiesPath = path.join(__dirname, 'cookies.json');
    fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));

    console.log(`Saved ${cookies.length} cookies to ${cookiesPath}`);
    console.log("=========================================");
    console.log("SUCCESS! You can now send 'cookies.json' to your professor.");
    console.log("The tests will use this file to login automatically.");
    console.log("=========================================");

    await driver.quit();
    process.exit(0);
}

saveCookies();
