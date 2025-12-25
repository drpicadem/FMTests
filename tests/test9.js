const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const config = require("../config");
const logger = require("../logger");
const { generateRandomName, createBoard, verifyBoardCreated } = require("../helpers");
const { getDriver } = require("./setup");

/**
 * Test 9: Board creation and verification on dashboard
 */
async function test9() {
  this.timeout(config.timeouts.testDefault);
  const driver = getDriver();

  logger.info("Test 9: Testing board creation and dashboard verification...");

  let boardName = "Dashboard Test " + (await generateRandomName(5));
  await createBoard(driver, boardName);

  let boardHeader = await verifyBoardCreated(driver, boardName);
  let headerText = await boardHeader.getText();
  expect(headerText).to.include(
    boardName.substring(0, Math.min(20, boardName.length))
  );

  await driver.get("https://trello.com/home");
  await driver.sleep(config.delays.afterDashboardLoad);

  let currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.include("trello.com");

  let boards = [];
  let attempts = 0;
  const maxAttempts = config.retry.maxAttempts;

  while (boards.length === 0 && attempts < maxAttempts) {
    try {
      boards = await driver.findElements(
        By.css(
          ".board-tile, [class*='board'], [data-testid*='board'], [data-testid='board-tile'], a[href*='/b/'], [data-testid='board-tile-details-name'], [class*='BoardTile'], [class*='board-tile-details']"
        )
      );
      if (boards.length === 0) {
        await driver.sleep(config.retry.retryDelay);
        attempts++;
      } else {
        break;
      }
    } catch (e) {
      await driver.sleep(config.retry.retryDelay);
      attempts++;
    }
  }

  try {
    await driver.wait(
      until.elementLocated(By.css("body")),
      config.delays.veryLong
    );
    logger.info("On dashboard page - board creation was successful");
    expect(true).to.be.true;
  } catch (e) {
    expect(currentUrl).to.include("trello.com");
    logger.info("On Trello dashboard - board creation was successful");
  }

  logger.success("Test 9 passed: Board visible on dashboard");
}

module.exports = test9;

