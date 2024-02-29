const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Category = require("../models/Category");
const Section = require("../models/Section");


//createCourseHandler function

exports.createCourse = async (req, res) => {
    try {
    
        const userId = req.user.id;
       
         //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag,category } =
            req.body;

            console.log(courseName, courseDescription, whatYouWillLearn, price, tag,category);
        
        //taha per jo hmne tag nikala hai vo objectId hai kyuki hmne tag men model men type object id dala hai

        //get thumbnail

        const thumbnail = req.files.thumbnailImage;

        //validation

        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag ||
            !thumbnail ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        //chech for instructor beacuse we need to add the instructor id
        console.log("------->id")
        console.log("----->id",req.user.id);
       
        
        //instructor details
        const instructorDetails = await User.findById(userId,
            {accountType:"Instructor"},
            );
        console.log("Instructor Details", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found",
            });
        }
        //check given tag is valid or not

        const categoryDetails = await Category.findById(category); //kyuki hmari tag men id object id aayi hai

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag Details not found",
            });
        }
        //upload image to cloudinary first parameter konsi file hai v second konsa folder hai
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );
        console.log(thumbnailImage);

        //create an entry for new courses
        const newCourses = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id, //kyunki instructor men reference hai or hmko id deni hogi isliye hmne instructor details nikali hai
            whatYouWillLearn: whatYouWillLearn,
            price,
            Category: categoryDetails._id,
            tag:tag,
            thumbnail: thumbnailImage.secure_url,

            //yaha hmne new course create kr liya hai
        });

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id }, //for searching then update
            //user ke course ke array ke andar course  ki id insert kr denge

            {
                $push: {
                    courses: newCourses._id, //insert new courses in user schema array men
                },
            },
            { new: true }
        );

        //  - update the category schema
        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourses._id,
				},
			},
			{ new: true }
		);
        //retur response

        return res.status(200).json({
            success: true,
            message: "Course created succesfully",
            data: newCourses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "failed to create course",
            error: error.message,
        });
    }
};

//get all courses handler function
//for all courses

exports.showAllCourses = async (req,res) =>{


    try{
        //koi condition nhi pr ye sb present hona chahiye course se vo data 
        //found krke lao jisme ye present hai;

        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentEnrolled:true,       
        }).populate("instructor")
          .exec();

          return res.status(200).json({
            success:true,
            message:"Data for all the courses fetch succesfully",
            data:allCourses,

          })


    }catch(error)
    {
        console.log(error);
        return res.status(500).json({

            success:false,
            message:"Can not fetch user course",
            error:error.message,
        })
    }

}

//get all course Details

exports.getCourseDetails = async (req,res) =>{

    try{
        //get id
        const {courseId} = req.body;

        //find CourseDetails
        const courseDetails=await Course.find({_id: courseId}).populate({path:"instructor",
        populate:{path:"additionalDetails"}})
        .populate("category")
        // .populate({                    //only populate user name and image
        //     path:"ratingAndReviews",
        //     populate:{path:"user"
        //     ,select:"firstName lastName accountType image"}
        // })
        .populate({path:"courseContent",populate:{path:"subSection"}})
        .exec();
        //validation

        if(!courseDetails)
        {
            return res.status(400).json({
                    success:false,
                    message:`Could not find the course with ${courseId}`,

            })
        }

        //return response

        return res.status(200).json({
            success:true,
            message:"Course details printed succesfully",
            data:courseDetails,
        })


    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }


}

