/**
 * Configuration for timeouts, delays, retry and credentials
 */

module.exports = {
  // Timeouts (milliseconds)
  timeouts: {
    elementLocator: 3000,
    elementLocatorExtended: 5000,
    elementLocatorLong: 10000,
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

  // Gmail-specific timeouts
  gmail: {
    pageLoadTimeout: 10000,
    emailSearchTimeout: 15000,
    emailOpenTimeout: 5000,
  },

  // Two-factor authentication timeouts
  twoFactorAuth: {
    codeInputTimeout: 5000,
    verificationTimeout: 10000,
  },

  // Retry configuration
  retry: {
    maxAttempts: 10,
    retryDelay: 1000,
  },

  // Login credentials
  credentials: {
    email: "fmtestovi@gmail.com",
    password: "fmtestovi",
  },

  // Gmail credentials
  gmailCredentials: {
    email: "fmtestovi@gmail.com",
    password: "FmTestovi123",
  },
};
