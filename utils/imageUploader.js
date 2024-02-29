const cloudinary = require("cloudinary").v2


// in this we provide the file folder heigh qualty in input
exports.uploadImageToCloudinary = async (file,folder,height,quality) =>{

const options = {folder}; //pahle folder insert kr denge options naam ke object men 

if(height)
{
    options.height = height;//we entering the data in options 
}
if(quality)
{
    options.quality = quality;
}

options.resource_type = "auto";//we do resource type auto 

//then we upload file on cloudinary

return await cloudinary.uploader.upload(file.tempFilePath,options); //file.tempfile because temp file banti hai


}