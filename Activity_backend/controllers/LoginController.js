
const db = require("../models");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const config = require("../config/constant");
const mysql = require('mysql2/promise')
const jwt_decode = require('jwt-decode');
const jwtKey = 'g.comm'
const multer = require('multer');



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


const GoogleData = db.users;
const Users = db.users;
const Posts = db.Posts;



const jwt = require('jsonwebtoken');





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
    const { selectedCategories } = req.body;
    console.log('category Register',selectedCategories)

    
    const picture = req.file ? req.file.originalname : '';
    console.log('file',picture)
    const Category=selectedCategories

    // Create a new user instance and save it to the database
    const newUser = await Users.create({
      name: req.body.name, 
      email: userData.email,
      password: userData.password,
      photo: picture,
      category:Category
      // idCard:userData.idCard,
      

      // password: userData.password,
      
            
    });
    
    

    // You can add more error handling and validation as needed

    return res.status(201).json({
      status: 'success',
      message: 'Registration successful',

    });
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Registration failed',
    });
  
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log( "email ",req.body)
 
  try {
    // Find the user based on the provided email
    const user = await Users.findOne({ where: { email } });
    console.log(user)

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid  password.' });
    }


    const token = Jwt.sign({ userId: user.id }, jwtKey, { expiresIn: '1h' });
    console.log(token, "token")



    const userKey = {
      id: user.id,
      email: user.email,
      name: user.name
      // token:user.token
    };


    res.json({
      status: 'success',
      userKey: userKey,
      token: token
    });
    console.log(res, "status")





    // Successful login

  } catch (error) {
    console.log("error or exception", error)
    res.status(500).json({ error: 'An error occurred during login.' });

  }
};


const varifybytiken = async (req, res) => {
  const { userKey, token } = req.body;
  console.log("userKey", userKey);
  console.log("token", token);

  try {


    const verifytoken = Jwt.verify(token, jwtKey

    );
    console.log(verifytoken, 'veryfi')


    if (!verifytoken) {
      return res.status(401).json({ error: 'Invalid token ' });
    }
    else {

      res.json({
        status: 'success'

      });
    }






  } catch (error) {
    res.status(500).json({ error: error });
  }
};



// ...
const GoogleResponse = async (req, res) => {
  const { access_token, userInfo } = req.body;

  try {
    // Decode the credential JWT
    const decodedCredential = access_token.access_token;

    if (!decodedCredential) {
      return res.status(400).json({ message: 'Invalid credential' });
    }

    // Extract email and name from the decoded credential
    const userEmail = userInfo.email; // Move the declaration up

    // Find the user based on the provided email
    const user = await Users.findOne({ where: { email: userInfo.email } });
    console.log("user email", user);

    if (user) {
      const token = Jwt.sign({ userId: user.id }, jwtKey, { expiresIn: '1h' });
      return res.status(200).json({
        message: 'Success',
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
      picture: userInfo.picture,
    });

    const token = Jwt.sign({ userId: newUser.id }, jwtKey, { expiresIn: '1h' });
    console.log(token, "token");

    // Send a success response
    res.status(200).json({
      message: 'Success',
      name: userInfo.name,
      email: userEmail, // Use userEmail here
      token: token,
      user: newUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const Jwt = require('jsonwebtoken')


const varifybytoken = async (req, res) => {
  const { accessToken, name, id, clientId, Email, credential } = req.body;
  console.log("email", Email);
  console.log("token", credential);

  try {


    const verifytoken = Jwt.verify(credential, jwtKey

    );
    console.log(verifytoken, 'veryfi')


    if (!verifytoken) {
      return res.status(401).json({ error: 'Invalid token ' });
    }
    else {

      res.json({
        status: 'success'

      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};



const profile = async (req, res) => {
  try {
    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];

      try {
        const decodedToken = Jwt.verify(token, jwtKey);

        const userId = decodedToken.userId;

        const connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'activity'
        });

        const [rows] = await connection.execute(
          'SELECT `id`, `name`,`picture`, `email` FROM `users` WHERE id = ?',
          [userId]
        );


        connection.end();

        if (rows.length === 1) {
          const userData = {
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
            picture: rows[0].picture

          };

          res.json({
            status: 'success',
            userData: userData
          });
        } else {
          res.status(404).json({
            status: 'error',
            message: 'User not found'
          });
        }
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          res.json({
            status: 'error',
            message: 'Token has expired'
          });
        } else {
          console.error('Error decoding token:', error);
          res.status(401).send('Invalid token');
        }
      }
    } else {
      res.status(401).send('Authorization header missing');
    }
  } catch (error) {
    console.error('Error in profile endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request'
    });
  }
};






// const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' }); 

 
const CreateActivity = async (req, res) => { 
  try {
    const { selectedCategories } = req.body;
    const { Date } = req.body;
    console.log('cat',selectedCategories)

    const photo = req.file ? req.file.originalname : '';
    const Category=selectedCategories
     
    const file= req.body.photo
    // Create a new activity instance
    const newActivity = new Posts({ Category, photo,Date }); 

    // Save to the database
    await Posts.create({ Category, photo,Date});
    

    res.status(201).json({ message: 'Activity created successfully' });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 



const AllDetails = async (req, res) => {
  try {
    const all_posts = await db.Posts.findAll({
      attributes: [
      
      
        "Category",
        // [sequelize.col("userTable.name"), "name",],
      
      ],
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const postsdata = async (req, res) => {
  try {
    const id   = req.params.id;

    if (!id) {
      return res.json({ error: "User is not authorized" });
    }

    const userPosts = await db.posts.findAll({
      where: {
        id: id, 
        
      },
      
      order: [["InsertedAt", "DESC"]],
    });

    if (!userPosts || userPosts.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.status(201).json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};







module.exports = {
  GoogleResponse,
  varifybytoken,
  login,
  varifybytiken,
  profile,
  CreateActivity,
  AllDetails,
  Register,
  postsdata
};
