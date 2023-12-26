var jwt = require("jsonwebtoken");
var config = require("../config/constant");
const bycrypt = require("bcrypt");
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
	let match = await bycrypt.compare(password, userpass);
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
	let hash = await bycrypt.hash(myPlaintextPassword, saltRounds);
	return hash;
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads");
		
	},
	filename: function (req, file, cb) {
		const uniqueSuffix =
			Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

const upload = multer({ storage: storage }).single("photo");

module.exports = {
	createToken,
	verifyPassword,
	formValidator,
	createHash,
	upload,
};
