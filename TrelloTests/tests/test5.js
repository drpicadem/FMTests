const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { generateRandomName, createBoard, verifyBoardCreated } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 5: Board creation with maximum length name (512 characters)
 */
async function test5() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 5: Testing board creation with 512 character name...");

  let maxLengthName = await generateRandomName(512);
  await createBoard(driver, maxLengthName);

  let boardHeader = await verifyBoardCreated(
    driver,
    maxLengthName.substring(0, 20)
  );
  let headerText = await boardHeader.getText();
  expect(headerText.length).to.be.at.least(1);

  logger.success("Test 5 passed: Board with maximum length name created");
}

module.exports = test5;

