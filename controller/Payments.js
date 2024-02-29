const { instance } = require("../config/razorpay"); //importing instance object hai so {instance}
const Course = require("../models/Course"); //importing model
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/template/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the Razorpay order

exports.capturePayment = async (req, res) => {
    //get course and user ID
    const { course_id } = req.body;
    const userId = req.user.id; //login hoga tabhi aaya hoga or auth men hmne daal rakhi hai


    //validation
    //validCourseId
    if (!course_id) {
        return res.json({
            success: false,
            message: "Please Provide valid course id",

        })
    };
    //validCourseDetails is id se jo course detail aa rahi hai vo valid hai ya nhi for course details from id

    let course;
    try {
        course = await Course.findById(course_id);

        if (!course) {
            return res.json({
                success: false,
                message: "Could not find the course",
            })
        }

        //user already pay for the same course

        const uid = new mongoose.Types.ObjectId(userId); //convert the user id string to objectId kyunki studentEnrolled jo hai uska type objectId hai

        //then check ki kya ye id already enrolled hai ,agr koi student bole ki mene pese de diye or enroll nhi hu to vo bhi hm check kr sakte hai
        if (course.studentEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: "Student is already Enrolled",

            })
        }

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message,
        })

    }



    //order create 
    const amount = course.price; //hmne jo course liya fetch hai usme price bhi hogi
    const currency = "INR";

    const options = {

        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,

        }
    }

    //ab hm create function call kr denge
    try {
        //initiate the pyment using rozarpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);


        //return response

        return res.status(200).json({

            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumnail: course.thumnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,

        })


    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: "Could not initiate order",

        });
    }


}

//ab hm authorized krenge verify signature pahle hmne sirf capture kiya hai

//verify Signature of Rozarpay server

exports.verifySignature = async (req, res) => {
    //rozarpay pay ka secret server ke secret ki matching krenge

    const webhookSecret = "123456789"; //manlo ye hmara server pr hai v dusra hmara razorpay se aayega

    //razorpay se secret

    const signature = req.headers["x-razorpay-signature"];//is trh raorpay se secret aata hai


    //convert web hook to digest for compare
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));

    const digest = shasum.digest("hex"); //to yaha hmne web hook secret ko digestke andar convert kr liya hai

    //now we match the signature and digest

    if (signature === digest) {
        console.log("Payment is authorised");

        //ab hm data nikal lenge jo hmne notes men bheja tha kyunki yaha ab ye razorpay se aa rha hai 

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            //fulfill the action

            //find the course and enroll in the student in it

            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },//object id jo hai vo course id ke equal hai
                {
                    $push: {
                        studentEnrolled: userId, //student enroll men user id daal denge course ke andar
                    }
                },
                { new: true },

            )

            //agar isme kuchh issue aa jata hai
            if (!enrolledCourse) {
                return res.status(500).json({
                    success: true,
                    message: 'Course not found',
                })
            }
            //agr bdiya hai to print  kra diya

            console.log(enrolledCourse);

            //ab hm find the student ke andar course id daal denge

            const enrollStudent = await User.findOneAndUpdate(
                { _id: userId }, //ye match hona chahoye user find in db
                {
                    $push: {
                        courses: courseId,
                    }
                },
                { new: true },
            );

            console.log(enrollStudent);

            //mail send krdo confirmation Wala 
            //hmko input men kya dena hai vo kise bhejna hai  subject and body

            const emailResponse = await mailSender(
                enrollStudent.email,
                "Congratulation by Rahul",
                "you onboarded on rahul course"
            );

            console.log(emailResponse);

            return res.status(200).json({
                success: true,
                message: "Signature verified and course added",
            });


        } catch (error) {

            return res.status(500).json({
                success: true,
                message: error.message,

            })

        }


    }
    //agar hmara signature match nhi huaa
    else{
        return res.status(500).json({
            success:false,
            message:"Invalid Signature",
        })
    }

}