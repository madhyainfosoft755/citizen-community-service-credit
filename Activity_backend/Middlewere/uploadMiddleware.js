const multer = require("multer");
const path = require("path");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Saari files ek hi folder mein save hongi
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".jfif"];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Allowed image formats are JPG, JPEG, PNG, GIF, JFIF"), false);
  }
};

// Set up multer with the defined storage and file filter
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

// Export the middleware directly
module.exports = upload;