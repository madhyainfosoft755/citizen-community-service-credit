const db = require("../models");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const config = require("../config/constant");
const mysql = require("mysql2/promise");
const jwt_decode = require("jwt-decode");
const jwtKey = "g.comm";
const multer = require("multer");
const GoogleData = db.users;
const Users = db.users;
const axios = require('axios')
const Posts = db.Posts;
const Endorsement = db.Endorsement;
const Jwt = require("jsonwebtoken");
const { logger } = require("../utils/util");
const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = require('../config/constant');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const nodemailer = require("nodemailer");
const randomstring = require('randomstring'); 
const crypto = require('crypto'); // For generating a random token
const dotenv = require("dotenv");
dotenv.config();




// function to check the server is running or not by making a request to this api
const output =async (req, res)=> {
  try {
    return res.json("abcd");
  } catch (error) {
    logger.error("here is the error from output", error);
    console.error('Failed to fetch user profile:',error);
    throw error;
  }
}

// function to get the google user details
const  getUserProfile = async (accessToken)=> {
  try {
    const response = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Extract user profile from response data
    const userProfile = response.data;
    // console.log("this is users profile data", userProfile)
    return userProfile;
  } catch (error) {
    console.error('Failed to fetch user profile:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to generate a random alphanumeric password of a specified length
const generateRandomPassword = (length) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

// Example usage:
const passwordLength = 10;
const generatedPassword = generateRandomPassword(passwordLength);
console.log('Generated Password:', generatedPassword);


const GoogleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'ID token is missing' });
  }

  try {
    const userProfile = await getUserProfile(token);
    console.log("ye rha user ka profile data", userProfile)

    // Check if user exists
    let user = await Users.findOne({ where: { email: userProfile.email } });


    if (!user) {
      // Create new user if not found
      user = await Users.create({
        name: userProfile.name,
        email: userProfile.email,
        // phone: '', // Add phone if needed
        password: generatedPassword, // Add password if needed
        photo: userProfile.picture, // Assuming you store the profile picture
        category: '', // Add category if needed
        googleId: userProfile.id
      });
    }

    // Generate JWT token for the user
    // const jwtToken = Jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const jwtToken = Jwt.sign({ userId: user.id }, jwtKey, { expiresIn: "1h"});

    console.log("lo data le lo",user)

    res.status(200).set('Authorization', `Bearer ${jwtToken}`).json({ token: jwtToken,  user: userProfile, redirectTo: '/create' });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sequelize = new Sequelize(config.DB, config.USER_DB, config.PASSWORD_DB, {
  host: "localhost",
  dialect: "mysql",
  pool: { min: 0, max: 10, idle: 10000 },
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
      user: "vaibhavkurmi786@gmail.com",
      pass: "kakparbgukhobhwb",
  },
});

// Function to send login confirmation email
const sendLoginConfirmationEmail = async (email, token) => {
  try {
    // Send email using nodemailer transporter
    await transporter.sendMail({
      from: 'vaibhavkurmi786@gmail.com',
      to: email,
      subject: 'Confirm Login',
      html: `<p>Please click <a href="http://ccsc.helpersin.com/login/${token}">here</a> to confirm your login.</p>`,
    });
  } catch (error) {
    console.error("Error sending login confirmation email:", error);
    throw new Error("Failed to send login confirmation email.");
  }
};


// this is Register Api
const Register = async (req, res) => {
  try {
    
    const userData = req.body;
    console.log("here is he data", userData);

     // Check if user with the same email already exists
     const existingUser = await Users.findOne({where:{ email: userData.email }});
     console.log("this is the existing user",existingUser)
     if (existingUser) {

       return res.status(400).json({ message: "Email already exists" });
     }
     
 
    // Check if user with the same mobile number already exists
    const existingMobileUser = await Users.findOne({where:{ phone: userData.phone }});
    if (existingMobileUser) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Send verification email
    await transporter.sendMail({
      from: 'your-email@example.com',
      to: userData.email,
      subject: 'Verify your email',
      html: `<p>Please click <a href="http://localhost:3000/verify/${verificationToken}">here</a> to verify your email address.</p>`,
    });
   
    const { selectedCategories } = req.body;
    console.log("category Register", selectedCategories);

    // Check if files were uploaded
    const photos =
      req.files && req.files.photo
        ? req.files.photo.map((file) => file.filename)
        : [];
    console.log("this is the requested data", req.files);

    const Category = selectedCategories;

    const photos_ = photos.reduce(
      (accumulator, currentValue) => accumulator + "," + currentValue
    );
    console.log("phots", photos_);
    // Create a new user instance and save it to the database
    const newUser = await Users.create({
      name: req.body.name,
      email: userData.email,
      password: userData.password,
      phone:userData.phone,
      photo: photos_,
      category: Category,
      verificationToken: verificationToken, // Store verification token in the database
      // Add other fields as needed
    });

    // You can add more error handling and validation as needed

    return res.status(201).json({
      status: "success",
      message: "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    logger.error("here is the error", error);
    console.error("Registration failed:", error);
    return res.status(500).json({
      status: "error",
      message: "Registration failed",
    });
  }
};

const verify = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("this is token",token)
    
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
    logger.error("here is the error", error);
    console.error("Email verification failed:", error);
    return res.status(500).json({ message: "Email verification failed" });
  }
};


