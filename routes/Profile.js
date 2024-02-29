const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/auth");

const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
} = require("../controller/Profile");

//**********************************   Profile Routes     *********************************** */

//delete User Account

router.delete("/deleteProfile",auth,deleteAccount);
router.put("/updateProfile",auth,updateProfile);
router.get("/getUserDetails",auth,getAllUserDetails);
//get Enrolled course

router.get("/getEnrolledCourses",auth,getEnrolledCourses);
router.put("/updateDisplayPicture",auth,updateDisplayPicture);

module.exports = router //for export the routers

