const { By, until } = require("selenium-webdriver");
const config = require("./config");
const logger = require("./logger");

/**
 * Helper functions for Selenium tests
 */

/**
 * Generate random name with specified length
 */
function generateRandomName(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomName = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomName += characters[randomIndex];
  }

  return randomName;
}

/**
 * Find Create button on page
 */
async function findCreateButton(driver) {
  try {
    return await driver.wait(
      until.elementLocated(By.css("[data-testid='header-create-menu-button']")),
      config.timeouts.elementLocator
    );
  } catch (e) {
    try {
      return await driver.wait(
        until.elementLocated(
          By.css("[aria-label*='Create'], [aria-label*='Kreiraj']")
        ),
        config.timeouts.elementLocator
      );
    } catch (e2) {
      try {
        return await driver.wait(
          until.elementLocated(
            By.xpath(
              "//button[contains(text(),'Create') or contains(text(),'Kreiraj')]"
            )
          ),
          config.timeouts.elementLocator
        );
      } catch (e3) {
        return await driver.wait(
          until.elementLocated(
            By.css("button[class*='create'], a[class*='create']")
          ),
          config.timeouts.elementLocator
        );
      }
    }
  }
}

/**
 * Find Create board option in menu
 */
async function findCreateBoardOption(driver) {
  try {
    return await driver.wait(
      until.elementLocated(
        By.xpath(
          "//span[contains(text(),'Create board') or contains(text(),'Kreiraj board')]/parent::* | //button[contains(text(),'Create board') or contains(text(),'Kreiraj board')]"
        )
      ),
      config.timeouts.elementLocator
    );
  } catch (e) {
    try {
      return await driver.wait(
        until.elementLocated(
          By.css("[data-testid='header-create-board-button']")
        ),
        config.timeouts.elementLocator
      );
    } catch (e2) {
      return await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[contains(@href,'board') and contains(text(),'Board')] | //div[contains(text(),'Board')]"
          )
        ),
        config.timeouts.elementLocator
      );
    }
  }
}

/**
 * Find board title input field
 */
async function findBoardTitleInput(driver) {
  try {
    return await driver.wait(
      until.elementLocated(
        By.css("input[data-testid='create-board-title-input']")
      ),
      config.timeouts.elementLocator
    );
  } catch (e) {
    try {
      return await driver.wait(
        until.elementLocated(
          By.xpath(
            "//input[@placeholder='Add board title' or @placeholder='Dodaj naslov boarda' or contains(@placeholder,'board title')]"
          )
        ),
        config.timeouts.elementLocator
      );
    } catch (e2) {
      return await driver.wait(
        until.elementLocated(
          By.css("input[type='text'], input[class*='title']")
        ),
        config.timeouts.elementLocator
      );
    }
  }
}

/**
 * Open Create board modal and return title input field
 */
async function openCreateBoardModal(driver) {
  let createButton = await findCreateButton(driver);
  await driver.wait(
    until.elementIsVisible(createButton),
    config.timeouts.elementVisible
  );
  await createButton.click();
  await driver.sleep(config.delays.afterClick);

  let createBoardOption = await findCreateBoardOption(driver);
  await driver.wait(
    until.elementIsVisible(createBoardOption),
    config.timeouts.elementVisible
  );
  await createBoardOption.click();
  await driver.sleep(config.delays.afterModalOpen);

  return await findBoardTitleInput(driver);
}

/**
 * Find submit button for creating board
 */
async function findCreateBoardSubmitButton(driver) {
  await driver.sleep(config.delays.medium);

  try {
    return await driver.wait(
      until.elementLocated(
        By.css("button[data-testid='create-board-submit-button']")
      ),
      config.timeouts.elementLocatorExtended
    );
  } catch (e) {
    try {
      return await driver.wait(
        until.elementLocated(
          By.xpath(
            "//button[contains(text(),'Create board') or contains(text(),'Kreiraj board') or contains(text(),'Create')]"
          )
        ),
        config.timeouts.elementLocatorExtended
      );
    } catch (e2) {
      try {
        return await driver.wait(
          until.elementLocated(
            By.css("form button[type='submit'], button[type='submit']")
          ),
          config.timeouts.elementLocatorExtended
        );
      } catch (e3) {
        let buttons = await driver.findElements(
          By.css("button:not([disabled])")
        );
        if (buttons.length > 0) {
          return buttons[buttons.length - 1];
        }
        throw new Error("Could not find create board submit button");
      }
    }
  }
}

/**
 * Find element with multiple fallback strategies
 */
async function findElementWithFallback(driver, strategies, timeout) {
  for (let strategy of strategies) {
    try {
      return await driver.wait(until.elementLocated(strategy), timeout);
    } catch (e) {
      continue;
    }
  }
  throw new Error("Could not find element with any strategy");
}

/**
 * Find email field for login
 */
async function findEmailField(driver) {
  return await findElementWithFallback(
    driver,
    [
      By.id("user"),
      By.name("user"),
      By.css("input[type='text'], input[type='email']"),
      By.xpath("//input[@type='text' or @type='email']"),
    ],
    config.timeouts.elementLocator
  );
}

/**
 * Find password field for login
 */
async function findPasswordField(driver) {
  try {
    return await findElementWithFallback(
      driver,
      [
        By.id("password"),
        By.name("password"),
        By.css("input[type='password']"),
      ],
      config.timeouts.elementLocatorLong
    );
  } catch (e) {
    await driver.sleep(config.delays.mediumLong);
    return await driver.wait(
      until.elementLocated(By.css("input[type='password']")),
      config.timeouts.elementLocatorLong
    );
  }
}

/**
 * Find continue button
 */
