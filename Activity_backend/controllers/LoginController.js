const db = require("../models");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const config = require("../config/constant");
const mysql = require("mysql2/promise");
const jwt_decode = require("jwt-decode");
const jwtKey = "g.comm";
const multer = require("multer");
const GoogleData = db.users;
const Users = db.users;
const axios = require("axios");
const Posts = db.Posts;
const Endorsement = db.Endorsement;
const Categories = db.Categories;
const Organizations = db.Organisations;
const Approver = db.Approvers;
const LoginLog = db.loginlog;
const VisitorLogs = db.visitorlogs;
const AttachOrg = db.AttachOrg;

const Jwt = require("jsonwebtoken");
const { logger } = require("../utils/util");
const {
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL,
} = require("../config/constant");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const crypto = require("crypto"); // For generating a random token
const dotenv = require("dotenv");
dotenv.config();
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const {
  format,
  differenceInMinutes,
  isAfter,
  isSameDay,
  parse,
} = require("date-fns");
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_Secret;
const qs = require("qs");
const { count } = require("console");
const organization = require("../models/organization");
const CreatePost = require("../models/CreatePost");

// Function to decode the post ID
function decodePostID(encodedID) {
  return Buffer.from(encodedID, "base64").toString("ascii");
}

const LinkedInLogin = async (req, res) => {
  const { code } = req.body;
  const linkedin_params = new URLSearchParams();
  linkedin_params.append("grant_type", "authorization_code");
  linkedin_params.append("redirect_uri", `${LINKEDIN_REDIRECT_URI}`);
  linkedin_params.append("client_id", `${LINKEDIN_CLIENT_ID}`);
  linkedin_params.append("client_secret", `${LINKEDIN_CLIENT_SECRET}`);
  linkedin_params.append("code", `${code}`);

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      linkedin_params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // console.log("********************** mila kya access token *******************", tokenResponse)

    // Fetch user profile information from LinkedIn
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // console.log("********** kya mila profile ke response mai *************", profileResponse)

    const email = profileResponse.data.email;

    // Check if the user already exists in the database
    let user = await Users.findOne({ where: { email } });

    // Create or update user in your database
    if (!user) {
      user = {
        linkedinId: profileResponse.data.id,
        name: profileResponse.data.name,
        email: profileResponse.data.email,
        picture: profileResponse.data.picture,
        // Add more fields as needed
      };
    }

    // Generate JWT token
    const jwtPayload = {
      user: {
        id: profileResponse.data.id, // Using LinkedIn ID as user ID
        name: profileResponse.data.name,
        email: profileResponse.data.email,
        picture: profileResponse.data.picture, // Using LinkedIn profile picture as user picture
        // Add more fields if needed
      },
    };

    const jwtToken = Jwt.sign(jwtPayload, { userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    }); // Adjust expiresIn as needed

    // Check the linklogin flag to determine the redirection
    if (user) {
      // console.log('Checking linklogin');
      res.status(200).json({
        token: jwtToken,
        user: user,
        redirect: "/create", // Redirect to /create page
      });
    } else {
      // console.log('Error');
      res.status(200).json({
        token: jwtToken,
        user: user,
      });
    }
  } catch (error) {
    logger.error(error);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to extract user ID from JWT token
const getUserIdFromToken = (req) => {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];
    try {
      const decodedToken = Jwt.verify(token, jwtKey);
      console.log("ye hai user ki id", decodedToken);
      return decodedToken.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return null; // Return null if token extraction fails
};

// function to check the server is running or not by making a request to this api
const output = async (req, res) => {
  try {
    return res.json("abcd");
  } catch (error) {
    logger.error("here is the error from output", error);
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

// function to get the google user details
const getUserProfile = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extract user profile from response data
    const userProfile = response.data;
    // console.log("this is users profile data", userProfile)
    return userProfile;
  } catch (error) {
    console.error(
      "Failed to fetch user profile:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Function to generate a random alphanumeric password of a specified length
const generateRandomPassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

const PhoneNumberGenerator = (length) => {
  let PhoneNumber = "";
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    PhoneNumber += randomDigit.toString();
  }
  return PhoneNumber;
};

// Example usage:
const passwordLength = 10;
const generatePhoneNumber = PhoneNumberGenerator(10);
// console.log('Generated number:', generatePhoneNumber);
const generatedPassword = generateRandomPassword(passwordLength);
// console.log('Generated Password:', generatedPassword);

// const GoogleLogin = async (req, res) => {
//   const { token } = req.body;
// console.log("*****token********", token)

//   if (!token) {
//     return res.status(400).json({ error: 'ID token is missing' });
//   }

//   try {
//     const userProfile = await getUserProfile(token);
// console.log("ye rha user ka profile data", userProfile)

//     // Check if user exists
//     let user = await Users.findOne({ where: { email: userProfile.email } });

//     if (!user) {
//       // Download and save profile picture
//       const pictureUrl = userProfile.picture;
//       const fileExtension = path.extname(new URL(pictureUrl).pathname);
//       const fileName = `${userProfile.id}${fileExtension}`;
//       const filePath = path.join(__dirname, '../uploads/photos', fileName);

//       // Dynamically import node-fetch
//       const fetch = (await import('node-fetch')).default;
//       const response = await fetch(pictureUrl);
//       const buffer = await response.buffer();
//       fs.writeFileSync(filePath, buffer);

//       // Create new user if not found
//       user = await Users.create({
//         name: userProfile.name,
//         email: userProfile.email,
//         phone: null,
//         password: generatedPassword, // Add password if needed
//         photo: fileName, // Assuming you store the profile picture
//         category: JSON.stringify(['Others']), // Assign "Others" category during user creation
//         googleId: userProfile.id,
//         role: "user",
//         verified: true
//       });

//     }

//     // Generate JWT token for the user
//     // const jwtToken = Jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     const jwtToken = Jwt.sign({ userId: user.id }, jwtKey, { expiresIn: "1h" });

// console.log("lo data le lo", user)

//     res.status(200).set('Authorization', `Bearer ${jwtToken}`).json({ token: jwtToken, user: userProfile, redirectTo: '/create' });
//   } catch (error) {
//     logger.error("ye hai google ki error", error)
// console.error('Google login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

const GoogleLogin = async (req, res) => {
  const { token } = req.body;
  // console.log("*****token********", token);

  if (!token) {
    return res.status(400).json({ error: "ID token is missing" });
  }

  try {
    const userProfile = await getUserProfile(token);
    // console.log("ye rha user ka profile data", userProfile);

    // Check if user exists
    let user = await Users.findOne({ where: { email: userProfile.email } });

    if (!user) {
      // Send the profile data to the frontend without creating the user
      return res.status(200).json({ user: userProfile, redirectTo: "/create" });
    }
    let log = await LoginLog.create({ userId: user.id });

    // Generate JWT token for the user
    const jwtToken = Jwt.sign({ userId: user.id }, jwtKey, { expiresIn: "1h" });

    // console.log("lo data le lo", user);

    res
      .status(200)
      .set("Authorization", `Bearer ${jwtToken}`)
      .json({ token: jwtToken, user: userProfile });
  } catch (error) {
    logger.error("ye hai google ki error", error);
    console.error("Google login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sequelize = new Sequelize(config.DB, config.USER_DB, config.PASSWORD_DB, {
  host: "localhost",
  dialect: "mysql",
  pool: { min: 0, max: 10, idle: 10000 },
});

const transporter = nodemailer.createTransport({
  service: process.env.service,
  host: process.env.SmtpHost,
  port: 465,
  auth: {
    user: process.env.userMail,
    pass: process.env.password,
  },
});

// this is Register Api
const Register = async (req, res) => {
  try {
    const userData = req.body;
    // console.log("here is he data", userData);

    const processedPhone = userData.phone === "" ? null : userData.phone;

    // Check if any required field is empty
    if (!userData.name) {
      return res
        .status(400)
        .json({ field: "name", message: "Name is required" });
    }

    if (!userData.email) {
      return res
        .status(400)
        .json({ field: "email", message: "Email is required" });
    }

    if (!userData.password) {
      return res
        .status(400)
        .json({ field: "password", message: "Password is required" });
    }
    // Check if files were uploaded
    if (!req.files || !req.files.photo) {
      return res
        .status(400)
        .json({ field: "photo", message: "Photo is required" });
    }

    // Check if the uploaded file is an image
    const photoFile = req.files.photo;
    // console.log("ye hai photo file", photoFile)
    // Check if the file has an allowed image extension
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "jfif"];
    const fileExtension = photoFile[0].filename
      ? photoFile[0].filename.split(".")
      : "";
    if (!allowedExtensions.includes(fileExtension[1])) {
      return res.status(400).json({
        field: "photo",
        message: "Allowed image formats are JPG, JPEG, PNG, GIF, JFIF",
      });
    }

    // Check if user with the same email already exists
    const existingUser = await Users.findOne({
      where: { email: userData.email },
    });
    // console.log("this is the existing user", existingUser)
    if (existingUser) {
      return res
        .status(400)
        .json({ field: "email", message: "Email already exists" });
    }

    // Check if user with the same mobile number already exists
    const existingMobileUser = await Users.findOne({
      where: { phone: userData.phone },
    });
    if (existingMobileUser) {
      return res
        .status(400)
        .json({ field: "phone", message: "Mobile number already registered" });
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()-_=+{}[\]|;:'",.<>?\\/])[A-Za-z\d~`!@#$%^&*()-_=+{}[\]|;:'",.<>?\\/]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      return res.status(400).json({
        field: "password",
        message:
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
      });
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Send verification email
    await transporter.sendMail({
      from: process.env.userMail,
      to: userData.email,
      subject: "Verify your email",
      html: `<p>Please click <a href="${process.env.URL}/verify/${verificationToken}">here</a> to verify your email address.</p>`,
    });

    // Ensure "Others" category is always present
    let selectedCategories = userData.selectedCategories;
    // console.log("Category selected:", selectedCategories);

    if (typeof selectedCategories === "string") {
      selectedCategories = JSON.parse(selectedCategories);
    }

    if (!Array.isArray(selectedCategories)) {
      selectedCategories = [selectedCategories];
    }

    if (!selectedCategories.includes("Others")) {
      selectedCategories.push("Others");
    }

    // console.log("Final categories:", selectedCategories);

    // const Category = selectedCategories;

    // Create a new user instance and save it to the database
    const newUser = await Users.create({
      name: req.body.name,
      email: userData.email,
      password: userData.password,
      phone: processedPhone,
      photo: photoFile[0].filename,
      category: JSON.stringify(selectedCategories), // Store as a JSON string
      verificationToken: verificationToken, // Store verification token in the database
      aadhar: userData.aadhar,
      address: userData.address,
      role: "user",
      organization: JSON.stringify(userData.organization), // Add the organization field

      // Add other fields as needed
    });

    const orgArray = JSON.parse(userData.organization);

    await Promise.all(
      orgArray.map(async (org) => {
        return await db.AttachOrg.create({
          // Add your fields here
          UserId: newUser.id,
          OrgId: org,
          // other fields as needed
        });
      })
    );

    // You can add more error handling and validation as needed

    return res.status(201).json({
      status: "success",
      message:
        "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    logger.error("Registration failed:", error);
    console.error("Registration failed:", error);
    return res.status(500).json({
      status: "error",
      message: "Registration failed",
    });
  }
};

//linkedin registration
const RegisterLinkedin = async (req, res) => {
  try {
    const userData = req.body;
    // console.log("here is he data", userData);

    // Check if any required field is empty
    if (!userData.name) {
      return res
        .status(400)
        .json({ field: "name", message: "Name is required" });
    }

    if (!userData.email) {
      return res
        .status(400)
        .json({ field: "email", message: "Email is required" });
    }

    if (!userData.photo) {
      return res
        .status(400)
        .json({ field: "photo", message: "Photo is required" });
    }

    // Validate photo URL
    const urlRegex =
      /(http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (!urlRegex.test(userData.photo)) {
      return res
        .status(400)
        .json({ field: "photo", message: "Invalid photo URL format" });
    }

    // Check if user with the same email already exists
    const existingUser = await Users.findOne({
      where: { email: userData.email },
    });
    // console.log("this is the existing user", existingUser)
    if (existingUser) {
      return res
        .status(400)
        .json({ field: "email", message: "Email already exists" });
    }

    // Check if user with the same mobile number already exists
    const existingMobileUser = await Users.findOne({
      where: { phone: userData.phone },
    });
    if (existingMobileUser) {
      return res
        .status(400)
        .json({ field: "phone", message: "Mobile number already registered" });
    }

    // Check if user with the same aadhar number already exists
    // const existingAadharUser = await Users.findOne({ where: { aadhar: userData.aadhar } });
    // if (existingAadharUser) {
    //   return res
    //     .status(400)
    //     .json({ message: "Aadhar number already registered" });
    // }

    // Ensure "Others" category is always present
    let selectedCategories = userData.selectedCategories;
    // console.log("Category selected:", selectedCategories);

    if (typeof selectedCategories === "string") {
      selectedCategories = JSON.parse(selectedCategories);
    }

    if (!Array.isArray(selectedCategories)) {
      selectedCategories = [selectedCategories];
    }

    if (!selectedCategories.includes("Others")) {
      selectedCategories.push("Others");
    }

    // Download and save profile picture
    const pictureUrl = userData.photo;
    const fileExtension = path.extname(new URL(pictureUrl).pathname);
    const fileName = `${userData.email}${fileExtension} photo`;
    const filePath = path.join(__dirname, "../uploads/photos", fileName);

    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(pictureUrl);
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);

    // const Category = selectedCategories;

    // Create a new user instance and save it to the database
    const newUser = await Users.create({
      name: userData.name,
      email: userData.email,
      password: generatedPassword,
      phone: userData.phone,
      photo: fileName,
      category: JSON.stringify(selectedCategories), // Store as a JSON string
      aadhar: userData.aadhar,
      role: "user",
      organization: userData.organization, // Add the organization field
      verified: true,
      // Add other fields as needed
    });

    // You can add more error handling and validation as needed
    const token = Jwt.sign({ userId: newUser.id }, jwtKey, { expiresIn: "1d" });
    // console.log("this is the token********************-------------------",token)

    return res.status(201).json({
      status: "success",
      message: "Registration successful.",
      data: {
        userKey: newUser,
        token,
      },
    });
  } catch (error) {
    logger.error("Registration failed:", error);
    console.error("Registration failed:", error);
    return res.status(500).json({
      status: "error",
      message: "Registration failed",
    });
  }
};

//Email verification API
const verify = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log("this is token", token)

    const user = await Users.findOne({ where: { verificationToken: token } });
    // Check if user is already verified
    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Find user by verification token
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    // Update user's verified status
    await user.update({ verified: true, verificationToken: null });

    return res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    logger.error("Email verification failed:", error);
    console.error("Email verification failed:", error);
    return res.status(500).json({ message: "Email verification failed" });
  }
};

//Forget Password API
const forgetpassword = async (req, res) => {
  const { email } = req.body;
  console.log("this is the email", email);

  // Check if email exists in the database
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  // Generate 6-digit PIN
  const pin = randomstring.generate({ length: 6, charset: "numeric" });
  // console.log("*-*-this is the generated pin*-*-", pin)

  // Update user's resetPin field with the generated PIN
  user.resetPin = pin;
  await user.save();

  // // Send PIN to the user's email
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'vaibhavkurmi786@gmail.com',
  //     pass: 'kakparbgukhobhwb'
  //   }
  // });

  const mailOptions = {
    from: process.env.userMail,
    to: email,
    subject: "Reset Password PIN",
    text: `Your PIN for resetting the password is: ${pin}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error("error sending mail", error);
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Error sending PIN email" });
    } else {
      // console.log('Email sent:', info.response);
      return res.status(200).json({ message: "PIN sent to your email" });
    }
  });
};

//Verify Pin API
const verifyPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    // console.log("ye hian email aur pin", email, pin)

    // Find user by email
    const user = await Users.findOne({ where: { email } });
    // console.log("***ye hai user ka data***", user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the entered PIN matches the stored PIN
    if (pin !== user.resetPin) {
      return res.status(400).json({ message: "Invalid PIN" });
    }
    user.resetPin = null;
    return res.status(200).json({ message: "PIN verified successfully" });
  } catch (error) {
    logger.error("Here is the error", error);
    // console.error("PIN verification failed:", error);
    return res.status(500).json({
      status: "error",
      message: "PIN verification failed",
    });
  }
};

//Update Mobile Number API
const UpdatePhoneNumber = async (req, res) => {
  try {
    const { userId, phone } = req.body;

    // Check if userId and newPhoneNumber are provided
    if (!userId || !phone) {
      return res
        .status(400)
        .json({ message: "User ID and new phone number are required" });
    }

    // Find the user by userId
    const user = await Users.findOne({ where: { id: userId } });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the phone number for the user
    user.phone = phone;
    user.confirm = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "Phone number updated successfully", user });
  } catch (error) {
    console.error("Error updating phone number:", error);
    return res.status(500).json({ message: "Error updating phone number" });
  }
};

//Update Password API
const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find user by email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()-_=+{}[\]|;:'",.<>?\\/])[A-Za-z\d~`!@#$%^&*()-_=+{}[\]|;:'",.<>?\\/]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must include at least one small letter, one capital letter, one number and one special character.",
      });
    }

    // Check if the new password is the same as the old password
    if (newPassword === user.password) {
      return res.status(400).json({
        message: "New password must be different from the old password.",
      });
    }

    // Update user's password and clear resetPin
    user.password = newPassword;
    // user.resetPin = null; // Clear the resetPin after successful password reset
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // console.log("email ", req.body);

  try {
    // Find the user based on the provided email
    const user = await Users.findOne({ where: { email } });
    // console.log("**/*/*/* THIS IS USER /*/*/*/*/", user);

    let log = await LoginLog.create({ userId: user.id });

    // Check if the password matches
    if (!user && !log) {
      return res.status(401).json({ error: "Email not found." });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid  password." });
    }

    // Check if the user is verified
    if (!user.verified) {
      return res
        .status(401)
        .json({ error: "Email is not verified. Please verify your email." });
    }

    const token = Jwt.sign({ userId: user.id }, jwtKey, {
      expiresIn: "1d",
    });
    // console.log("token", token);
    // console.log("*** role of the user ***", user.role);

    const userKey = {
      id: user.id,
      email: user.email,
      name: user.name,
      // token:user.token
    };

    res.status(200).json({
      token,
      userKey: userKey, // Assuming userKey is the user's ID
      role: user.role, // Assuming user's role is stored in the 'role' field of the User model
      redirectTo: user.role === "admin" ? "/admin" : "/create", // Define redirection URL based on role
    });
    // Successful login
  } catch (error) {
    logger.error("here is the error", error);
    // console.log("error or exception", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("this is the email id recieved", email)

    // Check if the user exists with the provided email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a new verification token
    const newVerificationToken = crypto.randomBytes(20).toString("hex");

    // Update the user's verification token in the database
    await user.update({ verificationToken: newVerificationToken });

    // Send the new verification email
    await transporter.sendMail({
      from: process.env.userMail,
      to: email,
      subject: "Verify your email",
      html: `<p>Please click <a href="${process.env.URL}/verify/${newVerificationToken}">here</a> to verify your email address.</p>`,
    });

    return res.status(200).json({
      status: "success",
      message: "Verification email sent successfully.",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while sending verification email.",
    });
  }
};

