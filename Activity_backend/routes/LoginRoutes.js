const express = require("express");
const router = express.Router();

const {
  GoogleResponse,
  varifybytoken,
  varifybytiken,
  login,
  profile,
  updateUserData, 
  CreateActivity,
  AllDetails,
  Register,
  postsdata,
  getNearbyPosts,
} = require("../controllers/LoginController");
const { upload } = require("../utils/util");
// const { uploads } = require("../utils/util");
// Express route
router.post("/GoogleResponse", GoogleResponse);
router.get("/varifybytoken", varifybytoken);
router.post("/login", login);
router.post("/varifybytiken", varifybytiken);
router.get("/profile", profile);
router.post("/profile", profile);
// Assuming you have an Express app instance called 'app'
router.post('/updateUserData', updateUserData);

router.get("/AllDetails/:id", AllDetails);
router.post("/AllDetails/:id", AllDetails);
router.get("/postsdata/:id", postsdata);
router.post("/postsdata/:id", postsdata);
// router.post('/CreateActivity', upload, CreateActivity);
router.get("/CreateActivity", upload, CreateActivity);
router.post("/CreateActivity", upload, CreateActivity);
router.post("/Register", upload, Register);

// Route to fetch nearby posts
router.post("/nearbyposts", getNearbyPosts);

module.exports = router;
