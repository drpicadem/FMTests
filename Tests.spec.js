const config = require("./config");
const { setupDriver, teardownDriver, setDriver } = require("./tests/setup");
const test1 = require("./tests/test1");
const test2 = require("./tests/test2");
const test3 = require("./tests/test3");
const test4 = require("./tests/test4");
const test5 = require("./tests/test5");
const test6 = require("./tests/test6");
const test7 = require("./tests/test7");
const test8 = require("./tests/test8");
const test9 = require("./tests/test9");
const test10 = require("./tests/test10");

describe("Trello Board Creation Tests", function () {
  beforeEach(async function () {
    const driver = await setupDriver.call(this);
    setDriver(driver);
  });

  it("Test 1: Valid board creation with random name", test1);
  it("Test 2: Board creation with empty name", test2);
  it("Test 3: Board creation with name that is too long", test3);
  it("Test 4: Board creation with minimum length name (1 character)", test4);
  it("Test 5: Board creation with maximum length name (512 characters)", test5);
  it("Test 6: Board creation with special characters", test6);
  it("Test 7: Board creation with spaces in name", test7);
  it("Test 8: Board creation with only spaces", test8);
  it("Test 9: Board creation and verification on dashboard", test9);
  it("Test 10: Board creation with Unicode characters", test10);

  afterEach(async function () {
    await teardownDriver.call(this);
  });
});
