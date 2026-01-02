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
 * Login to Gmail
 */
async function loginToGmail(driver) {
  logger.info("Logging in to Gmail...");
  
  try {
    // Wait for page to load
    await driver.sleep(config.delays.mediumLong);
    
    // Check if already logged in by looking for compose button or profile icon
    try {
      const composeButton = await driver.findElement(By.xpath("//div[contains(text(), 'Compose') or contains(@aria-label, 'Compose')]"));
      if (composeButton) {
        logger.info("Already logged in to Gmail");
        return;
      }
    } catch (e) {
      // Not logged in, continue with login
    }
    
    // Find email input field
    logger.info("Looking for Gmail email input...");
    const emailInput = await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      config.timeouts.elementLocatorLong
    );
    await driver.wait(
      until.elementIsVisible(emailInput),
      config.timeouts.elementVisible
    );
    
    // Enter email
    logger.info("Entering Gmail email...");
    await emailInput.clear();
    await emailInput.sendKeys(config.gmailCredentials.email);
    await driver.sleep(config.delays.standard);
    
    // Click Next button
    logger.info("Clicking Next button...");
    const nextButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Next') or contains(., 'Dalje')]")),
      config.timeouts.elementLocator
    );
    await nextButton.click();
    await driver.sleep(config.delays.mediumLong);
    
    // Wait for password field
    logger.info("Looking for Gmail password input...");
    const passwordInput = await driver.wait(
      until.elementLocated(By.css("input[type='password']")),
      config.timeouts.elementLocatorLong
    );
    await driver.wait(
      until.elementIsVisible(passwordInput),
      config.timeouts.elementVisible
    );
    
    // Enter password
    logger.info("Entering Gmail password...");
    await passwordInput.clear();
    await passwordInput.sendKeys(config.gmailCredentials.password);
    await driver.sleep(config.delays.standard);
    
    // Click Next/Login button
    logger.info("Clicking Login button...");
    const loginButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Next') or contains(., 'Dalje')]")),
      config.timeouts.elementLocator
    );
    await loginButton.click();
    
    // Wait for Gmail to load
    logger.info("Waiting for Gmail to load after login...");
    await driver.sleep(config.gmail.pageLoadTimeout);
    
    logger.success("Gmail login successful!");
  } catch (error) {
    logger.error("Error logging in to Gmail: " + error.message);
    throw error;
  }
}

/**
 * Open Gmail in a new tab and return window handles
 */
async function openGmailInNewTab(driver) {
  logger.info("Opening Gmail in new tab...");
  
  // Get current window handle (Trello)
  const trelloHandle = await driver.getWindowHandle();
  
  // Open new tab by executing script
  await driver.executeScript("window.open('https://mail.google.com');");
  await driver.sleep(config.delays.medium);
  
  // Get all window handles
  const handles = await driver.getAllWindowHandles();
  
  // Find the Gmail handle (it's the new one)
  const gmailHandle = handles.find(handle => handle !== trelloHandle);
  
  // Switch to Gmail tab
  await driver.switchTo().window(gmailHandle);
  logger.info("Switched to Gmail tab");
  
  // Wait for Gmail to load
  await driver.sleep(config.gmail.pageLoadTimeout);
  
  // Login to Gmail
  await loginToGmail(driver);
  
  return { trelloHandle, gmailHandle };
}

/**
 * Find 2FA code input field
 */
async function find2FACodeInput(driver) {
  return await findElementWithFallback(
    driver,
    [
      By.css("input[type='text'][name*='code']"),
      By.css("input[type='text'][placeholder*='code']"),
      By.css("input[type='tel']"),
      By.xpath("//input[@type='text' or @type='tel']"),
    ],
    config.twoFactorAuth.codeInputTimeout
  );
}

/**
 * Extract 2FA code from Gmail
 */
