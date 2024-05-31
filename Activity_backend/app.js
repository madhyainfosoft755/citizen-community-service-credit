const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
const dotenv = require("dotenv");
const {User} = require('./models/LoginRouter')
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { googleId: profile.id } });

    if (!user) {
      user = await User.create({ googleId: profile.id, name: profile.displayName });
    }

    return done(null, user); 
  } catch (error) {
    return done(error, null);
  }
}

));

// Middleware for session management
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'videos')));



// app.get('/image/:image', (req, res) => {
//     const image = req.params.image;
//     // Determine the file path of the image
//     const imagePath = path.join(__dirname, 'uploads/photos',image);
  
//     // Send the image file
//     res.sendFile(imagePath);

//   });
app.get('/api/image/:image', (req, res) => {
    const image = req.params.image;
    // Determine the file path of the image
    const imagePath = path.join(__dirname, 'uploads/photos',image);
  
    // Send the image file
    res.sendFile(imagePath);

  });


// app.get('/video/:video', (req, res) => {
//     const video = req.params.video;
//     // Determine the file path of the image
//     const videoPath = path.join(__dirname, 'uploads/videos',video);
  
//     // Send the image file
//     res.sendFile(videoPath);

//   });
app.get('/api/video/:video', (req, res) => {
    const video = req.params.video;
    // Determine the file path of the image
    const videoPath = path.join(__dirname, 'uploads/videos',video);
  
    // Send the image file
    res.sendFile(videoPath);

  });

// app.use("/api", verifyToken)

app.use("/api/activity",require('./routes/LoginRoutes'));
// app.use("/activity",require('./routes/LoginRoutes'));


const constant = require("./config/constant");
const { verifyToken } = require("./controllers/LoginController");
const port = process.env.PORT || constant.PORT;
app.listen(port, console.log("app is running " + constant.PORT));


