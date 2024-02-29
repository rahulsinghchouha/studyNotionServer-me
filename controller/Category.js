const Category = require("../models/Category");

//create tag ka handler function

exports.createCategory = async (req, res) => {

    try {
        //fetch name and description for tag
        const { name, description } = req.body;

        //agr name ya description nhi hai
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields required for create a tag",

            })

        }

        //create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description, //hmne entry create kr di hai jisme name men name v description men description dala hai
        })

        console.log(categoryDetails);
        //return response

        return res.status(200).json({
            success: true,
            message: "Tag Created Succesfully",

        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,

        })
    }



}

//get all Category handler function

exports.showAllcategory = async (req, res) => {

    try {
        //fetching all tags without crieteria{} but but name and description mandatory
        const showAllcategory = await Category.find({}, { name: true, description: true }); //jinka naam bhi hai description bhi hai sirf vo vali

        res.status(200).json({
            success: true,
            message: "All Tags return succesfully",
            showAllcategory,

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,

        })
    }

}

//categoryPageDetails

exports.categoryPageDetails = async (req, res) => {
    try {
        //get Category Id

        const { categoryId } = req.body;

        //get course for specified  categoryId jo category student chahta use show krna
        const selectedCategory = await Category.findById(categoryId)
            .populate("courses")
            .exec();

        //validation

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Data not Found",
            })
        }

        //getCourses for different categories select categories ke liye courses aa gaye ab hm different category ke liye bhi courses chahiye

        const differentCategories = await Category.find({
            _id: { $ne: categoryId }, //ne not equal to categoryid means ise chhodkar
        })
            .populate("courses")
            .exec();

        //get top selling courses TODO

        //return response

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories, //we can send data according to our 
            }

        })



    } catch (error) {

        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }

}

