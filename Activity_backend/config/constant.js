const dotenv = require("dotenv");
dotenv.config();

module.exports = Object.freeze({
  PORT: process.env.PORT,
  USER_DB: process.env.USER_DB,
  PASSWORD_DB: process.env.PASSWORD_DB,
  DB: process.env.DB,
  JWT_SECRET: process.env.JWT_SECRET, 

});
