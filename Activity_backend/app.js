const express = require("express");
const app = express();
const path = require('path');

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'videos')));


const dotenv = require("dotenv");
dotenv.config();

app.get('/image/:image', (req, res) => {
    const image = req.params.image;
    // Determine the file path of the image
    const imagePath = path.join(__dirname, 'uploads/photos',image);
  
    // Send the image file
    res.sendFile(imagePath);

  });
// app.get('/api/image/:image', (req, res) => {
//     const image = req.params.image;
//     // Determine the file path of the image
//     const imagePath = path.join(__dirname, 'uploads/photos',image);
  
//     // Send the image file
//     res.sendFile(imagePath);

//   });


app.get('/video/:video', (req, res) => {
    const video = req.params.video;
    // Determine the file path of the image
    const videoPath = path.join(__dirname, 'uploads/videos',video);
  
    // Send the image file
    res.sendFile(videoPath);

  });
// app.get('/api/video/:video', (req, res) => {
//     const video = req.params.video;
//     // Determine the file path of the image
//     const videoPath = path.join(__dirname, 'uploads/videos',video);
  
//     // Send the image file
//     res.sendFile(videoPath);

//   });



// app.use("/api/activity",require('./routes/LoginRoutes'));
app.use("/activity",require('./routes/LoginRoutes'));


const constant = require("./config/constant");
const port = process.env.PORT || constant.PORT;
app.listen(port, console.log("app is running " + constant.PORT));


