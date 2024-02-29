const nodemailer = require("nodemailer");
require("dotenv").config();

//email title v body hmare input men send kiye huye hai
const mailSender = async (email,title,body) =>{
    try{
        //yaha hmne transporter create kiya hai
        let transporter = nodemailer.createTransport({

            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }

        })

        let info = await transporter.sendMail({
            from:`StudyNotion || ED-Tech - <${process.env.MAIL_USER}>`,
            to:`${email}`, //object ke andar kisi variable ko store
            subject:`${title}`,
            html:`${body}`,

        })
        console.log(info);

        return info;


    }catch(error){
        console.log(error.message);
    }
}

module.exports = mailSender;