const express = require("express");
const app = express();
const bodyParser = require("body-parser");


const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//cors for add the path
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)

//for uploading the file
app.use(

    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)
//cloudinaryConnection
cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

//def route we can say for checking
 
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is up and running...",
    })
});

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
});