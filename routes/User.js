const express= require("express");
const router = express.Router();

const{
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controller/Auth");

const {
    resetPasswordToken,
    resetPassword,
} = require("../controller/ResetPassword");

const {auth} =require("../middlewares/auth");

//Routes for login signUp and Authentication

//*************************Authentication Routes*********************************** */

//Route for user login
router.post("/login",login);

//routes for signUp
router.post("/signup",signUp);

//routes for sending email to the user's email
router.post("/sendotp",sendOTP);

//Route for changing the password
router.post("/changepassword",auth,changePassword);


//***********************Reset Password************************************** */
  

//route for generating a reset password token
router.post("/reset-password-token",resetPasswordToken);

//route for reseting password after verification
router.post("/reset-password",resetPassword);

//Export  the router for use in main application
module.exports = router 

