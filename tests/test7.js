const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { createBoard, verifyBoardCreated } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 7: Board creation with spaces in name
 */
async function test7() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 7: Testing board creation with spaces...");

  let nameWithSpaces = "My Test Board 2024";
  await createBoard(driver, nameWithSpaces);

  let boardHeader = await verifyBoardCreated(driver, "My Test Board");
  let headerText = await boardHeader.getText();
  expect(headerText).to.include("My Test Board");

  logger.success("Test 7 passed: Board with spaces created");
}

module.exports = test7;