const varifybytiken = async (req, res) => {
  const { userKey, token } = req.body;
  // console.log("userKey", userKey);
  // console.log("token", token);

  try {
    const verifytoken = Jwt.verify(token, jwtKey);

    if (!verifytoken) {
      return res.status(401).json({ error: "Invalid token " });
    }

    // Check if the user is an admin
    const { isAdmin } = verifytoken;
    res.json({
      status: "success",
      isAdmin,
    });
  } catch (error) {
    logger.error("Error verifying token:", error);
    res.status(500).json({ error: "An error occurred while verifying token." });
  }
};

const varifybytoken = async (req, res) => {
  const { accessToken, name, id, clientId, Email, credential } = req.body;
  // console.log("email", Email);
  // console.log("token", credential);

  try {
    const verifytoken = Jwt.verify(credential, jwtKey);
    // console.log(verifytoken, "veryfi");

    if (!verifytoken) {
      return res.status(401).json({ error: "Invalid token " });
    } else {
      res.json({
        status: "success",
      });
    }
  } catch (error) {
    logger.error("here is the error", error);
    res.status(500).json({ error: error });
  }
};

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];

    try {
      const decodedToken = Jwt.verify(token, jwtKey);

      // Attach the decoded token to the request object for further use
      req.decodedToken = decodedToken;

      // Move to the next middleware or controller function
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    return res.status(401).json({ error: "Authorization header missing" });
  }
};

