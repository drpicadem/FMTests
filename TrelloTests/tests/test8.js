const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { openCreateBoardModal, findCreateBoardSubmitButton } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 8: Board creation with only spaces
 */
async function test8() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 8: Testing board creation with only spaces...");

  let boardTitleInput = await openCreateBoardModal(driver);
  await driver.wait(
    until.elementIsVisible(boardTitleInput),
    config.timeouts.elementVisible
  );
  await boardTitleInput.clear();
  await boardTitleInput.sendKeys("     ");
  await driver.sleep(config.delays.medium);

  let createBoardButton = await findCreateBoardSubmitButton(driver);
  let isEnabled = await createBoardButton.isEnabled();
  expect(isEnabled).to.be.false;

  logger.success("Test 8 passed: Only spaces validation works");
}

module.exports = test8;

