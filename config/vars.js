const dotenv = require('dotenv');
const defaults = require('./default');

// Load environment variables from .env file
dotenv.config();

// Destructure and export environment variables with fallback to defaults
module.exports = {
  nodeEnv: process.env.NODE_ENV || defaults.nodeEnv,
  port: process.env.PORT || defaults.port,
  databaseURL: process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || defaults.jwtExpiresIn,
  jwtCookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || defaults.jwtCookieExpiresIn,
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT || defaults.emailPort,
};