const profile = async (req, res) => {
  // Extract user ID from JWT token
  const userId = getUserIdFromToken(req);
  // console.log("ye profile se aa rhi hai userID", userId)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const authorizationHeader = req.headers["authorization"];

    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];

      try {
        const decodedToken = Jwt.verify(token, jwtKey);

        const userId = decodedToken.userId;

        const connection = await mysql.createConnection({
          host: "localhost",
          user: process.env.USER_DB,
          password: process.env.PASSWORD_DB,
          database: process.env.DB,
        });

        const [rows] = await connection.execute(
          "SELECT `id`, `name`,`photo`, `email`,`phone`, `address`, `googleId`, `organization`, `category` FROM `users` WHERE id = ?",
          [userId]
        );

        connection.end();

        if (rows.length === 1) {
          const userData = {
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
            photo: rows[0].photo,
            phone: rows[0].phone,
            address: rows[0].address,
            totalTime: rows[0].totalTime, // Include totalTime from the database
            googleId: rows[0].googleId, // Include googleId from the database
            organization: rows[0].organization, // Include googleId from the database
            category: rows[0].category, // Include googleId from the database
          };

          res.json({
            status: "success",
            userData: userData,
          });
        } else {
          res.status(404).json({
            status: "error",
            message: "User not found",
          });
        }
      } catch (error) {
        logger.error("here is the error", error);
        if (error.name == "TokenExpiredError") {
          res.json({
            status: "error",
            message: "Token has expired",
          });
        } else {
          logger.error("this is the error from token", error);
          console.error("Error decoding token:", error);
          res.status(401).send("Invalid token");
        }
      }
    } else {
      res.status(401).send("Authorization header missing");
    }
  } catch (error) {
    logger.error("here is the error", error);
    console.error("Error in profile endpoint:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request",
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];

      try {
        const decodedToken = Jwt.verify(token, jwtKey);

        const userId = decodedToken.userId;

        // Retrieve the calculated time from the request body
        const { calculatedTime } = req.body;

        const connection = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "activity",
        });

        // Fetch the user's data from the database
        const [rows] = await connection.execute(
          "SELECT `totalTime` FROM `users` WHERE id = ?",
          [userId]
        );

        if (rows.length === 1) {
          const currentTime = rows[0].totalTime || 0;

          // Update the user's total time by adding the new calculated time
          const newTotalTime = currentTime + calculatedTime;

          await connection.execute(
            "UPDATE `users` SET `totalTime` = ? WHERE id = ?",
            [newTotalTime, userId]
          );

          connection.end();

          res.json({
            status: "success",
            message: "User data updated successfully",
          });
        } else {
          res.status(404).json({
            status: "error",
            message: "User not found",
          });
        }
      } catch (error) {
        logger.error("here is the error", error);
        // ... (existing code)
      }
    } else {
      res.status(401).send("Authorization header missing");
    }
  } catch (error) {
    logger.error("here is the error", error);
    // ... (existing code)
  }
};

