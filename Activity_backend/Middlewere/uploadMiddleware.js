const multer = require("multer");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/photos"); // Make sure this path exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "jfif"];
  const fileExtension = file.originalname.split(".").pop().toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Allowed image formats are JPG, JPEG, PNG, GIF, JFIF"), false);
  }
};

// Set up multer with the defined storage and file filter
const uploadMiddleWare = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploadMiddleWare;
