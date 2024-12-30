// Format date to a readable string with timezone
const formatDate = () => {
  return new Date().toISOString();
};

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

export const logger = {
  info: (message, data = null) => {
    const logMessage = `${colors.blue}[INFO]${
      colors.reset
    } [${formatDate()}] ${message}`;
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  },

  error: (message, error = null) => {
    const logMessage = `${colors.red}[ERROR]${
      colors.reset
    } [${formatDate()}] ${message}`;
    if (error) {
      console.error(logMessage, "\nError Details:", error);
      if (error.stack) {
        console.error("Stack Trace:", error.stack);
      }
    } else {
      console.error(logMessage);
    }
  },

  success: (message, data = null) => {
    const logMessage = `${colors.green}[SUCCESS]${
      colors.reset
    } [${formatDate()}] ${message}`;
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  },

  warn: (message, data = null) => {
    const logMessage = `${colors.yellow}[WARN]${
      colors.reset
    } [${formatDate()}] ${message}`;
    if (data) {
      console.warn(logMessage, data);
    } else {
      console.warn(logMessage);
    }
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      const logMessage = `${colors.magenta}[DEBUG]${
        colors.reset
      } [${formatDate()}] ${message}`;
      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  },

  request: (req) => {
    logger.info(`${req.method} ${req.url}`, {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
    });
  },
};
