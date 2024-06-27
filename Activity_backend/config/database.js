//get client
const mysql = require("mysql2/promise");

// import constant values like pass and username
const constant = require("./constant");

// create the connection to database

const pool = mysql.createPool({
  host: "localhost",
  database: constant.DB,
  user: constant.USER_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


module.exports = Object.freeze({
  pool,
});
