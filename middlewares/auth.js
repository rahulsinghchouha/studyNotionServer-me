const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");



//auth
// we need to practise on this
exports.auth = async (req, res, next) => {
    try {
        //extract token we have three ways

        const token = req.cookies.token || req.body.token ||
            req.header("Authorisation").replace("Bearer ", "");

        //if token missing then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            })
        }

        //verify token using secret
        try {
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode; //isi se hm har baar hmari di nikal payenge


        } catch (err) {
            //verification issue
            return res.status(401).json({
                success: false,
                message: "token is invalid",
            })


        }
        next();


    } catch (err) {

        console.log(err)
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",

        })

    }

}

//isStudent

exports.isStudent = async (req,res,next) =>{

    try{
        if(req.user.accountType !== "Student")
        {
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Student only"
    

            })
        }
        next();

    }catch(error)
    {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User Role can not be verify",

        })
    }


}


//isInstructor

exports.isInstructor = async (req,res,next) =>{

    try{
        if(req.user.accountType !== "Instructor")
        {
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only"
    

            })
        }
        next();

    }catch(error)
    {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User Role can not be verify in Instructor",

        })
    }


}


//isAdmin
exports.isAdmin = async (req,res,next) =>{

    try{
        if(req.user.accountType !== "Admin")
        {
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
    

            })
        }
        next();

    }catch(error)
    {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User Role can not be verify Admin",

        })
    }


}