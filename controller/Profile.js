const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req,res)=>{
    try{
        //get data dateofBirth v about optional hai isliye ise hm starting men empty le lenge
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        //get userId
        const id = req.User.id; //kyunki hmari id hmne auth men token crete krte vaqt user men insert ki hai Auth.js men
        //validation
        if(!contactNumber || !gender ||!id)
        {
            return res.status(400).json({
                success:false,
                message:"All Fields are required",
            })
        }
        //find Profile ab hm pahle user ki detail lekar aate hai
        const userDetails = await User.findById(id);//ab hmko is id se user ki detail mil gayi hai or isme hmari profile id hai 
        
        const profileId = userDetails.additionalDetails; //hmne yaha per user details mese profile id nikal li hai
        
        //ab profile details se profile id nikal lenge

        const profileDetails = await Profile.findById(profileId);
        
        //update profile 
                //hmara object nhi hota to tm create function ka use krte yaha hmara object bana hai to hm save function ka use krenge
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save(); //yaha hm profileDetails .save se ye data save kr denge


        //return response
        return res.status(200).json({
            success:true,
            message:"Profile Updated Succesfully",
            profileDetails,
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }


}

//delete account
//How Can we---> schedule this deletion operation
exports.deleteAccount = async(req,res) =>{
    try{
        //get id
        const id = req.user.id;

        //validation
        const userDetails = await User.findById(id); //id nikal li
        if(!userDetails)
        {
            return res.status(404).json({
                success:false,
                message:"User not found",

            })
        }
        //delete profile id
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});//jaha hmari id user.additional id ke equal hai use hm delet kr denge profile details

          //HW - delete entry from enroll courses delete from totalcount
        //unenroll user from allenroll courses

        //delete user id
        await User.findByIdAndDelete({_id:id});

     
        //return response
        return res.status(200).json({
            success:true,
            message:"User deleted Succesfully",
        })
        //HW - how to schedule task schedule delete for 3days or like this

    }catch(error)
    {
        return res.status(200).json({
            success:false,
            message:"User can not be deleted",
        });
    }
}


//for all details of user
exports.getAllUserDetails = async(req,res) =>{

    try{
        //get id
        console.log("---------------------->");
        const id = req.user.id;
        console.log("id----->",id);
        //validation and get user details

        const userDetails = await User.findById(id).populate("additionalDetails").exec(); //popolate se hmari profile details bhi print ho jayegi nhi to hmari bus id print hoti

        //return response
        return res.status(200).json({
            success:true,
            message:"User Data fetched succesfully",
            userDetails,

        })


    }catch(error)
    {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


exports.getEnrolledCourses=async (req,res) => {
	try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const enrolledCourses = await User.findById(id).populate({
			path : "courses",
				populate : {
					path: "courseContent",
			}
		}
		).populate("courseProgress").exec();
        // console.log(enrolledCourses);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: enrolledCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


//updateDisplayPicture
exports.updateDisplayPicture = async (req, res) => {
	try {
        console.log("id--->",req.user.id)
		const id = req.user.id;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
    console.log("User----->",user)
	const image = req.files.file;
    console.log("image----->",image);
	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await uploadImageToCloudinary(
		image,
		process.env.FOLDER_NAME
	);
	console.log(uploadDetails);

	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });
		
	} catch (error) {
        console.log(error)
		return res.status(500).json({
            success: false,
            message: `Error in profile ${error.message}`,
        });
		
	}



}