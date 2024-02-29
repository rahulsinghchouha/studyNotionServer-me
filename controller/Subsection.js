const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader")


//create subsection

exports.createSubSection = async (req, res) => {

    try {
        //fetch data from body section id jo is trh ka kuchh data hm khud se send kr rahe hote hai
        const { sectionId, title, description, timeDuration } = req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if (!sectionId || !title || !description || !timeDuration || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",

            })
        }
        const ifsection= await Section.findById(sectionId);
		if (!ifsection) {
            return res
                .status(404)
                .json({ success: false, message: "Section not found" });
        }
        //upload video to cloudinary and also get secure_Url
        const uploadDetails = uploadImageToCloudinary(video, process.env.FOLDER_NAME);//upload details men hmara secure url aa jayega 
        //create sub section
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,

        })
        //update section with this sub-section objectId

        const updateSection = await Section.findByIdAndUpdate({ _id: sectionId },//for searching jaha id v section id equal hai means ye vali section id hai vaha 
            {
                $push: {
                    SubSection: SubSectionDetails._id,//subsection men ye vali id dalni hai
                }

            },
            { new: true });
        // id ki jagah pura data dikhane ke liye populate ka use krenge


        //return response 

        return res.status(200).json({
            success:true,
            message:"Sub section created succesfully",
            updateSection,
            
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Sub section creation failed",
            error:error.message,
        })

    }
}

//HW - update sub section
exports.updateSubSection = async (req,res) =>{

    try{
        //kya update krna hai
        const {sectionId,title,description} = req.body;

        const subSection = await SubSection.findById(sectionId);
        
        //validation 
        if(!subSection)
        {
            return res.status(404).json({
                success:false,
                message:"Sub Section not found wrong id",
            })
        }

        if(title !== undefined)
        {
            subSection.title = title; //agar title bhi change krna chahta hai
        }

        if(description !== undefined)
        {
            subSection.description = description; //for change the description
         }

         
         if(req.files && req.files.video !== undefined)
         {
            const video = req.files.video; //video fetch kiya
          const uploadDetails = await uploadImageToCloudinary(//upload video on cloudinary
                video,
                process.env.FOLDER_NAME,
            )

            //for take subSection video from cloudinary
         subSection.videoUrl = uploadDetails.secure_url; //update secure url
         subSection.timeDuration = `${uploadDetails.timeDuration}`; //update time duration
         }

         //for save the data 
         await subSection.save();

         return res.status(200).json({
            success:true,
            message:"SubSection Uploaded Succesfully",
           // subSection,
         })
         
    }catch(error){
       console.log(error);

       return res.status(500).json({
        success:false,
        message:"Error while updating Subsection",
       })
    
    }

}

//HW - delete sub section
exports.deleteSubSection = async(req,res) =>{
    try{
        const{subSectionId,sectionId} = req.body;

        await Section.findByIdAndUpdate(
                  { _id:sectionId,},
               {
                 $pull:{
                    subSection:subSectionId, //section men jo bhi subSection id ye vali hai use delete krna
                }
            },
        )

            const subSection = await SubSection.findByIdAndDelete({_id:subSectionId}); //jaha bhi id subsection men ye vali hai use delete kr do

            //yadi id match nhi hoti hai

            if(!subSection)
            {
                return res.status(404).json({
                    success:false,
                    message:"Sub section id is not found "
                })
            }

            //return response
            return res.status(200).json({
                success:true,
                message:"Sub Section deleted succesfully",
            })

    }catch(error){

        console.log(error);

        return res.status(500).json({
         success:false,
         message:"Error while Deleting the Subsection",
        })
    }
}


