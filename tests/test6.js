const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { createBoard, verifyBoardCreated } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 6: Board creation with special characters
 */
async function test6() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 6: Testing board creation with special characters...");

  let specialName = "Test!@#$%^&*()_+-=[]{}|;:,.<>?";
  await createBoard(driver, specialName);

  let boardHeader = await verifyBoardCreated(driver);
  let headerText = await boardHeader.getText();
  expect(headerText).to.not.be.empty;

  logger.success("Test 6 passed: Board with special characters created");
}

module.exports = test6;

