const { Builder, Browser } = require("selenium-webdriver");
const { By, until } = require("selenium-webdriver");
const config = require("../config");
const logger = require("../logger");
const { performLogin } = require("../helpers");

/**
 * Setup and teardown functions for tests
 */

let driver;

async function setupDriver() {
  this.timeout(config.timeouts.testBeforeEach);

  logger.info("Opening Trello login page...");
  driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.manage().window().maximize();

  await driver.get("https://trello.com/login");
  await driver.sleep(config.delays.afterPageLoad);

  await performLogin(driver);
  return driver;
}

async function teardownDriver() {
  this.timeout(config.timeouts.testAfterEach);
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
      let homeLink = await driver.findElement(
        By.xpath(
          "//a[contains(@href,'home') or contains(@aria-label,'Home')]"
        )
      );
      await homeLink.click();
      await driver.sleep(config.delays.standard);
    } catch (e) {
      // Ignore if not possible
    }
  } catch (e) {
    logger.error("Error in cleanup: " + e.message);
  }

  if (driver) {
    await driver.quit();
  }
}

function getDriver() {
  return driver;
}

function setDriver(newDriver) {
  driver = newDriver;
}

module.exports = {
  setupDriver,
  teardownDriver,
  getDriver,
  setDriver,
};

