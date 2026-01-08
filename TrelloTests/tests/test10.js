const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { createBoard, verifyBoardCreated } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 10: Board creation with Unicode characters
 */
async function test10() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 10: Testing board creation with Unicode characters...");

  let unicodeName = "Test 测试 テスト тест";
  await createBoard(driver, unicodeName);

  let boardHeader = await verifyBoardCreated(driver);
  let headerText = await boardHeader.getText();
  expect(headerText).to.not.be.empty;
  expect(headerText.length).to.be.greaterThan(0);

  logger.success("Test 10 passed: Board with Unicode characters created");
}

module.exports = test10;