const CreateActivity = async (req, res) => {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract userId from the token
    const userId = getUserIdFromToken(req);
    console.log("YE HAI USER KI ID", userId);

    if (userId === null || userId === undefined) {
      // console.log("no user id found");
      logger.error("userid not found while creating activity", errors);
      return;
    }

    const {
      selectedCategories,
      date,
      fromTime,
      toTime,
      latitude,
      longitude,
      organization,
    } = req.body;

    const activityDate = new Date(date);
    const currentDate = new Date();
    const fromTimeDate = parse(fromTime, "HH:mm", activityDate);
    const toTimeDate = parse(toTime, "HH:mm", activityDate);

    // Check if toTime is after current time for today's date
    if (
      isSameDay(activityDate, currentDate) &&
      isAfter(toTimeDate, currentDate)
    ) {
      return res.status(400).json({ error: "To time cannot be in the future" });
    }

    const timeDifferenceInMinutes = differenceInMinutes(
      toTimeDate,
      fromTimeDate
    );

    if (timeDifferenceInMinutes <= 0 || timeDifferenceInMinutes > 480) {
      return res.status(400).json({ error: "Invalid time range" });
    }

    // Format the date to yyyy-mm-dd format
    const formattedDate = format(new Date(date), "yyyy-MM-dd");

    // console.log("req data mai date kya aa rhi hai ", formattedDate);
    // Check if files were uploaded
    if (!Array.isArray(req.files.photo)) {
      return res.status(400).json({ error: "Photos should be an array" });
    }

    const photos = req.files.photo.reduce((acc, file) => {
      acc.push(file.filename);
      return acc;
    }, []);

    console.log("ye hain photos", photos);

    // Check if files were uploaded
    // const photos =
    //   req.files && req.files.photo
    //     ? req.files.photo.reduce((acc, file) => {
    //         // acc.push(file.filename);
    //         return acc + file.filename;
    //       }, [])
    //     : "";

    // console.log("ye hain photos", photos);
    // const videos =
    //   req.files && req.files.video
    //     ? req.files.video.reduce((acc, file) => {
    //         // acc.push(file.filename);
    //         return acc + file.filename;
    //       }, [])
    //     : "";
    // console.log("ye hain videos", videos);

    // Check for missing fields and create an array to store missing fields
    const missingFields = [];
    if (!selectedCategories) missingFields.push("selectedCategories");
    if (!date) missingFields.push("date");
    if (!fromTime) missingFields.push("fromTime");
    if (!toTime) missingFields.push("toTime");
    if (!latitude) missingFields.push("latitude");
    if (!longitude) missingFields.push("longitude");
    if (!photos) missingFields.push("photos");

    // If there are missing fields, return an error with the list of missing fields
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const category = selectedCategories;

    const calculateTotalTime = (fromTime, toTime) => {
      const [fromHour, fromMinute] = fromTime.split(":").map(Number);
      const [toHour, toMinute] = toTime.split(":").map(Number);

      const totalMinutes =
        toHour * 60 + toMinute - (fromHour * 60 + fromMinute);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      // console.log(`${minutes}:${hours}`);
      return `${hours}:${minutes}`;
    };
    // Calculate total time spent
    const totalTime = calculateTotalTime(fromTime, toTime);

    // Fetch the current stored time for the user
    const user = await Users.findByPk(userId);
    const storedTime = user ? user.totalTime : 0;

    // Update the stored time by adding the current activity time
    const updatedStoredTime = storedTime + parseInt(totalTime);

    // Update the user's total time in the database
    await Users.update(
      { totalTime: updatedStoredTime },
      { where: { id: userId } }
    );

    // console.log("what is the date", date)
    // Save to the database
    let created_post = await Posts.create({
      category,
      photos: JSON.stringify(photos),
      // videos,
      Date: formattedDate,
      totalTime,
      latitude,
      longitude,
      fromTime,
      // location: JSON.stringify({ latitude, longitude }), // Store as JSON string in the database
      UserId: userId,
      organization: organization,
    });

    res
      .status(201)
      .json({ message: "Activity created successfully", created_post });
  } catch (error) {
    logger.error("here is the error", error);
    console.error("Error creating activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const AllDetails = async (req, res) => {
  try {
    // Extract userId from the token
    const userId = req.user.id;

    const all_posts = await db.Posts.findAll({
      attributes: ["UserId", "Category", "totalTime"],
      where: { UserId: userId },
    });

    // Calculate the sum of totalTime
    let totalTimeSum = 0;
    all_posts.forEach((post) => {
      totalTimeSum += convertTimeToSeconds(post.totalTime);
    });

    // Convert the total time sum back to HH:mm:ss format
    const formattedTotalTimeSum = convertSecondsToTime(totalTimeSum);

    // console.log("Total Time Sum:", formattedTotalTimeSum);

    // Update totalTime in the users table
    const user = await db.users.findByPk(userId);
    if (user) {
      user.totalTime = formattedTotalTimeSum;
      await user.save();
    }

    res.status(200).json({ all_posts, totalTimeSum: formattedTotalTimeSum });
  } catch (error) {
    console.error("Here is the error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const TotalTimeSpent = async (req, res) => {
  try {
    const all_posts = await db.Posts.findAll({
      attributes: ["UserId", "Category", "totalTime"],
      where: { UserId: req.params.id, approved: true },
    });

    // Calculate the sum of totalTime
    let totalTimeSum = 0;
    all_posts.forEach((post) => {
      totalTimeSum += convertTimeToSeconds(post.totalTime);
      // console.log(totalTimeSum, "time spent")
    });

    // Convert the total time sum back to HH:mm:ss format
    const formattedTotalTimeSum = convertSecondsToTime(totalTimeSum);

    // console.log("Total Time Sum:", formattedTotalTimeSum);

    // Update totalTime in the users table
    const user = await db.users.findByPk(req.params.id);
    if (user) {
      user.totalTime = formattedTotalTimeSum;
      await user.save();
    }

    res.status(200).json({ totalTimeSum: formattedTotalTimeSum });
  } catch (error) {
    console.error("Here is the error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPostedCategories = async (req, res) => {
  const userId = req.params.id;
  try {
    const all_posts = await db.Posts.findAll({
      attributes: ["UserId", "Category"],
      where: { UserId: userId, approved: true },
    });

    // Calculate the sum of totalTime
    let categoriesArray = all_posts.map((post) => post.dataValues.Category);

    // all_posts.forEach((post) => {
    //   categoriesArray.push(post.Category);
    //   console.log(post.Category, "list of categoreis")
    // });
    // console.log(categoriesArray);

    res.status(200).json({ categoriesArray });
  } catch (error) {
    console.error("Here is the error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to convert HH:mm:ss time format to seconds
const convertTimeToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Helper function to convert seconds to HH:mm:ss time format
const convertSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const postsdata = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const posts = await db.Posts.findAll({
      where: { UserId: userId },
    });

    res.json(posts);
  } catch (error) {
    logger.error("here is the error", error);
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const endorsePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;

  try {
    // Check if the user has already endorsed the post
    const existingEndorsement = await Endorsement.findOne({
      where: { userId, postId },
    });

    if (existingEndorsement) {
      return res
        .status(400)
        .json({ error: "You have already endorsed this post." });
    }

    const post = await Posts.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Increment the endorsements count
    post.endorsementCounter = post.endorsementCounter
      ? post.endorsementCounter + 1
      : 1; // Check if endorsements exist before incrementing
    await post.save();

    // Record the endorsement in the Endorsements table
    await Endorsement.create({ userId, postId });

    return res.status(200).json({
      message: "Post endorsed successfully",
      post: { id: post.id, endorsementCounter: post.endorsementCounter },
    });
  } catch (error) {
    logger.error("Error endorsing post:", error);
    console.error("Error endorsing post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const fetchPostsInArea = async (req, res) => {
  try {
    const { latitude, longitude, userId } = req.body;
    const { username } = req.query; // Get the username query parameter
    // Check if latitude, longitude, and userId are provided in the request body
    if (!latitude || !longitude || !userId) {
      return res.status(400).json({ error: "Missing required data" });
    }

    // Calculate the coordinates of the area's boundaries (50 kilometers around the given coordinates)
    const earthRadiusKm = 6371;
    const distanceKm = 5000;

    const latRadians = latitude * (Math.PI / 180);
    // const lonRadians = longitude * (Math.PI / 180);

    const latDelta = distanceKm / earthRadiusKm;
    const lonDelta = Math.asin(Math.sin(latDelta) / Math.cos(latRadians));

    const minLat = latitude - latDelta * (180 / Math.PI);
    const maxLat = latitude + latDelta * (180 / Math.PI);
    const minLon = longitude - lonDelta * (180 / Math.PI);
    const maxLon = longitude + lonDelta * (180 / Math.PI);
    // console.log("this is minLat", minLat);
    // console.log("this is minLon", minLon);
    // console.log("this is maxLat", maxLat);
    // console.log("this is maxLon", maxLon);
    // console.log(userId);
    // Fetch posts from all other users within the calculated area
    let postsInArea = await db.Posts.findAll({
      where: {
        UserId: { [Op.ne]: userId }, // Exclude posts from the logged-in user
        latitude: { [Op.between]: [minLat, maxLat] },
        longitude: { [Op.between]: [minLon, maxLon] },
        endorsementCounter: { [Op.lt]: 1 },
        approved: 0,
        rejected: 0,
      },

      include: [
        {
          model: Users,
          attributes: ["name"], // Only fetch the 'username' attribute from the User model
        },
      ],
    });
    // console.log("all post from the area", postsInArea);

    // If a username search query is provided, filter posts by username
    if (username) {
      postsInArea = postsInArea.filter(
        (post) => post.User && post.User.name === username
      );
    }

    // Exclude posts that have been endorsed by the current user
    const endorsedPosts = await db.Endorsement.findAll({
      where: { userId: userId },
      attributes: ["postId"],
    });
    const endorsedPostIds = endorsedPosts.map(
      (endorsement) => endorsement.postId
    );
    postsInArea = postsInArea.filter(
      (post) => !endorsedPostIds.includes(post.id)
    );

    res.json(postsInArea);
  } catch (error) {
    logger.error("Error fetching posts in area:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({ where: { isEnabled: true } });

    if (categories.length === 0) {
      return res.status(200).json({ message: "No categories found" });
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

//ADMINISTRATOR CONTROLLERS

// adminAuthMiddleware.js
const adminAuthMiddleware = (req, res, next) => {
  // Assuming you have the user's role stored in req.user.role after authentication
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, continue to the next middleware or route handler
  } else {
    return res.status(403).json({ error: "Unauthorized access" });
  }
};

const isAdmin = (req, res, next) => {
  // Check if the user is authenticated and has the admin role
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];
    try {
      const decodedToken = Jwt.verify(token, jwtKey);
      const userId = decodedToken.userId;

      // Assuming you have a User model with a 'role' field
      Users.findByPk(userId)
        .then((user) => {
          if (user && user.role === "admin") {
            // User is an admin, allow access
            next();
          } else {
            res.status(403).json({
              error: "Unauthorized. Only admin users can access this resource.",
            });
          }
        })
        .catch((err) => {
          console.error("Error checking user role:", err);
          res.status(500).json({ error: "Internal Server Error" });
        });
    } catch (error) {
      console.error("Error decoding token:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  } else {
    res.status(401).json({ error: "Authorization header missing" });
  }
};

// Helper function to get the current year
const getCurrentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

// Controller to fetch users with the most posts in the current year
const getUsersWithMostPostsInYear = async (req, res) => {
  try {
    const currentYear = getCurrentYear();

    // Fetch all users excluding admins
    const allUsers = await db.users.findAll({
      where: {
        role: {
          [Op.ne]: "admin", // Exclude users with the role of admin
        },
      },
    });

    // Initialize an array to store users with approved posts
    const usersWithApprovedPosts = [];

    // Iterate through all users to count their approved posts in the current year
    for (const user of allUsers) {
      const userApprovedPosts = await db.Posts.findAll({
        where: {
          UserId: user.id,
          approved: true, // Assuming 'approved' is a boolean column for approved posts
          Date: {
            [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
          },
        },
      });

      // Only include users with approved posts in the current year
      if (userApprovedPosts.length > 0) {
        usersWithApprovedPosts.push({
          userId: user.id,
          approvedPostCount: userApprovedPosts.length,
        });
      }
    }

    // Sort the usersWithApprovedPosts array by approved post count in descending order
    const sortedUsersByApprovedPosts = usersWithApprovedPosts.sort(
      (a, b) => b.approvedPostCount - a.approvedPostCount
    );

    const topThreeUsers = sortedUsersByApprovedPosts.slice(0, 3);

    // Fetch user names based on the sorted user IDs
    const topUserNames = await Promise.all(
      topThreeUsers.map(async (user) => {
        const userData = await db.users.findByPk(user.userId);
        return {
          name: userData.name,
          id: userData.id,
          approvedPostCount: user.approvedPostCount,
        };
      })
    );
    console.log("ye hain top users", topUserNames);

    res.status(200).json({ topUserNames });
  } catch (error) {
    logger.error("error from fetching maximum number of post by users", error);
    console.error("Error fetching users with most posts in the year:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to fetch users with the most posts in the last six months
const getUsersWithMostPostsInSixMonths = async (req, res) => {
  try {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(
      currentDate.setMonth(currentDate.getMonth() - 6)
    );

    // Fetch all users excluding admins
    const allUsers = await db.users.findAll({
      where: {
        role: {
          [Op.ne]: "admin", // Exclude users with the role of admin
        },
      },
    });

    // Initialize an array to store users with approved posts
    const usersWithApprovedPosts = [];

    // Iterate through all users to count their approved posts in the past six months
    for (const user of allUsers) {
      const userApprovedPosts = await db.Posts.findAll({
        where: {
          UserId: user.id,
          approved: true, // Assuming 'approved' is a boolean column for approved posts
          Date: {
            [Op.between]: [
              sixMonthsAgo.toISOString().split("T")[0],
              new Date().toISOString().split("T")[0],
            ],
          },
        },
      });

      // Only include users with approved posts in the past six months
      if (userApprovedPosts.length > 0) {
        usersWithApprovedPosts.push({
          userId: user.id,
          approvedPostCount: userApprovedPosts.length,
        });
      }
    }

    // Sort the usersWithApprovedPosts array by approved post count in descending order
    const sortedUsersByApprovedPosts = usersWithApprovedPosts.sort(
      (a, b) => b.approvedPostCount - a.approvedPostCount
    );

    // Limit to top 3 users
    const topThreeUsers = sortedUsersByApprovedPosts.slice(0, 3);
    // Fetch user names based on the sorted user IDs
    const topUserNames = await Promise.all(
      topThreeUsers.map(async (user) => {
        const userData = await db.users.findByPk(user.userId);
        return {
          name: userData.name,
          id: userData.id,
          approvedPostCount: user.approvedPostCount,
        };
      })
    );

    res.status(200).json({ topUserNames });
  } catch (error) {
    logger.error(
      "Error fetching users with most posts in the past six months",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Controller to fetch users with the most posts in the last three months
const getUsersWithMostPostsInQuater = async (req, res) => {
  try {
    const currentDate = new Date();
    const threeMonthsAgo = new Date(
      currentDate.setMonth(currentDate.getMonth() - 3)
    );

    // Fetch all users excluding admins
    const allUsers = await db.users.findAll({
      where: {
        role: {
          [Op.ne]: "admin", // Exclude users with the role of admin
        },
      },
    });

    // Initialize an array to store users with approved posts
    const usersWithApprovedPosts = [];

    // Iterate through all users to count their approved posts in the past six months
    for (const user of allUsers) {
      const userApprovedPosts = await db.Posts.findAll({
        where: {
          UserId: user.id,
          approved: true, // Assuming 'approved' is a boolean column for approved posts
          Date: {
            [Op.between]: [
              threeMonthsAgo.toISOString().split("T")[0],
              new Date().toISOString().split("T")[0],
            ],
          },
        },
      });

      // Only include users with approved posts in the past six months
      if (userApprovedPosts.length > 0) {
        usersWithApprovedPosts.push({
          userId: user.id,
          approvedPostCount: userApprovedPosts.length,
        });
      }
    }

    // Sort the usersWithApprovedPosts array by approved post count in descending order
    const sortedUsersByApprovedPosts = usersWithApprovedPosts.sort(
      (a, b) => b.approvedPostCount - a.approvedPostCount
    );
    // Limit to top 3 users
    const topThreeUsers = sortedUsersByApprovedPosts.slice(0, 3);
    // Fetch user names based on the sorted user IDs
    const topUserNames = await Promise.all(
      topThreeUsers.map(async (user) => {
        const userData = await db.users.findByPk(user.userId);
        return {
          name: userData.name,
          id: userData.id,
          approvedPostCount: user.approvedPostCount,
        };
      })
    );

    res.status(200).json({ topUserNames });
  } catch (error) {
    logger.error(
      "Error fetching users with most posts in the past six months",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Controller to fetch users with the most posts in the current month
const getUsersWithMostPostsInMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Fetch all users excluding admins
    const allUsers = await db.users.findAll({
      where: {
        role: {
          [Op.ne]: "admin", // Exclude users with the role of admin
        },
      },
    });

    // Initialize an object to store user IDs and their approved post counts for the current month
    const userApprovedPostCounts = {};

    // Iterate through all users to count their approved posts in the current month
    for (const user of allUsers) {
      const userApprovedPosts = await db.Posts.findAll({
        where: {
          UserId: user.id,
          approved: true, // Only include approved posts
          Date: {
            [Op.between]: [
              startOfMonth.toISOString().split("T")[0],
              endOfMonth.toISOString().split("T")[0],
            ],
          },
        },
      });

      if (userApprovedPosts.length > 0) {
        userApprovedPostCounts[user.id] = userApprovedPosts.length;
      }
    }

    // Sort the userApprovedPostCounts object by approved post count in descending order
    const sortedUserApprovedPostCounts = Object.entries(
      userApprovedPostCounts
    ).sort((a, b) => b[1] - a[1]);

    // Extract the top 5 users with the most approved posts in the current month
    const topUsers = sortedUserApprovedPostCounts
      .slice(0, 3)
      .map(([userId, postCount]) => ({
        userId,
        postCount,
      }));

    // Fetch user names based on the top user IDs
    const topUserNames = await Promise.all(
      topUsers.map(async (user) => {
        const userData = await db.users.findByPk(user.userId);
        return {
          name: userData.name,
          id: userData.id,
          postCount: user.postCount,
        };
      })
    );

    res.status(200).json({ topUserNames });
  } catch (error) {
    logger.error(
      "Error fetching users with most posts in the current month",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveHours = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Posts.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    post.approved = true;
    await post.save();

    res.status(200).json({ message: "Post approved successfully." });
  } catch (error) {
    logger.error("Error approving post:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const rejectHours = async (req, res) => {
  const { postId } = req.params;
  const { rejectionReason } = req.body;

  try {
    const post = await Posts.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    post.approved = false;
    post.rejectionReason = rejectionReason;
    post.rejected = true;
    await post.save();

    res.status(200).json({ message: "Post rejected successfully." });
  } catch (error) {
    console.error("Error rejecting post:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const pendingApproval = async (req, res) => {
  try {
    const posts = await Posts.findAll({
      where: {
        endorsementCounter: {
          [Op.gt]: 0, // will find all posts with endorsementCounter greater than 0
        },
        approved: false,
        rejected: false,
      },
      include: [
        {
          model: Users,
          attributes: ["name"], // Include only the name attribute from the Users table
        },
      ],
    });
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts pending for approval." });
    }
    res.json(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, isEnabled } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    // Check if the category already exists
    const existingCategory = await Categories.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Categories.create({ name, isEnabled });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

const getCategoriesAdmin = async (req, res) => {
  try {
    const { isEnabled } = req.query;
    const whereCondition = {};
    if (isEnabled !== undefined) {
      whereCondition.isEnabled = isEnabled === "true"; // Convert string to boolean
    }

    const categories = await Categories.findAll({ where: whereCondition });
    // console.log("ye rhi categorires", categories)
    if (categories.length === 0) {
      return res.status(200).json({ message: "No categories found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
};

const toggleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { isEnabled } = req.body;

    // Find the category by ID
    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category's isEnabled status
    category.isEnabled = isEnabled;
    await category.save();

    res
      .status(200)
      .json({ message: "Category status updated successfully", category });
  } catch (error) {
    console.error("Error toggling category:", error);
    res.status(500).json({ message: "Failed to toggle category", error });
  }
};

const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    // Check if the organization already exists
    const existingOrganization = await Organizations.findOne({
      where: { name },
    });
    if (existingOrganization) {
      return res.status(400).json({ message: "Organization already exists" });
    }

    const organization = await Organizations.create({ name });
    res
      .status(201)
      .json({ message: "Organization created successfully", organization });
  } catch (error) {
    res.status(500).json({ message: "Failed to create organization", error });
  }
};

const getOrganizationsAdmin = async (req, res) => {
  try {
    const { isEnabled } = req.query;
    const whereCondition = {};
    if (isEnabled !== undefined) {
      whereCondition.isEnabled = isEnabled === "true"; // Convert string to boolean
    }

    const organizations = await Organizations.findAll({
      where: whereCondition,
    });
    // console.log("ye rhi organizations", organizations)
    if (organizations.length === 0) {
      return res.status(200).json({ message: "No organization found" });
    }
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organizations.findAll({
      where: { isEnabled: true },
    });

    if (organizations.length === 0) {
      return res.status(200).json({ message: "No organizations found" });
    }

    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch organizations", error });
  }
};

const getOrganizationsUser = async (req, res) => {
  try {
    const id = getUserIdFromToken(req);
    const organizations = await Organizations.findAll({
      include: [
        {
          model: AttachOrg,
          where: { UserId: id },
        },
      ],
      where: { isEnabled: true },
    });

    if (organizations.length === 0) {
      return res.status(200).json({ message: "No organizations found" });
    }

    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch organizations", error });
  }
};

const toggleOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organizations.findByPk(id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    organization.isEnabled = !organization.isEnabled;
    await organization.save();

    res
      .status(200)
      .json({ message: "Organization toggled successfully", organization });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle organization", error });
  }
};

const addApprover = async (req, res) => {
  try {
    const approverData = req.body;
    // console.log("Received approver data:", approverData);

    // Validation
    if (!approverData.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!approverData.email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!approverData.address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // Check if approver with the same email already exists
    const existingApprover = await Approver.findOne({
      where: { email: approverData.email },
    });
    if (existingApprover) {
      return res
        .status(400)
        .json({ message: "Email already exists in approvers" });
    }

    // Check if the email exists in the users table
    const existingUser = await Users.findOne({
      where: { email: approverData.email },
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          "Email already exists in users. Cannot make this user an approver.",
      });
    }

    // Create a new approver instance and save it to the database
    const newApprover = await Approver.create({
      name: approverData.name,
      email: approverData.email,
      phone: approverData.phone,
      address: approverData.address,
      aadhar: approverData.aadhar,
    });

    return res.status(201).json({
      status: "success",
      message: "Approver added successfully",
      data: newApprover,
    });
  } catch (error) {
    console.error("Adding approver failed:", error);
    return res.status(500).json({
      status: "error",
      message: "Adding approver failed",
    });
  }
};

const fetchApprovers = async (req, res) => {
  try {
    const approvers = await Approver.findAll();
    if (approvers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No approvers found",
      });
    }
    return res.status(200).json(approvers);
  } catch (error) {
    console.error("Fetching approvers failed:", error);
    return res.status(500).json({
      status: "error",
      message: "Fetching approvers failed",
    });
  }
};

// Update an approver

const updateApprover = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedApprover = await Approver.update(req.body, {
      where: { id },
    });
    res.json(updatedApprover);
  } catch (error) {
    console.error("Error updating approver:", error);
    res.status(500).json({ message: "Error updating approver" });
  }
};

// Delete an approver

const deleteApprover = async (req, res) => {
  const { id } = req.params;
  try {
    await Approver.destroy({ where: { id } });
    res.json({ message: "Approver deleted successfully" });
  } catch (error) {
    console.error("Error deleting approver:", error);
    res.status(500).json({ message: "Error deleting approver" });
  }
};

// Controller to get all users
const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name"], // Fetch only id and name
      where: {
        role: {
          [Op.ne]: "admin", // Exclude users with the role of admin
        },
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

// Controller to delete a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user" });
  }
};

//controller for getting all posts on a particular date
const postsForDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    // Validate the input dates

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "Both start and end dates are required." });
    }
    let dateCondition = {};
    let errorMessage =
      "No posts found for the specified categories and date range.";
    if (start && end) {
      // const startDate = new Date(start);
      // const endDate = new Date(end);
      // console.log(startDate, "start date");
      // console.log(endDate, "end date");
      dateCondition = { [Op.between]: [start, end] };
      errorMessage =
        "No posts found for the specified categories in the selected date range.";
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateCondition = { [Op.gte]: thirtyDaysAgo };
      errorMessage =
        "No posts found for the specified categories within past 30 days.";
    }

    // const posts = await db.Posts.findAll({
    //   where: {
    //     Date: {
    //       [db.Sequelize.Op.between]: [start, end],
    //     },
    //     approved : true
    //   },
    // });
    const posts = await db.Posts.findAll({
      where: {
        Date: dateCondition,
        approved: true,
      },
    });
    // console.log("ye hain selected range of date ke posts", posts)

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ error: "No posts found for the specified date range." });
    }

    res.json(posts);
  } catch (error) {
    logger.error("Error fetching posts for date range", error);
    // console.error(error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

//controller that fetches posts from the past seven days based on a given category
const postsForCategory = async (req, res) => {
  try {
    const { categories, start, end } = req.body; // Assuming categories, start, and end dates are passed in the request body

    // Validate the input
    if (!categories || categories.length === 0) {
      return res.status(400).json({ error: "Categories are required" });
    }

    let dateCondition = {};
    let errorMessage =
      "No posts found for the specified categories and date range.";
    if (start && end) {
      dateCondition = { [Op.between]: [start, end] };
      errorMessage =
        "No posts found for the specified categories in the selected date range.";
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      // console.log(thirtyDaysAgo, "thirty days ago");
      dateCondition = { [Op.gte]: thirtyDaysAgo };
      errorMessage =
        "No posts found for the specified categories within past 30 days.";
    }

    const posts = await db.Posts.findAll({
      where: {
        category: {
          [Op.in]: categories,
        },
        Date: dateCondition,
        approved: true,
      },
    });

    if (posts.length === 0) {
      return res.status(404).json({ error: errorMessage });
    }

    res.json(posts);
  } catch (error) {
    // console.error("Error fetching posts for categories and date range", error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch the user's profile data
    const userProfile = await db.users.findOne({
      where: { id: userId },
      attributes: ["name", "photo", "email", "organization", "category"], // Include desired profile attributes
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }
    // Fetch posts by user ID
    const userPosts = await db.Posts.findAll({
      where: {
        UserId: userId,
      },
      order: [["Date", "DESC"]], // Order posts by date in descending order
      include: [
        {
          model: Users,
          attributes: ["name", "photo"], // Include only the name attribute from the Users table
        },
      ],
    });

    // Check if posts exist
    if (userPosts.length === 0) {
      return res.status(200).json({
        user: userProfile,
        message: "No posts found for this user",
      });
    }
    // Combine user profile data with posts
    const response = {
      user: userProfile,
      posts: userPosts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Validate user ID
    if (!postId) {
      return res.status(400).json({ error: "No Id Provided " });
    }

    // Fetch the user's profile data
    const UserPost = await Posts.findAll({
      where: { id: postId },
      // Include desired profile attributes
    });

    if (!UserPost) {
      return res.status(404).json({ error: "No Post Found" });
    }

    // Check if posts exist
    if (UserPost.length === 0) {
      return res.status(200).json({
        message: "No posts found for this user",
      });
    }
    // Combine user profile data with posts
    const response = {
      posts: UserPost,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const reviewpostforuser = async (req, res) => {
  try {
    const { userId, postId } = req.params;

    // Validate user ID
    if (!userId || !postId) {
      return res
        .status(400)
        .json({ error: "User ID and Post ID are required" });
    }

    // Fetch the user's profile data
    const userProfile = await db.users.findOne({
      where: { id: userId },
      attributes: ["name", "photo", "email", "organization", "category"], // Include desired profile attributes
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }
    // Fetch posts by user ID
    const userPosts = await db.Posts.findAll({
      where: {
        UserId: userId,
        id: postId,
      },
      order: [["Date", "DESC"]], // Order posts by date in descending order
      include: [
        {
          model: Users,
          attributes: ["name", "photo"], // Include only the name attribute from the Users table
        },
      ],
    });

    // Check if posts exist
    if (userPosts.length === 0) {
      return res.status(200).json({
        user: userProfile,
        message: "No posts found for this user",
      });
    }
    // Combine user profile data with posts
    const response = {
      user: userProfile,
      posts: userPosts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLinkToSharePost = async (req, res) => {
  const encodedID = req.params.id;
  // console.log(encodedID, "encoded id");
  const postID = decodePostID(encodedID);
  // console.log(postID, "post id");

  try {
    const post = await Posts.findOne({
      where: {
        id: postID,
        approved: true,
      },
    });

    console.log("show post", post);
     // Parse the photos JSON string to an array
     const photos = JSON.parse(post.photos);
    
     // Use the first photo for the og:image tag
     const firstPhoto = photos[0] || '';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title</title>
  <!-- Open Graph meta tags -->
  <meta property="og:title" content="Community Care 247" />
  <meta property="og:description" content="Your app for recording your community service hours" />
  <meta property="og:image" content="https://cch247.com/api/image/${firstPhoto}" />
  <meta property="og:url" content="https://cch247.com/api/posts/${encodedID}" />
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="CC247" />
  <meta property="article:section" content="${post.category}" />
    </head>
    <body>
      <h1>Loading.. </h1>
      <script>
        window.location.href = "${process.env.URL}/posts/${postID}";
      </script>
    </body>
    </html>
  `;

    // Send the HTML response with meta tags
    res.send(htmlContent);
  } catch (error) {
    logger.error(error);
    console.log(error);
  }
};

const shareTestLink = async (req, res) => {
  const encodedID = req.params.id;
  // console.log(encodedID, "encoded id");
  const postID = decodePostID(encodedID);
  // console.log(postID, "post id");

  try {
    const post = await Posts.findOne({
      where: {
        id: postID,
        approved: true,
      },
    });

    console.log("show post", post);

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title</title>
  <!-- Open Graph meta tags -->
  <meta property="og:title" content="Community Care 247" />
  <meta property="og:description" content="Your app for recording your community service hours" />
  <meta property="og:image" content="https://cch247.com/api/image/${post.photos}" />
  <meta property="og:url" content="https://cch247.com/api/posts/${encodedID}" />
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="CC247" />
  <meta property="article:section" content="${post.category}" />
    </head>
    <body>
      <h1>Loading...</h1>
      <script>
        window.location.href = "${process.env.URL}/posts/${postID}";
      </script>
    </body>
    </html>
  `;

    // Send the HTML response with meta tags
    res.send(htmlContent);
  } catch (error) {
    logger.error(error);
    console.log(error);
  }
};

const visitorCount = async (req, res) => {
  const { page } = req.params;
  try {
    const log = await VisitorLogs.findOne({ where: { page: page } });
    if (log) {
      await log.update({ count: log.count + 1 });
    }

    res.status(200).json({ message: "visitor registered" });
  } catch (error) {
    logger.error(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const userData = req.body;
    const id = getUserIdFromToken(req);
    console.log("here is the data", userData);

    // Check if any required field is empty
    console.log("id ", id);
    if (!userData.name) {
      return res
        .status(400)
        .json({ field: "name", message: "Name is required" });
    }

    if (!userData.email) {
      return res
        .status(400)
        .json({ field: "email", message: "Email is required" });
    }

    // Handle photo upload if present
    let photoUrl;
    if (req.file) {
      photoUrl = req.file.filename;
    }

    // Fetch the current user
    const currentUser = await Users.findByPk(id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the email is being changed
    let emailChanged = false;
    if (currentUser.email !== userData.email) {
      emailChanged = true;

      // Check if a user with the new email already exists
      const existingUser = await Users.findOne({
        where: {
          email: userData.email,
          id: {
            [Op.ne]: id, // Exclude user with this ID
          },
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ field: "email", message: "Email already exists" });
      }
    }

    // Check if a user with the same mobile number already exists
    const existingMobileUser = await Users.findOne({
      where: {
        phone: userData.phone,
        id: {
          [Op.ne]: id, // Exclude user with this ID
        },
      },
    });

    if (existingMobileUser) {
      return res
        .status(400)
        .json({ field: "phone", message: "Mobile number already registered" });
    }

    // Ensure "Others" category is always present
    let selectedCategories = userData.selectedCategories;

    if (typeof selectedCategories === "string") {
      selectedCategories = JSON.parse(selectedCategories);
    }

    if (!selectedCategories) {
      return res.status(400).json({
        field: "category",
        message: "Choose at least one category",
      });
    }

    if (!Array.isArray(selectedCategories)) {
      selectedCategories = [selectedCategories];
    }

    if (selectedCategories.length == 0) {
      return res.status(400).json({
        field: "category",
        message: "Choose at least one category",
      });
    }

    if (!selectedCategories.includes("Others")) {
      selectedCategories.push("Others");
    }

    // Update user information in the database
    const updateData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      category: JSON.stringify(selectedCategories),
      organization: userData.organization,
      address: userData.address,
      photo: photoUrl || userData.photo,
    };

    // If email has changed, set verified to false
    if (emailChanged) {
      updateData.verified = false;
    }

    const updatedUser = await Users.update(updateData, {
      where: { id: id },
    });
    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (error) {
    logger.error("User update failed", error);
    return res.status(500).json({
      status: "error",
      message: "User update failed",
    });
  }
};

const getAllActivitiesByCategoriesUser = async (req, res) => {
  try {
    const id = getUserIdFromToken(req);

    if (!id) {
      return res.json({ message: "Invalid token " });
    }

    const { categories, start: startDate, end: endDate } = req.body;

    // Validate categories input
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Invalid categories provided" });
    }

    // Initialize date filter
    const dateFilter = {};

    // Validate and add startDate and endDate to dateFilter if provided
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid start date format" });
      }
      dateFilter[Op.gte] = start.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL format
      console.log("Start Date:", dateFilter[Op.gte]); // Debug log
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
      // Set end date to the end of the specified day
      end.setHours(23, 59, 59, 999);
      dateFilter[Op.lte] = end.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL format
      console.log("End Date:", dateFilter[Op.lte]); // Debug log
    }

    // Debug log the dateFilter
    console.log("Date Filter:", dateFilter);
    console.log(
      "Date full in where:",
      Object.getOwnPropertySymbols(dateFilter).length
    );

    // Group and count activities by category
    const activitiesByCategories = await Posts.findAll({
      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: {
        ...(Object.getOwnPropertySymbols(dateFilter).length
          ? { createdAt: dateFilter }
          : {}),
        category: {
          [Op.in]: categories,
        },
        UserId: id,
      },
      group: ["category"],
    });

    // Prepare result object
    const result = {};

    // Populate result object with category counts
    activitiesByCategories.forEach((item) => {
      const category = item.get("category");
      const count = item.get("count");
      result[category] = count;
    });

    res.json(result);
  } catch (error) {
    console.error(error); // Debug log
    res.status(500).json({ message: "Internal server error" });
  }
};

const postsForCategoryUser = async (req, res) => {
  try {
    const id = getUserIdFromToken(req);

    console.log("user id ", id);
    const { categories, start, end } = req.body; // Assuming categories, start, and end dates are passed in the request body

    // Validate the input
    if (!categories || categories.length === 0) {
      return res.status(400).json({ error: "Categories are required" });
    }

    let dateCondition = {};
    let errorMessage =
      "No posts found for the specified categories and date range.";
    if (start && end) {
      dateCondition = { [Op.between]: [start, end] };
      errorMessage =
        "No posts found for the specified categories in the selected date range.";
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      // console.log(thirtyDaysAgo, "thirty days ago");
      dateCondition = { [Op.gte]: thirtyDaysAgo };
      errorMessage =
        "No posts found for the specified categories within past 30 days.";
    }

    const posts = await db.Posts.findAll({
      where: {
        category: {
          [Op.in]: categories,
        },
        Date: dateCondition,
        UserId: id,
        // approved: true,
      },
    });

    if (posts.length === 0) {
      return res.status(404).json({ error: errorMessage });
    }

    res.json(posts);
  } catch (error) {
    // console.error("Error fetching posts for categories and date range", error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

const postsForDateRangeUser = async (req, res) => {
  try {
    const { start, end } = req.query;
    const id = getUserIdFromToken(req);

    // Validate the input dates

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "Both start and end dates are required." });
    }
    let dateCondition = {};
    let errorMessage =
      "No posts found for the specified categories and date range.";
    if (start && end) {
      // const startDate = new Date(start);
      // const endDate = new Date(end);
      // console.log(startDate, "start date");
      // console.log(endDate, "end date");
      dateCondition = { [Op.between]: [start, end] };
      errorMessage =
        "No posts found for the specified categories in the selected date range.";
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateCondition = { [Op.gte]: thirtyDaysAgo };
      errorMessage =
        "No posts found for the specified categories within past 30 days.";
    }

    // const posts = await db.Posts.findAll({
    //   where: {
    //     Date: {
    //       [db.Sequelize.Op.between]: [start, end],
    //     },
    //     approved : true
    //   },
    // });
    const posts = await db.Posts.findAll({
      where: {
        Date: dateCondition,
        approved: true,
        UserId: id,
      },
    });
    // console.log("ye hain selected range of date ke posts", posts)

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ error: "No posts found for the specified date range." });
    }

    res.json(posts);
  } catch (error) {
    logger.error("Error fetching posts for date range", error);
    // console.error(error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

const getOrgDetails = async (req, res) => {
  try {
    const { org } = req.params;

    const orgDetails = await Organizations.findAll({ where: { name: org } });
    res.json({ orgDetails });
  } catch (error) {
    logger.error(error);
  }
};

const submitFeedback = async (req, res) => {
  try {
    const name = req.body.name;
    const rating = req.body.rating;
    const id = req.body.activityId;
    if (rating > 2) {
      const result = await Posts.update(
        { endorsementCounter: 1, endorser_name: name },
        { where: { id: id } }
      );
      return res.json({ message: "success" });
    }

    return res.json({ message: "rating is less then 2" });
  } catch (error) {
    logger.error(error);
  }
};

const checkifAlreadyExist = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Build a dynamic query object
    let query = {};
    if (email) {
      query.email = email;
    }
    if (phone) {
      query.phone = phone;
    }

    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Please provide email or phone to check." });
    }

    // Check if the user with the email or phone already exists
    const userExists = await Users.findOne({ where: query });

    if (userExists) {
      return res
        .status(200)
        .json({ message: "User already exists.", exists: true });
    }

    return res
      .status(200)
      .json({ message: "User does not exist.", exists: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
module.exports = {
  output,
  varifybytoken,
  login,
  varifybytiken,
  profile,
  updateUserData,
  CreateActivity,
  AllDetails,
  Register,
  postsdata,
  fetchPostsInArea,
  endorsePost,
  GoogleLogin,
  verify,
  forgetpassword,
  verifyPin,
  UpdatePhoneNumber,
  updatePassword,
  resendVerification,
  TotalTimeSpent,
  verifyToken,
  getUsersWithMostPostsInYear,
  getUsersWithMostPostsInSixMonths,
  getUsersWithMostPostsInQuater,
  getUsersWithMostPostsInMonth,
  approveHours,
  rejectHours,
  adminAuthMiddleware,
  pendingApproval,
  createCategory,
  getCategories,
  getCategoriesAdmin,
  toggleCategory,
  createOrganization,
  getOrganizations,
  toggleOrganization,
  getOrganizationsAdmin,
  addApprover,
  fetchApprovers,
  updateApprover,
  deleteApprover,
  getUsers,
  deleteUser,
  postsForDateRange,
  postsForCategory,
  getPostsByUser,
  reviewpostforuser,
  LinkedInLogin,
  RegisterLinkedin,
  getPost,
  getLinkToSharePost,
  getAllPostedCategories,
  visitorCount,
  shareTestLink,
  updateUser,
  getAllActivitiesByCategoriesUser,
  postsForCategoryUser,
  postsForDateRangeUser,
  getOrgDetails,
  submitFeedback,
  checkifAlreadyExist,
  getOrganizationsUser,
};
