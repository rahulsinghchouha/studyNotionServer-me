const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    //in that we refer to additional Details
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId, //it is configuration for path in schema
        required:true,
        ref:"Profile", // kyunki yaha hm refer krenge
    },

    courses:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
      }
],
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },

    resetPasswordExpires:{
        type:Date,
    },

    courseProgress:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",

      }
],
    

});

module.exports = mongoose.model("User",userSchema);