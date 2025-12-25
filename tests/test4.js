const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { createBoard, verifyBoardCreated } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 4: Board creation with minimum length name (1 character)
 */
async function test4() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 4: Testing board creation with 1 character name...");

  await createBoard(driver, "A");

  let boardHeader = await verifyBoardCreated(driver);
  let headerText = await boardHeader.getText();
  expect(headerText).to.not.be.empty;
  expect(headerText.length).to.be.greaterThan(0);

  logger.success("Test 4 passed: Board with 1 character name created");
}

module.exports = test4;

