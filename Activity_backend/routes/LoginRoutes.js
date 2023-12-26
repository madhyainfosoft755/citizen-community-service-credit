const express = require("express");



// Apply Multer middleware


const {

    GoogleResponse,
    varifybytoken,
  varifybytiken,
  login,
  profile,
  CreateActivity,
  AllDetails,
  Register,
  postsdata







  
  


} = require("../controllers/LoginController");
const { upload } = require("../utils/util");
// const { uploads } = require("../utils/util");
const router = express.Router();
router.post('/GoogleResponse',GoogleResponse)
router.get('/varifybytoken',varifybytoken)
router.post('/login',login),
router.post('/varifybytiken',varifybytiken)
router.get('/profile',profile)  
router.get("/AllDetails",AllDetails)
router.get("/postsdata/:id",postsdata)


// router.post('/CreateActivity', upload, CreateActivity);
// Express route
	upload,
router.post('/CreateActivity',upload,CreateActivity);
router.post('/Register',upload,Register);









  

module.exports = router;
