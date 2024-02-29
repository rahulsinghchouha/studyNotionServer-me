const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({

    courseName: {
        type: String,
        trim: true,
    },
    courseDescription: {
        type: String,
        trim: true,
    },
    //courses ke andar instructor bhi hoga jo bhi ek user hoga
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    price: {
        type: Number,

    },
    thumbnail: {
        type: String,
    },
    tag:{
        type:String,
        required:true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",

    },

    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    }],
    instructions:{
        type:String,
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    },

},
{ timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);