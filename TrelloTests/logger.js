/**
 * Logger module with timestamp and log levels
 */

// Color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
};

/**
 * Date format [YYYY-MM-DD HH:MM:SS]
 */
function getFormattedTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
}

/**
 * Log INFO message (white)
 */
function info(message) {
  const time = getFormattedTime();
  console.log(`${time} ${colors.brightWhite}[INFO]${colors.reset} ${message}`);
}

/**
 * Log WARN message (yellow)
 */
function warn(message) {
  const time = getFormattedTime();
  console.warn(
    `${time} ${colors.brightYellow}[WARN]${colors.reset} ${message}`
  );
}

/**
 * Log ERROR message (red)
 */
function error(message) {
  const time = getFormattedTime();
  console.error(`${time} ${colors.brightRed}[ERROR]${colors.reset} ${message}`);
}

/**
 * Log SUCCESS message (green)
 */
function success(message) {
  const time = getFormattedTime();
  console.log(
    `${time} ${colors.brightGreen}[SUCCESS]${colors.reset} ${message}`
  );
}

/**
 * Log DEBUG message (cyan)
 */
function debug(message) {
  const time = getFormattedTime();
  console.log(`${time} ${colors.brightCyan}[DEBUG]${colors.reset} ${message}`);
}

module.exports = {
  info,
  warn,
  error,
  success,
  debug,
};
