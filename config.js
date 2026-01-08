/**
 * Configuration for timeouts, delays, retry and credentials
 */

// Load environment variables from .env file
require('dotenv').config();

module.exports = {
  // Timeouts (milliseconds)
  timeouts: {
    elementLocator: 30000,
    elementLocatorExtended: 25000,
    elementLocatorLong: 40000,
    testDefault: 120000,
    testBeforeEach: 120000,
    testAfterEach: 10000,
    elementVisible: 10000,
    elementVisibleExtended: 15000,
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
    email: process.env.TRELLO_EMAIL || "fmtestovi@gmail.com",
    password: process.env.TRELLO_PASSWORD || "FmTestovi123",
  },

  // Login method: 'google' or 'trello'
  loginMethod: process.env.LOGIN_METHOD || "google",
};
