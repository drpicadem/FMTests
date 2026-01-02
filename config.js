/**
 * Configuration for timeouts, delays, retry and credentials
 */

module.exports = {
  // Timeouts (milliseconds)
  timeouts: {
    elementLocator: 10000, 
    elementLocatorExtended: 15000,
    elementLocatorLong: 20000,
    testDefault: 120000,
    testBeforeEach: 60000,
    testAfterEach: 10000,
    elementVisible: 5000,
    elementVisibleExtended: 7000,
  },

  // Delays (milliseconds)
  delays: {
    short: 300,
    medium: 500,
    standard: 1000,
    mediumLong: 2000,
    long: 3000,
    veryLong: 5000,
    afterClick: 500,
    afterModalOpen: 1000,
    afterLogin: 2000,
    afterPageLoad: 2000,
    afterBoardCreate: 2000,
    afterDashboardLoad: 5000,
  },

  // Retry configuration
  retry: {
    maxAttempts: 10,
    retryDelay: 1000,
  },

  // Login credentials
  credentials: {
    email: "fmtestovi@gmail.com",
    password: "FmTestovi123",
  },
};
