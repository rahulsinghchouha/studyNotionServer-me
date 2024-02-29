const Razorpay = require("razorpay");

require("dotenv").config();
//her we sending the instance (object)
exports.instance = new Razorpay({

    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,

})