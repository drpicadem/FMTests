const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { openCreateBoardModal, findCreateBoardSubmitButton } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 2: Board creation with empty name
 */
async function test2() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 2: Testing board creation with empty name...");

  let boardTitleInput = await openCreateBoardModal(driver);
  await driver.wait(
    until.elementIsVisible(boardTitleInput),
    config.timeouts.elementVisible
  );
  await boardTitleInput.clear();
  await boardTitleInput.sendKeys("");
  await driver.sleep(config.delays.standard);

  let createBoardButton = await findCreateBoardSubmitButton(driver);
  let isEnabled = await createBoardButton.isEnabled();
  expect(isEnabled).to.be.false;

  logger.success("Test 2 passed: Empty name validation works");
}

module.exports = test2;

