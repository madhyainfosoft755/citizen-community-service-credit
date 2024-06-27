// const { hash } = require("bcrypt");
// const db = require("../models");
// const { createToken, verifyPassword, createHash } = require("../utils/util");
// const { validationResult } = require("express-validator");

// const Users = db.users;
// const Players = db.players;

// const addUser = async (req, res) => {};

// const adminLogin = async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   console.log(email, password);
//   if (!email) {
//     res.send({ status: "error", message: "email missing" });
//     return;
//   }
//   console.log("password");

//   if (!password) {
//     res.json({ status: "error", message: "password missing" });
//     return;
//   }

//   let userCheck = await Players.findOne({
//     where: { email: email },
//   });

//   if (!userCheck) {
//     res.json({ status: "error", message: "invalid credentials" });
//     return;
//   }
//   //   const token = createToken(userCheck);
//   const token = "Fokatkatoken";

//   res.json({ status: "success", token: token, user: userCheck });
// };

// module.exports = {
//   addUser,
//   adminLogin,
// };
