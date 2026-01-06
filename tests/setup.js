const { Builder, Browser } = require("selenium-webdriver");
const { By } = require("selenium-webdriver");
require('chromedriver');
const config = require("../config");
const logger = require("../logger");
const { performLogin } = require("../helpers");

/**
 * Setup and teardown functions for tests
 */

let driver;
let isLoggedIn = false;
let isSingleTestMode = false;

// Check if running a single test
function checkIfSingleTest() {
  const args = process.argv;
  const hasGrep = args.some(arg => arg.includes('--grep'));
  const hasOnly = args.some(arg => arg.includes('--only'));
  return hasGrep || hasOnly;
}

async function setupDriver() {
  this.timeout(config.timeouts.testBeforeEach);

  // If already logged in and not single test mode, reuse driver
  if (isLoggedIn && driver && !isSingleTestMode) {
    logger.info("Already logged in, reusing driver...");
    return driver;
  }

  logger.info("Opening Trello login page...");
  driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.manage().window().maximize();

  await driver.get("https://trello.com/login");
  await driver.sleep(config.delays.afterPageLoad);

  // Try to load cookies if they exist
  const fs = require('fs');
  const path = require('path');
  const cookiesPath = path.join(__dirname, '..', 'cookies.json');

  if (fs.existsSync(cookiesPath)) {
    logger.info("Found cookies.json, attempting to inject session...");
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));

    // We need to be on the trello domain
    await driver.get("https://trello.com/");

    // Clear all existing cookies first to prevent duplicates (especially DSC cookie)
    await driver.manage().deleteAllCookies();
    await driver.sleep(500);

    for (const cookie of cookies) {
      try {
        // Remove sameSite field as Selenium doesn't support it
        const { sameSite, ...cookieWithoutSameSite } = cookie;
        await driver.manage().addCookie(cookieWithoutSameSite);
      } catch (e) {
        // Ignore cookies that can't be added
      }
    }

    logger.info("Cookies injected, navigating to boards...");
    await driver.get("https://trello.com/u/drpicadem/boards");
    await driver.sleep(config.delays.afterPageLoad);

    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes("login")) {
      logger.success("Session restored via cookies!");
      isLoggedIn = true;
      return driver;
    }
  }

  // Fallback to manual login execution
  await performLogin(driver);
  isLoggedIn = true;
  return driver;
}

async function teardownDriver() {
  this.timeout(config.timeouts.testAfterEach);

  // If single test mode, close driver
  if (isSingleTestMode) {
    try {
      try {
        let closeButton = await driver.findElement(
          By.xpath(
            "//button[contains(@aria-label,'Close') or contains(@class,'close')]"
          )
        );
        await closeButton.click();
        await driver.sleep(config.delays.medium);
      } catch (e) {
        // Ignore if no close button
      }

      try {
        await driver.get("https://trello.com/u/drpicadem/boards");
        await driver.sleep(config.delays.standard);
      } catch (e) {
        // Ignore if not possible
      }
    } catch (e) {
      logger.error("Error in cleanup: " + e.message);
    }

    if (driver) {
      await driver.quit();
      driver = null;
      isLoggedIn = false;
    }
  } else {
    // For multiple tests, navigate back to workspace (don't close driver)
    try {
      try {
        let closeButton = await driver.findElement(
          By.xpath(
            "//button[contains(@aria-label,'Close') or contains(@class,'close')]"
          )
        );
        await closeButton.click();
        await driver.sleep(config.delays.medium);
      } catch (e) {
        // Ignore if no close button
      }

      // Navigate back to workspace for next test
      try {
        await driver.get("https://trello.com/u/drpicadem/boards");
        await driver.sleep(config.delays.standard);
      } catch (e) {
        logger.error("Error navigating to workspace: " + e.message);
      }
    } catch (e) {
      logger.error("Error in cleanup: " + e.message);
    }
  }
}

// Final teardown at end of all tests
async function teardownDriverFinal() {
  this.timeout(config.timeouts.testAfterEach);
  try {
    if (driver) {
      await driver.quit();
      driver = null;
      isLoggedIn = false;
    }
  } catch (e) {
    logger.error("Error in final teardown: " + e.message);
  }
}

function getDriver() {
  return driver;
}

function setDriver(newDriver) {
  driver = newDriver;
}

function setSingleTestMode(value) {
  isSingleTestMode = value;
}

module.exports = {
  setupDriver,
  teardownDriver,
  teardownDriverFinal,
  getDriver,
  setDriver,
  setSingleTestMode,
  checkIfSingleTest,
};
