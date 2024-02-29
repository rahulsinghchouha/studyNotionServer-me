const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {

    try {
        //data fetch section hmara do data aayega name and id
        const { sectionName, courseId } = req.body;

        //data validation

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "fill all the details",
            });
        }
        const ifcourse= await Course.findById(courseId);
		if (!ifcourse) {
			return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        //create section we creating a section
        const newSection = await Section.create({ sectionName }); //new section db men enter hoga to uski ek id bhi bnegi db men jose hm coursecontent men daal denge
        //update course with section ObjectId

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId, //course id ke dvara find kiya
            {      //or usme ye object id daal di
                $push: { //course content men object  id daal di 
                    courseContent: newSection._id,//yaha hmne vo id daal di hai
                },

            },//for updation
            { new: true },


        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();

        //yaha pr ise updateCourseDetails ko print krenge to ye bus .id ko print krega pr agr hm section v sub-section dono ko print krvana chahate hai to hm populate ka use krenge

        //retur response -->


        return res.status(200).json({
            success: true,
            message: "Section creted succesfullly",
            updatedCourse,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create a section",
            error: error.message,
        })

    }


}

//update the courseSection

exports.updateSection = async (req, res) => {
    try {

        //data input
        console.log("--->");
    
        const { sectionName, sectionId } = req.body;

        console.log(sectionId,sectionName);
        //data validation

        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "fill all the details",
            });
        }
        //update data id ke dvara  hm data ko update kr denge  //section name is updating
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        //return response
        return res.status(200).json({
            success: true,
            message: " Section Update succesfully",
            section,

        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create a section",
            error: error.message,
        })


    }
}

//for delete section
exports.deleteSection = async (req, res) => {
    try {
        //getId - assuming that we are sending id in params
        const { sectionId } = req.body; //parameters
        //findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);

        //TODO - delete from course  schema update course
        //return response
        return res.status(200).json({

            success: true,
            message: "Section Deleted Succesfully",

        })

    } catch (error) {
        return res.status(500).json({

            success: false,
            message: "Deletion failed, Unable to delete",
            error: error.message,
        })
    }
}
