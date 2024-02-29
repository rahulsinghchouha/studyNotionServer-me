const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log("DB Connected Succesfully"))
    .catch((err)=>{
        console.log("DB Connecting Problems");
        console.log(err);
        process.exit(1);
    })
};