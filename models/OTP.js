const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender"); //function call from otp
const emailTemplate = require("../mail/template/emailVerificationTemplte");

const OTPSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    },
});
// here we use the mail sender function
// a function to send email

async function sendVerificationEmail(email, otp) //hm input men btayenge ki kisko bheju or kis otp ke sath bheju tabhi hm send kr payenge 
{
    try {
        //here we calling mailsender function otp bhej rahe hai vo email template men bhenge
        const mailResponse = await mailSender(email, 
            `Verification Email from StudyNotion ${otp}`,
             emailTemplate(otp),
             
             );

        console.log("Email Send Succesfully", mailResponse);

    }
    catch (error) {
        console.log("Error occur while sending mail", error);
        throw error;
    }


}
//here we use pre function and save next se hm agle middleware men jayenge

//hm document save hone se pahle verification function call kr lenge
OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})


module.exports = mongoose.model("OTP", OTPSchema);