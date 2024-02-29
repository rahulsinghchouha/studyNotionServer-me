const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create Rating
exports.createRating = async (req, res) => {

    try {
        //get user id 
        const id = req.user.id;

        //fetch data from request body

        const { rating, review, courseId } = req.body;

        //check if user is enrolled or not

        const courseDetails = await Course.findOne({
            _id: courseId, //id jo hai vo course id hona chahiye
            studentEnrolled: {
                $elemMatch: { $eq: userId }, //checking user enrolled hai ya nhi us course men
            }                               //element match naam ka ek operator hat hai... v equal eq naam ka ek operator hota hai
        }
        )

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            })
        }
        //check if user already reviewed the course user id v course id ko check kr lebge rating review collection men

        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        }) //agr in dono  data ke sath koi entry hai means hmara user pahle se review kr chuka hai

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course  is already reviewed by User",
            })
        }

        //create rating and review

        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });
        //update course with rating review rating review ko hm course men update kr denge
        const updatedCourseDetails = await Course.findByIdAndUpdate({ _id: courseId }, //for searching
            {
                $push: {
                    ratingAndReviews: ratingReview._id,//updating rating and review id dalna hai
                }
            },
            { new: true });

        console.log(updatedCourseDetails);
        //return response

        return res.status(200).json({
            success: true,
            message: "Rating And Review created Succesfully",
            ratingReview,
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



//getAverageRating
exports.getAverageRating = async (req, res) => {

    try {
        //input men hmare pass course hona chahiye kyunki hm course ki rating nikal rahe hai so--->

        //get course id
        const courseId = req.body.courseId;
        //calculate avg rating  aggregate ka use hm krenge jaha kuchh methodds likhenge

        const result = await RatingAndReview.aggregate([
            {
                $match: {      //hm mtach kr rahe course ko jis ki course id ye hai courseId
                    course: new mongoose.Types.ObjectId(courseId), //course ki field ke andar ye vali id ho
                },                  //course id hmari string thi use convert kr diya object id men
            },   //hmne vo sabhi entry nikal li hai jinki course ki value ye course id hai

            //ab inko group krke calculation kr lenge
            {
                $group: { //hm group krna chahte kis basis pr to hmne null le liya jitni bhi entry hmare pass aayi thi hmne sabhi ko ek single group men rap kr diya
                    _id: null,
                    averageRating: { $avg: "$rating" },  //average rating ke andar hm average operator ka use kr lenge average ke liye

                }

            }

        ])

        //return rating

        if (result.length > 0) { //means rating mil gayi

            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating, //hmara result jo hai vo array return kr raha hsi to hm 0 index ki value send kr denge
            })
        }

        //if no rating reviews
        return res.status(200).json({
            success: true,
            message: " No rating give till now",
            averageRating: 0,//yaha hmne rating 0 bhej di

        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}


//getAllRating for see the all of the rating of all courses we can also do course specific

exports.getAllRating = async (req, res) => {
    try {
        //hm jitni bhi rating and reviews hai sabhi ko le aayenge RatingAndReviews se

        const allReviews = await RatingAndReview.find({})//without and condition
            .sort({ rating: "desc" }) //rating ko desending order men sort krke lana hai
            .populate({
                path: "user",
                select: "firstName lastName email image", //sirf ye hee details dena

            })
            .populate({
                path:"course",
                select:"courseName",
            })
            .exec();

            return res.status(200).json({
                success:true,
                message:"All reviews fetched Succesfully",
                data:allReviews,
            });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

