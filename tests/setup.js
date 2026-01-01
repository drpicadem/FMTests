const { Builder, Browser } = require("selenium-webdriver");
const { By, until } = require("selenium-webdriver");
const config = require("../config");
const logger = require("../logger");
const { performLogin } = require("../helpers");

/**
 * Setup and teardown functions for tests
 */

let driver;
let isLoggedIn = false;
let isSingleTestMode = false;

// Provjeri da li se pokreće pojedinačni test
function checkIfSingleTest() {
  const args = process.argv;
  const hasGrep = args.some(arg => arg.includes('--grep'));
  const hasOnly = args.some(arg => arg.includes('--only'));
  return hasGrep || hasOnly;
}

async function setupDriver() {
  this.timeout(config.timeouts.testBeforeEach);
  
  // Provjeri da li je već logiran (za više testova)
  if (isLoggedIn && driver && !isSingleTestMode) {
    logger.info("Already logged in, reusing driver...");
    return driver;
  }

  logger.info("Opening Trello login page...");
  driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.manage().window().maximize();

  await driver.get("https://trello.com/login");
  await driver.sleep(config.delays.afterPageLoad);

  await performLogin(driver);
  isLoggedIn = true;
  return driver;
}

async function teardownDriver() {
  this.timeout(config.timeouts.testAfterEach);
  
  // Ako je single test mode, zatvori driver
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
      driver = null;
      isLoggedIn = false;
    }
  } else {
    // Za više testova, samo vrati na home (ne zatvaraj driver)
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
  }
}

// Funkcija za zatvaranje drivera na kraju svih testova
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

