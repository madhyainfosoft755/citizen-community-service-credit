const dotenv = require("dotenv");
dotenv.config();

module.exports = Object.freeze({
  PORT: process.env.PORT,
  USER_DB: process.env.USER_DB,
  PASSWORD_DB: process.env.PASSWORD_DB,
  DB: process.env.DB,
  JWT_SECRET: process.env.JWT_SECRET, 
  SESSION_SECRET:process.env.SESSION_SECRET,
  CLIENT_ID:process.env.CLIENT_ID,
  CLIENT_SECRET:process.env.CLIENT_SECRET,
  CALLBACK_URL:process.env.CALLBACK_URL,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
  // URL:process.env.URL
});