async function findContinueButton(driver) {
  return await findElementWithFallback(
    driver,
    [
      By.id("login"),
      By.css("input[type='submit'], button[type='submit']"),
      By.xpath(
        "//button[contains(text(),'Continue') or contains(text(),'Nastavi')] | //input[@value='Continue' or @value='Nastavi']"
      ),
    ],
    config.timeouts.elementLocatorExtended
  );
}

/**
 * Find login button
 */
async function findLoginButton(driver) {
  return await findElementWithFallback(
    driver,
    [
      By.id("login-submit"),
      By.css("button[type='submit'], input[type='submit']"),
      By.xpath(
        "//button[contains(text(),'Log in') or contains(text(),'Prijavi se')] | //input[@value='Log in' or @value='Prijavi se']"
      ),
    ],
    config.timeouts.elementLocatorExtended
  );
}

/**
 * Handle two-step verification modal if it appears
 */
async function handleTwoStepVerificationModal(driver) {
  try {
    logger.info("Checking for two-step verification modal...");
    // Wait a bit for modal to appear
    await driver.sleep(config.delays.medium);
    
    // Try to find the "Continue without two-step verification" button
    const continueWithoutButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(text(),'Continue without two-step verification') or contains(text(),'Nastavi bez dvofaktorske verifikacije')]"
        )
      ),
      config.timeouts.elementLocator
    );
    
    if (continueWithoutButton) {
      await driver.wait(
        until.elementIsVisible(continueWithoutButton),
        config.timeouts.elementVisible
      );
      logger.info("Clicking 'Continue without two-step verification' button...");
      await continueWithoutButton.click();
      await driver.sleep(config.delays.afterClick);
      logger.success("Two-step verification modal handled");
    }
  } catch (e) {
    // Modal didn't appear, which is fine
    logger.debug("Two-step verification modal not found, continuing...");
  }
}

/**
 * Perform login to Trello
 */
async function performLogin(driver) {
  logger.info("Waiting for email field...");
  let emailField = await findEmailField(driver);
  await driver.wait(
    until.elementIsVisible(emailField),
    config.timeouts.elementVisible
  );
  logger.info("Entering email...");
  await emailField.clear();
  await emailField.sendKeys(config.credentials.email);
  await driver.sleep(config.delays.standard);

  logger.info("Clicking continue button...");
  let continueButton = await findContinueButton(driver);
  await driver.wait(
    until.elementIsVisible(continueButton),
    config.timeouts.elementVisibleExtended
  );
  await continueButton.click();
  await driver.sleep(config.delays.afterLogin);

  logger.info("Waiting for password field...");
  let passwordField = await findPasswordField(driver);
  await driver.wait(
    until.elementIsVisible(passwordField),
    config.timeouts.elementVisibleExtended
  );
  logger.info("Entering password...");
  await passwordField.clear();
  await passwordField.sendKeys(config.credentials.password);
  await driver.sleep(config.delays.standard);

  logger.info("Clicking login button...");
  let loginButton = await findLoginButton(driver);
  await driver.wait(
    until.elementIsVisible(loginButton),
    config.timeouts.elementVisibleExtended
  );
  await loginButton.click();
  await driver.sleep(config.delays.afterLogin);

  // Handle two-step verification modal if it appears
  await handleTwoStepVerificationModal(driver);

  logger.info("Waiting for dashboard to load...");
  try {
    await findCreateButton(driver);
  } catch (e) {
    await driver.sleep(config.delays.veryLong);
    let currentUrl = await driver.getCurrentUrl();
    logger.debug("Current URL: " + currentUrl);
    await findCreateButton(driver);
  }
  await driver.sleep(config.delays.standard);
  logger.success("Login successful!");
}

/**
 * Create board with given name
 */
async function createBoard(driver, boardName) {
  let boardTitleInput = await openCreateBoardModal(driver);
  await driver.wait(
    until.elementIsVisible(boardTitleInput),
    config.timeouts.elementVisible
  );
  await boardTitleInput.clear();
  await boardTitleInput.sendKeys(boardName);
  await driver.sleep(config.delays.short);

  let createBoardButton = await findCreateBoardSubmitButton(driver);
  await driver.wait(
    until.elementIsVisible(createBoardButton),
    config.timeouts.elementVisible
  );
  await createBoardButton.click();
  await driver.sleep(config.delays.afterBoardCreate);
}

/**
 * Find board header with fallback strategies
 */
async function findBoardHeader(driver, boardName = null) {
  const strategies = boardName
    ? [
        By.xpath(`//h1[contains(text(),'${boardName}')]`),
        By.xpath("//h1"),
        By.css("[data-testid='board-name'], [class*='board-name'], h1"),
      ]
    : [
        By.xpath("//h1"),
        By.css("[data-testid='board-name'], [class*='board-name'], h1"),
      ];

  for (let strategy of strategies) {
    try {
      return await driver.wait(
        until.elementLocated(strategy),
        config.timeouts.elementLocator
      );
    } catch (e) {
      continue;
    }
  }
  throw new Error("Could not find board header");
}

/**
 * Verify board was created
 */
async function verifyBoardCreated(driver, boardName = null) {
  let boardHeader = await findBoardHeader(driver, boardName);
  await driver.wait(
    until.elementIsVisible(boardHeader),
    config.timeouts.elementVisible
  );
  return boardHeader;
}

module.exports = {
  generateRandomName,
  findCreateButton,
  findCreateBoardOption,
  findBoardTitleInput,
  openCreateBoardModal,
  findCreateBoardSubmitButton,
  findEmailField,
  findPasswordField,
  findContinueButton,
  findLoginButton,
  performLogin,
  handleTwoStepVerificationModal,
  createBoard,
  findBoardHeader,
  verifyBoardCreated,
};
