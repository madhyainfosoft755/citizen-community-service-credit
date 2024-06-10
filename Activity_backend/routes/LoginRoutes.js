const express = require("express");
const router = express.Router();

const {
  output,
  varifybytoken,
  varifybytiken,
  login,
  profile,
  updateUserData,
  CreateActivity,
  AllDetails,
  Register,
  postsdata,
  fetchPostsInArea,
  endorsePost,
  GoogleLogin,
  verify,
  forgetpassword,
  verifyPin,
  UpdatePhoneNumber,
  updatePassword,
  resendVerification,
  TotalTimeSpent,
  verifyToken,
  getUsersWithMostPostsInYear,
  getUsersWithMostPostsInSixMonths,
  getUsersWithMostPostsInMonth,
  approveHours,
  pendingApproval,
  createCategory,
  getCategories,
  getCategoriesAdmin,
  toggleCategory,
  createOrganization,
  getOrganizations,
  toggleOrganization,
  getOrganizationsAdmin,
  addApprover,
  fetchApprovers,
  updateApprover,
  deleteApprover,
  getUsers,
  deleteUser,
  postsForDateRange,
  postsForCategory,
  getPostsByUser

} = require("../controllers/LoginController");
const { upload } = require("../utils/util");
// Express route 
router.get("/output", output);  
router.get('/getPostsByUser/:userId', getPostsByUser);
router.get("/getUsers",getUsers)
router.delete("/deleteUser/:id",deleteUser )
router.put("/updateApprover/:id",updateApprover )
router.delete("/deleteApprover/:id",deleteApprover )
router.get("/fetchApprovers", fetchApprovers)
router.post("/addApprover",addApprover)
router.get("/pendingApproval", pendingApproval);  
router.get("/getUsersWithMostPostsInYear", getUsersWithMostPostsInYear)
router.get("/getUsersWithMostPostsInSixMonths", getUsersWithMostPostsInSixMonths)
router.get("/getUsersWithMostPostsInMonth", getUsersWithMostPostsInMonth)
router.put("/approveHours/:postId", approveHours)
router.post("/createCategory", createCategory)
router.get("/getCategories", getCategories)
router.get("/getCategoriesAdmin", getCategoriesAdmin)
router.put("/toggleCategory/:id", toggleCategory)
router.post("/createOrganization", createOrganization)
router.get("/getOrganizations", getOrganizations)
router.get("/getOrganizationsAdmin", getOrganizationsAdmin)
router.put("/toggleOrganization/:id", toggleOrganization)
router.post("/resendVerification", resendVerification)
router.post("/UpdatePhoneNumber",UpdatePhoneNumber)
router.post("/updatePassword",updatePassword)
router.post("/forgetpassword",forgetpassword)
router.post("/verifyPin",verifyPin)
router.get("/verify/:token", verify);
router.post('/GoogleLogin',upload, GoogleLogin);
router.get("/varifybytoken", varifybytoken);
router.post("/login", login);
router.post("/varifybytiken", varifybytiken);
router.get("/profile",verifyToken, profile);
router.post("/profile", profile);
router.post("/updateUserData", updateUserData);
router.get("/AllDetails/:id", AllDetails);
router.post("/AllDetails/:id", AllDetails);
router.get("/postsdata/:id", postsdata);
router.post("/postsdata/:id", postsdata);
router.get("/postsForDateRange",postsForDateRange);
router.post("/postsForCategory",postsForCategory);
router.get("/CreateActivity", upload, CreateActivity);
router.post("/CreateActivity", upload, CreateActivity);
router.post("/Register", upload, Register);
router.post("/fetchPostsInArea", fetchPostsInArea);
router.post("/endorsePost/:id", endorsePost);
router.post("/TotalTimeSpent/:id", TotalTimeSpent);

module.exports = router;
