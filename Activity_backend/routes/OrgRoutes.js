const express = require("express");
const {
  TestContoller,
  getTotalUsers,
  verifyToken,
  getTotalCategories,
  getTotalActivities,
  getTotalOrganisation,
  getTotalApprovedHours,
  getTotalRejectedHours,
  getTotalUnopenedHours,
  getAllUsers,
  getAllCategories,
  getAllOrganization,
  getAllActivities,
  approveActivity,
  rejectActivity,
  getAllActivitiesBy,
  enableCategory,
  disableCategory,
  enableOrganisation,
  disableOrganisation,
  getAllActivityById,
  getAllActivitiesByMonth,
  getApproveActivitiesByMonth,
  getRejectedActivitiesByMonth,
  getAllUsersByMonth,
  getAllCategoriesByStatus,
  getAllOrganizationByStatus,
  getAllApproversByStatus,
  getAllApprovers,
  enableApprover,
  disableApprover,
  addCategory,
  addOrganization,
  editCategory,
  editOrganization,
  editApprover,
  addApprover,
  getAllActivitiesByCategories,
  getRejectedActivitiesByCategories,
  getApprovedActivitiesByCategories,
  verifyUser,
  unVerifyUser,
  getAllEndorseActivities,
  getAllEndorseActivitiesBy,
  endorseActivity,
  getActivityByIdOpen,
} = require("../controllers/OrgController");
const extractToken = require("../Middlewere/Authentication");
const uploadMiddleWare = require("../Middlewere/uploadMiddleware");
const router = express.Router();

router.get("/test", extractToken, TestContoller);
router.get("/getTotalUser", extractToken, getTotalUsers);
router.get("/verifyToken", extractToken, verifyToken);
router.get("/getTotalCategories", extractToken, getTotalCategories);
router.get("/getTotalActivities", extractToken, getTotalActivities);
router.get("/getTotalOrganisation", extractToken, getTotalOrganisation);
router.get("/getTotalApprovedHours", extractToken, getTotalApprovedHours);
router.get("/getTotalRejectedHours", extractToken, getTotalRejectedHours);
router.get("/getTotalUnoppenedHours", extractToken, getTotalUnopenedHours);
router.get("/getAllUsers", extractToken, getAllUsers);
router.get("/getAllCategories", extractToken, getAllCategories);
router.get("/getAllOrganization", extractToken, getAllOrganization);
router.get("/getAllApprovers", extractToken, getAllApprovers);
router.get(
  "/getAllCategoriesByStatus/:status",
  extractToken,
  getAllCategoriesByStatus
);
router.get(
  "/getAllOrganizationByStatus/:status",
  extractToken,
  getAllOrganizationByStatus
);

router.get(
  "/getAllApproversByStatus/:status",
  extractToken,
  getAllApproversByStatus
);
router.get("/getAllActivities", extractToken, getAllEndorseActivities);
router.get("/getAllActivitiesByMonth", extractToken, getAllActivitiesByMonth);
router.get(
  "/getApprovedActivitiesByMonth",
  extractToken,
  getApproveActivitiesByMonth
);
router.get(
  "/getRejectedActivitiesByMonth",
  extractToken,
  getRejectedActivitiesByMonth
);
router.get("/getAllUsersByMonth", extractToken, getAllUsersByMonth);

router.get("/approve-activity/:id", extractToken, approveActivity);
router.get("/reject-activity/:id", extractToken, rejectActivity);
router.get("/enable-category/:id", extractToken, enableCategory);
router.get("/disable-category/:id", extractToken, disableCategory);
router.get("/enable-organization/:id", extractToken, enableOrganisation);
router.get("/disable-organization/:id", extractToken, disableOrganisation);
router.get("/enable-approvers/:id", extractToken, enableApprover);
router.get("/disable-approvers/:id", extractToken, disableApprover);
router.get("/unverify-user/:id", extractToken, unVerifyUser);
router.get("/verify-user/:id", extractToken, verifyUser);
router.post("/getAllActivitiesBy", extractToken, getAllEndorseActivitiesBy);
router.post(
  "/getAllActivitiesByForEndorsement",
  extractToken,
  getAllActivitiesBy
);
router.get("/getAllActivitiesForEndorsement", extractToken, getAllActivities);
router.get("/endorse-activity/:id", extractToken, endorseActivity);

router.get("/getActivityById/:id", extractToken, getAllActivityById);
router.get("/getActivityByIdOpen/:id", getActivityByIdOpen);
router.post(
  "/getAllActivitiesByCategories",
  extractToken,
  getAllActivitiesByCategories
);

router.post(
  "/getApprovedActivitiesByCategories",
  extractToken,
  getApprovedActivitiesByCategories
);

router.post(
  "/getRejectedActivitiesByCategories",
  extractToken,
  getRejectedActivitiesByCategories
);

router.post("/addCategory", extractToken, addCategory);
router.post("/editCategory", extractToken, editCategory);
router.post(
  "/addOrganization",
  extractToken,
  uploadMiddleWare.single("logo"),
  addOrganization
);
router.post(
  "/editOrganization",
  extractToken,
  uploadMiddleWare.single("logo"),
  editOrganization
);
router.post("/addApprover", extractToken, addApprover);
router.post("/editApprover", extractToken, editApprover);
module.exports = router;
