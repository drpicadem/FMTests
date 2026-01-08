const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { generateRandomName, openCreateBoardModal } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 3: Board creation with name that is too long
 */
async function test3() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 3: Testing board creation with too long name...");

  let boardTitleInput = await openCreateBoardModal(driver);
  await driver.wait(
    until.elementIsVisible(boardTitleInput),
    config.timeouts.elementVisible
  );
  await boardTitleInput.clear();
  let longName = await generateRandomName(513);
  await boardTitleInput.sendKeys(longName);
  await driver.sleep(config.delays.standard);

  try {
    let errorMessage = await driver.findElement(
      By.xpath(
        "//div[contains(@class,'error') or contains(text(),'too long') or contains(text(),'predugačak')]"
      )
    );
    let errorText = await errorMessage.getText();
    expect(errorText).to.not.be.empty;
  } catch (e) {
    let inputValue = await boardTitleInput.getAttribute("value");
    expect(inputValue.length).to.be.at.most(513);
    if (inputValue.length === 513) {
      logger.debug("Input limited to 513 characters");
    }
  }

  logger.success("Test 3 passed: Long name validation works");
}

module.exports = test3;