const forgetpassword = async(req,res)=>{
  const { email } = req.body;
  // console.log("this is the email",email)
  
  // Check if email exists in the database
  const user = await Users.findOne({where:{ email }});
  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }
  
  // Generate 6-digit PIN
  const pin = randomstring.generate({ length: 6, charset: 'numeric' });
  console.log("*-*-this is the generated pin*-*-", pin)

  // Update user's resetPin field with the generated PIN
  user.resetPin = pin;
  await user.save();


  // Send PIN to the user's email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vaibhavkurmi786@gmail.com',
      pass: 'kakparbgukhobhwb'
    }
  });

  const mailOptions = {
    from: 'vaibhavkurmi786@gmail.com',
    to: email,
    subject: 'Reset Password PIN',
    text: `Your PIN for resetting the password is: ${pin}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending PIN email' });
    } else {
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'PIN sent to your email' });
    }
  });
}


const verifyPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    console.log("ye hian email aur pin", email , pin)

    // Find user by email
    const user = await Users.findOne({where:{ email }});
    console.log("***ye hai user ka data***", user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the entered PIN matches the stored PIN
    if (pin !== user.resetPin) {
      return res.status(400).json({ message: 'Invalid PIN' });
    }
    user.resetPin = null;
    return res.status(200).json({ message: 'PIN verified successfully' });
  } catch (error) {
    logger.error("Here is the error", error);
    console.error("PIN verification failed:", error);
    return res.status(500).json({
      status: "error",
      message: "PIN verification failed",
    });
  }
};

const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find user by email
    const user = await Users.findOne({where:{ email }});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the entered PIN matches the stored PIN
    // if (pin !== user.resetPin) {
    //   return res.status(400).json({ message: 'Invalid PIN' });
    // }

    // Update user's password and clear resetPin
    user.password = newPassword;
    // user.resetPin = null; // Clear the resetPin after successful password reset

    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("email ", req.body);

  try {
    // Find the user based on the provided email
    const user = await Users.findOne({ where: { email } });
    console.log(user);


     // Check if the password matches
     if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid  password." });
    }
    
     // Check if the user is verified
     if (!user.verified) {
      return res.status(401).json({ error: "Email is not verified. Please verify your email." });
    } 

    const token = Jwt.sign({ userId: user.id }, jwtKey, {
      expiresIn: "1h",
    });
    console.log(token, "token");

    const userKey = {
      id: user.id,
      email: user.email,
      name: user.name,
      // token:user.token
    };

    if (user.email === 'info@mistpl.com') { // Check if the user is an admin
      res.json({
          status: "success",
          userKey: userKey,
          token: token,
          redirectTo: "/admin", // Redirect admin to "/admin" route
      });
  } else {
      res.json({
          status: "success",
          userKey: userKey,
          token: token,
          redirectTo: "/create", // Redirect normal users to "/create" route
      });
    }
    // Successful login
  } catch (error) {
    logger.error("here is the error", error);
    console.log("error or exception", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

const resendVerification =async (req, res)=>{
  try {
    const { email } = req.body;
    console.log("this is the email id recieved", email)

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
      from: "your-email@example.com",
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
}

const varifybytiken = async (req, res) => {
  const { userKey, token } = req.body;
  console.log("userKey", userKey);
  console.log("token", token);

  try {
    const verifytoken = Jwt.verify(token, jwtKey);

    if (!verifytoken) {
      return res.status(401).json({ error: "Invalid token " });
    }

    // Check if the user is an admin
    const { isAdmin } = verifytoken;
    res.json({
      status: "success",
      isAdmin
    });
  } catch (error) {
    logger.error("Error verifying token:", error);
    res.status(500).json({ error: "An error occurred while verifying token." });
  }
};


const varifybytoken = async (req, res) => {
  const { accessToken, name, id, clientId, Email, credential } = req.body;
  console.log("email", Email);
  console.log("token", credential);

  try {
    const verifytoken = Jwt.verify(credential, jwtKey);
    console.log(verifytoken, "veryfi");

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

const profile = async (req, res) => {
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
          "SELECT `id`, `name`,`photo`, `email` FROM `users` WHERE id = ?",
          [userId]
        );

        connection.end();

        if (rows.length === 1) {
          const userData = {
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
            photo: rows[0].photo,
            totalTime: rows[0].totalTime, // Include totalTime from the database
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
        if (error.name === "TokenExpiredError") {
          res.json({
            status: "error",
            message: "Token has expired",
          });
        } else {
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
    const {
      selectedCategories,
      Date,
      fromTime,
      toTime,
      userId,
      latitude,
      longitude,
    } = req.body;

    console.log("categories", selectedCategories);

    // Extract latitude and longitude from location object
    //  const { latitude, longitude } = location;

    // Check if files were uploaded
    const photos =
      req.files && req.files.photo
        ? req.files.photo.reduce((acc, file) => {
            // acc.push(file.filename);
            return acc + file.filename;
          }, [])
        : [];
    const videos =
      req.files && req.files.video
        ? req.files.video.reduce((acc, file) => {
            // acc.push(file.filename);
            return acc + file.filename;
          }, [])
        : [];

    const category = selectedCategories;

    // Create a new activity instance
    // const newActivity = new Posts({ category, photos, videos, Date });

    const calculateTotalTime = (fromTime, toTime) => {
      const [fromHour, fromMinute] = fromTime.split(":").map(Number);
      const [toHour, toMinute] = toTime.split(":").map(Number);

      const totalMinutes =
        toHour * 60 + toMinute - (fromHour * 60 + fromMinute);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      console.log(`${minutes}:${hours}`);
      // const totalTimeDate = new Date(0);
      // console.log("this is the total time",totalTimeDate)
      // totalTimeDate.setUTCHours(hours);
      // totalTimeDate.setUTCMinutes(minutes);

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

    // Save to the database
    await Posts.create({
      category,
      photos,
      videos,
      Date,
      totalTime,
      latitude,
      longitude,
      // location: JSON.stringify({ latitude, longitude }), // Store as JSON string in the database
      UserId: userId,
    });

    res.status(201).json({ message: "Activity created successfully" });
  } catch (error) {
    logger.error("here is the error", error);
    console.error("Error creating activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const AllDetails = async (req, res) => {
  try {
    const all_posts = await db.Posts.findAll({
      attributes: [
        "UserId",
        "Category",
        "totalTime",

        // [sequelize.col("userTable.name"), "name",],
      ],
      where: { UserId: req.params.id },
      // include: [
      //   {
      //     // model: db.users,
      //     attributes: [],
      //     as: 'userTable',
      //   },
      // ],
      // order: [["InsertedAt", "DESC"]],
    });

    res.status(200).json(all_posts);
  } catch (error) {
    logger.error("here is the error", error);
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const postsdata = async (req, res) => {
  try {
    const userId = req.params.id;
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
    const distanceKm = 50;

    const latRadians = latitude * (Math.PI / 180);
    // const lonRadians = longitude * (Math.PI / 180);

    const latDelta = distanceKm / earthRadiusKm;
    const lonDelta = Math.asin(Math.sin(latDelta) / Math.cos(latRadians));

    const minLat = latitude - latDelta * (180 / Math.PI);
    const maxLat = latitude + latDelta * (180 / Math.PI);
    const minLon = longitude - lonDelta * (180 / Math.PI);
    const maxLon = longitude + lonDelta * (180 / Math.PI);
    console.log("this is minLat", minLat);
    console.log("this is minLon", minLon);
    console.log("this is maxLat", maxLat);
    console.log("this is maxLon", maxLon);
    console.log(userId);
    // Fetch posts from all other users within the calculated area
    let postsInArea = await db.Posts.findAll({
      where: {
        UserId: { [Op.ne]: userId }, // Exclude posts from the logged-in user
        latitude: { [Op.between]: [minLat, maxLat] },
        longitude: { [Op.between]: [minLon, maxLon] },
        endorsementCounter: { [Op.lt]: 3 },
      },

      include: [
        {
          model: Users,
          attributes: ["name"], // Only fetch the 'username' attribute from the User model
        },
      ],
    });
    console.log("all post from the area", postsInArea);

    // If a username search query is provided, filter posts by username
    if (username) {
      postsInArea = postsInArea.filter(
        (post) => post.User && post.User.name === username
      );
    }

    res.json(postsInArea);
  } catch (error) {
    logger.error("Error fetching posts in area:", error);
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
  updatePassword,
  resendVerification
};
