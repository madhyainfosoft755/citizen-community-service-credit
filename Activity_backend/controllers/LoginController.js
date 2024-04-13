const db = require("../models");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const config = require("../config/constant");
const mysql = require("mysql2/promise");
const jwt_decode = require("jwt-decode");
const jwtKey = "g.comm";
const multer = require("multer");
const GoogleData = db.users;
const Users = db.users;
const Posts = db.Posts;
const Endorsement = db.Endorsement;
const Jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { logger } = require("../utils/util");

const dotenv = require("dotenv");
dotenv.config();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Update with your desired folder path
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const sequelize = new Sequelize(config.DB, config.USER_DB, config.PASSWORD_DB, {
  host: "localhost",
  dialect: "mysql",
  pool: { min: 0, max: 10, idle: 10000 },
});

// const User = sequelize.define("users", {

//   name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   // email: {
//   //   type: DataTypes.STRING,
//   //   allowNull: true,
//   //   unique: true,
//   // },
//   // password: {
//   //   type: DataTypes.STRING,
//   //   allowNull: true,
//   // },
//   // Jwt: {
//   //   type: DataTypes.STRING,
//   //   allowNull: true,
//   // },
//   Jwt: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },

// });

// Define the association between User and Post
// User.hasMany(db.posts, { foreignKey: 'User', as: 'userTable' });
// db.posts.belongsTo(User, { foreignKey: 'User', as: 'userTable'});

// const mysql = require('mysql2/promise');

// ths is Register Api

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
      // Add other fields as needed
    });

    // You can add more error handling and validation as needed

    return res.status(201).json({
      status: "success",
      message: "Registration successful",
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

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("email ", req.body);

  try {
    // Find the user based on the provided email
    const user = await Users.findOne({ where: { email } });
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid  password." });
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

const GoogleResponse = async (req, res) => {
  const { access_token, userInfo } = req.body;

  try {
    // Decode the credential JWT
    const decodedCredential = access_token.access_token;

    if (!decodedCredential) {
      return res.status(400).json({ message: "Invalid credential" });
    }

    // Extract email and name from the decoded credential
    const userEmail = userInfo.email; // Move the declaration up

    // Find the user based on the provided email
    const user = await Users.findOne({ where: { email: userInfo.email } });
    console.log("user email", user);

    if (user) {
      const token = Jwt.sign({ userId: user.id }, jwtKey, { expiresIn: "1h" });
      return res.status(200).json({
        message: "Success",
        name: userInfo.name,
        email: userEmail, // Use userEmail here
        token: token,
        user: user.id,
      });
    }

    // Create a new user if not found
    const newUser = await GoogleData.create({
      access_token: access_token.access_token,
      name: userInfo.name,
      email: userInfo.email,
      photo: userInfo.photo,
    });

    const token = Jwt.sign({ userId: newUser.id }, jwtKey, { expiresIn: "1h" });
    console.log(token, "token");

    // Send a success response
    res.status(200).json({
      message: "Success",
      name: userInfo.name,
      email: userEmail, // Use userEmail here
      token: token,
      user: newUser.id,
    });
  } catch (error) {
    logger.error("here is the error", error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

// const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' });

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
  GoogleResponse,
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
};
