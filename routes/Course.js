//import the require models

const express = require("express");
const router = express.Router();


//import the controllers

//course controller import

const{
    createCourse,
    showAllCourses,
    getCourseDetails,
} = require("../controller/Course");

//categories controller import 
const {
    showAllcategory,
    createCategory,
    categoryPageDetails,

} = require("../controller/Category");

//section controllers import
const {
    createSection,
    updateSection,
    deleteSection
} = require("../controller/Section");

//sub - section controller import

const {
    createSubSection,
   // updateSubSection,
    // deleteSubSection,
} = require("../controller/Subsection");

//Rating controller import
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controller/RatingAndReview");

//import middlewares

const {auth,isInstructor,isStudent,isAdmin} = require("../middlewares/auth");


//************************Course Routes***************************  */
//course can only be created by instructor
router.post("/createCourse",auth,isInstructor,createCourse)

//add a section to a course
router.post("/addSection",auth,isInstructor,createSection);

//updateSection
router.post("/updateSection",auth,isInstructor,updateSection);

//deleteSection
router.post("/deleteSection",auth,isInstructor,deleteSection);

//edit subsection
//router.post("/updateSubSection",auth,isInstructor,updateSubSection);

//delete subSection
//router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);

//add a subSection to a Section
router.post("/addSubSetcion",auth,isInstructor,createSubSection);

//getAllRegisteredCourse
router.get("/getAllCourses",showAllCourses);

//get a details for a specific course
router.post("/getCourseDetails",getCourseDetails);


//**************Category routes only for Admin********************** */


//TODO :put isAdmin middleware here
router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategories",showAllcategory);
router.post("/getCategoryPageDetails",categoryPageDetails);

//***********************Rating and Review************************ */
router.post("/createRating",auth,isStudent,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getReviews",getAllRating);

module.exports = router