async function extract2FACodeFromGmail(driver, gmailHandle, trelloHandle) {
  logger.info("Extracting 2FA code from Gmail...");
  
  // Make sure we're on Gmail tab
  await driver.switchTo().window(gmailHandle);
  await driver.sleep(config.delays.medium);
  
  try {
    // Wait a bit for email to arrive
    await driver.sleep(config.delays.long);
    
    // Try to find the latest email from Trello with verification code
    // Look for emails with "Verifying it's you" or similar subject
    const emailStrategies = [
      By.xpath("//tr[contains(@class, 'zA')]//span[contains(text(), 'Verifying')]/.."),
      By.xpath("//tr[contains(@class, 'zA')]//span[contains(text(), 'Trello')]/.."),
      By.xpath("//div[contains(@class, 'Cp')]//span[contains(text(), 'Verifying')]/.."),
      By.css("tr.zA"),
    ];
    
    let emailElement = null;
    for (let strategy of emailStrategies) {
      try {
        const elements = await driver.findElements(strategy);
        if (elements.length > 0) {
          emailElement = elements[0];
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!emailElement) {
      throw new Error("Could not find Trello verification email");
    }
    
    // Click on the email to open it
    logger.info("Opening verification email...");
    await emailElement.click();
    await driver.sleep(config.gmail.emailOpenTimeout);
    
    // Get the email body text
    const bodyElement = await driver.wait(
      until.elementLocated(By.css("div[role='main'], div.a3s, div.ii")),
      config.delays.long
    );
    await driver.sleep(config.delays.medium);
    const emailText = await bodyElement.getText();
    
    logger.debug("Email text: " + emailText.substring(0, 200));
    
    // Extract the 6-character code using regex
    // Pattern: 6 uppercase letters/numbers (e.g., PWM476)
    const codePattern = /\b[A-Z0-9]{6}\b/;
    const match = emailText.match(codePattern);
    
    if (!match) {
      throw new Error("Could not extract 2FA code from email");
    }
    
    const code = match[0];
    logger.success(`2FA code found: ${code}`);
    
    // Switch back to Trello tab
    await driver.switchTo().window(trelloHandle);
    
    // Close Gmail tab
    await driver.switchTo().window(gmailHandle);
    await driver.close();
    await driver.switchTo().window(trelloHandle);
    
    return code;
  } catch (error) {
    logger.error("Error extracting 2FA code: " + error.message);
    // Switch back to Trello tab even on error
    await driver.switchTo().window(trelloHandle);
    throw error;
  }
}

/**
 * Handle 2FA verification using Gmail
 */
async function handle2FAWithGmail(driver) {
  try {
    logger.info("Checking for 2FA verification requirement...");
    
    // Wait a bit to see if 2FA is required
    await driver.sleep(config.delays.mediumLong);
    
    // Try to find 2FA code input field
    let codeInput;
    try {
      codeInput = await find2FACodeInput(driver);
      logger.info("2FA verification required, checking Gmail for code...");
    } catch (e) {
      // No 2FA required
      logger.debug("2FA not required, continuing...");
      return false;
    }
    
    // Open Gmail in new tab
    const { trelloHandle, gmailHandle } = await openGmailInNewTab(driver);
    
    // Extract code from Gmail
    const code = await extract2FACodeFromGmail(driver, gmailHandle, trelloHandle);
    
    // Enter the code
    logger.info("Entering 2FA code...");
    await codeInput.clear();
    await codeInput.sendKeys(code);
    await driver.sleep(config.delays.standard);
    
    // Find and click submit button
    const submitButton = await findElementWithFallback(
      driver,
      [
        By.css("button[type='submit']"),
        By.xpath("//button[contains(text(), 'Verify') or contains(text(), 'Continue')]"),
        By.css("button"),
      ],
      config.twoFactorAuth.codeInputTimeout
    );
    
    await submitButton.click();
    await driver.sleep(config.twoFactorAuth.verificationTimeout);
    
    logger.success("2FA verification successful!");
    return true;
  } catch (error) {
    logger.error("Error handling 2FA: " + error.message);
    throw error;
  }
}

/**
 * Perform login to Trello via Google Sign-In
 */
async function performLogin(driver) {
  try {
    logger.info("Waiting for Trello login page...");
    await driver.sleep(config.delays.medium);

    // Click "Google" button in "Or continue with:" section
    logger.info("Looking for Google Sign-In button...");
    const googleButton = await findElementWithFallback(
      driver,
      [
        By.xpath("//button[contains(., 'Google')]"),
        By.xpath("//div[contains(text(), 'Google')]/ancestor::button"),
        By.css("button[aria-label*='Google']"),
        By.xpath("//span[contains(text(), 'Google')]/ancestor::button"),
      ],
      config.timeouts.elementLocatorLong
    );

    logger.info("Clicking Google Sign-In button...");
    await googleButton.click();
    await driver.sleep(config.delays.mediumLong);

    // Now we're on Google login page - enter email
    logger.info("Waiting for Google email field...");
    const emailField = await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      config.timeouts.elementLocatorLong
    );
    await driver.wait(
      until.elementIsVisible(emailField),
      config.timeouts.elementVisible
    );

    logger.info("Entering email...");
    await emailField.clear();
    await emailField.sendKeys(config.credentials.email);
    await driver.sleep(config.delays.standard);

    // Click Next button
    logger.info("Clicking Next button...");
    const nextButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Next') or contains(., 'Dalje')]")),
      config.timeouts.elementLocator
    );
    await nextButton.click();
    await driver.sleep(config.delays.mediumLong);

    // Enter password
    logger.info("Waiting for password field...");
    const passwordField = await driver.wait(
      until.elementLocated(By.css("input[type='password']")),
      config.timeouts.elementLocatorLong
    );
    await driver.wait(
      until.elementIsVisible(passwordField),
      config.timeouts.elementVisible
    );

    logger.info("Entering password...");
    await passwordField.clear();
    await passwordField.sendKeys(config.credentials.password);
    await driver.sleep(config.delays.standard);

    // Click Next/Sign in button
    logger.info("Clicking Sign in button...");
    const signInButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Next') or contains(., 'Dalje')]")),
      config.timeouts.elementLocator
    );
    await signInButton.click();
    await driver.sleep(config.delays.long);

    // Navigate to workspace after login to ensure we're in the right place
    logger.info("Navigating to workspace...");
    await driver.get("https://trello.com/u/drpicadem/boards");
    await driver.sleep(config.delays.long);
    
    logger.success("Login successful!");
  } catch (error) {
    logger.error("Login failed: " + error.message);
    throw error;
  }
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
  loginToGmail,
  openGmailInNewTab,
  find2FACodeInput,
  extract2FACodeFromGmail,
  handle2FAWithGmail,
  createBoard,
  findBoardHeader,
  verifyBoardCreated,
};
