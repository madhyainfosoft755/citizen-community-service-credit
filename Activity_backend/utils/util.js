var jwt = require("jsonwebtoken");
var config = require("../config/constant");
const bcrypt = require("bcrypt");
const { check } = require("express-validator");
const multer = require("multer");
const { diskStorage } = require("multer");

const createToken = (user) => {
	var token = jwt.sign({ sub: user.email }, config.JWT_SECRET, {
		expiresIn: 172800, // expires in 24 hours
	});
	return token;
};

const verifyPassword = async (userpass, password) => {
	let match = await bcrypt.compare(password, userpass);
	if (match) {
		return true;
	} else {
		return false;
	}
};

const formValidator = [
	check("email").trim().isEmail().withMessage("must be a valid email"),
	check("password")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("must be between 4 to 20 characters"),
	check("cpassword")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("must be between 4 to 20 characters"),
	check("name").not().isEmpty(),
	check("mobile").not().isEmpty().isLength({ min: 10 }),
	check("username").not().isEmpty(),
	check("role").not().isEmpty(),
	check("status").not().isEmpty(),
];

const createHash = async (myPlaintextPassword) => {
	saltRounds = 5;
	let hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
	return hash;
};

// const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine whether the file is a photo or a video
    const isPhoto = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    // Define subdirectories for photos and videos
    const photoDestination = "uploads/photos";
    const videoDestination = "uploads/videos";

    // Set the destination based on the file type
    if (isPhoto) {
      cb(null, photoDestination);
    } else if (isVideo) {
      cb(null, videoDestination);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Determine the file extension based on the mimetype
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Generate a unique filename for both photos and videos
    const uniqueFilename = file.fieldname + "-" + uniqueSuffix + fileExtension;

    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage }).fields([
	{ name: 'photo', maxCount: 10 },  // maxCount is the maximum number of files
	{ name: 'video', maxCount: 10 },
  ]);

module.exports = upload;


module.exports = {
	createToken,
	verifyPassword,
	formValidator,
	createHash,
	upload,
};
