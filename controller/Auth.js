const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {passwordUpdate} = require("../mail/template/passwordUpdate");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
require("dotenv").config();



//sendOTP
exports.sendOTP = async (req, res) => {

    try {
        //fetch email from request ki body

        const { email } = req.body;

        //check if user already present | db men search krke

        const checkUserPresent = await User.findOne({ email });

        //if User already exist , then return a response

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already registered',

            })
        }

        //generate OTP

        // 6 is length and not upper lower and special char allowed 
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP Generator ->", otp);

        //check OTP unique or not
        let result = await OTP.findOne({ otp: otp }); //ye hmara otp vale db men check krega jo ki 5 min men store hai taki same otp send n ho
        
        //this is the brute force we can use a function for unique otp
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            })
            result = await OTP.findOne({ otp: otp });
        }
        //for otp entry in db

        const otpPayload = { email, otp };

        //create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpPayload);

        //return response succesfully

        res.status(200).json({
            success: true,
            message: "OTP Send Succesfully",
            otp,

        })


    }
    catch (error) {

        console.log("Error in otp creation", error);
        return res.status(500).json({
            success: false,
            message: error.message,

        })

    }



};


//SignUp

exports.signUp = async (req, res) => {

    try {
        //data fetch from request ki body

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;



        //validate krlo
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",

            })
        }


        //2 password match krlo
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password not match, try again",

            })
        }


        //check user already exist or not

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist",

            });
        }

        //find most recent otp store or not
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);
        //hm ->| jo bhi email aayi hai uske correspondig recent otp ko nikala or us otp se check krva denge
        //is sirf find men sara data aa jayega
        //validate OTP
        if (recentOtp.length === 0) {
            //OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not Found"

            })

        }//agr otp sahi nhi hai
        else if (otp !== recentOtp[0].otp) {
            //Invalid otp
            return res.status(400).json({
                success: false,
                message: "Invalid Otp",

            });
        }

        //Hash Password

        const hashedPassword = await bcrypt.hash(password, 10);


        //entry create in DB --->
        //hmko additional details ke liye profile details chahiye hogi

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,

        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType:accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })


    //return response

    return res.status(200).json({
        success:true,
        message:'User is registered Succesfully',
        user,
    })
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User can not be registered, Please try again",

        })

    }

}


//Login

exports.login = async(req,res) =>{

    try{
        //get data from req body

        const {email,password} = req.body;

        //validation data
        if(!email || !password)
        {
            return res.status(403).json({
                success:false,
                message:'All Fields are required, fill all the fields',

            });
        }
        //user check exist or not

        const user = await User.findOne({email}).populate("additionalDetails");//without populate also work because we need only email

        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:" User is not registered please signUp First",
            })
        }

        //password match

        //using bcrypt compare function we match the password

        if(await bcrypt.compare(password,user.password))//for comare password beaccause we use bcrypt
        {
            //agr password match to token v cookie send

            //we creating payload
            const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);


            //now we generate the token

           
            user.token = token; //for store the token in db
            user.password = undefined;

        

    
        //create cookie and send response
        
        const options = {
            expires: new Date(Date.now() + 3*36*60*60*1000),//for 3 days
            httpOnly:true,
        }

        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in succesfully",


        })
    }
    else{
        return res.status(401).json({
            success:false,
            message:"Password is incorrect",
        })
    }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, Please try again',

        });


    }



}


//changePassword

exports.changePassword = async (req,res) =>{
    //get data from request body
    //get old password ,new password , confirm new password
    //validation

    //update password in DB
    //send mail - password updated

    //return response


}



