const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { generateRandomName, createBoard, verifyBoardCreated } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 1: Valid board creation with random name
 */
async function test1() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 1: Creating valid board...");

  let boardName = await generateRandomName(10);
  await createBoard(driver, boardName);

  let boardHeader = await verifyBoardCreated(driver, boardName);
  let headerText = await boardHeader.getText();
  expect(headerText).to.include(boardName);

  logger.success("Test 1 passed: Board created successfully");
}

module.exports = test1;

