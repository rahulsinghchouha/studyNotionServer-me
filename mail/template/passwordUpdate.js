exports.passwordUpdate = (email, name) => {
    return `<DOCTYPE html>
    <html>

    <head>
       <meta charset="UTF-8">
       <title>Update Password </title>
        <style>
            body{
                background-color:#ffffff;
                font-family:Arial,sans-serif;
                font-size:16px;
                line-height:1.4;
                color:#333333;
                margin:0;
                padding:0;

            }

            .container{
                max-width:600px;
                margin: 0 auto;
                padding:20px;
                text-align:center;
            }
            .logo{
                max-width:200px;
                margin-bottom:20px;
            }
            .message{
                font-size:18px;
                font-weight:bold;
                margin-bottom:20px;
            }
            .body{
                font-size:16px;
                margin-bottom:20px;
            }
            .cta{
                display:inline-block;
                padding:10px 20px;
                background-color:#FFD60A;
                color:#000000;
                text-decoration:none;
                border-radius:5px;
                font-size:16px;
                font-weight:bold;
                margin-top:20px;

            }
            .support{
                font-size:14px;
                color:#999999;
                margin-top:20px;
            }
            .highlight{
                font-weight:bold;
            }
        </style>
    </head>
    
    <body>

    <div class="container">
    <a href="http://studynotion-edtech-project.vercel.app">
            <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png"
            alt="studyNotion Logo">
    </a>

    <div class="message">Password Update Confirmation</div>
    <div class="body">
            <p>Dear ${name},</p>
            <p>Your password hasbeen succesfully updated <span class="highlight">"${email}"</span>
           </p>
            <p>If you did not request your password change, please contact us to imedietally secure your account</p>

           </div>
        <div class="support">If you have any question or need asistance please feel free to reach out to Supporter 
            <a href="mailto:rahulsinghchouhan6262@gmail.com">info@studynotion.com</a> We 
            are here to help you
            </div>
        </div>
    </body>

    </html>;
    `
};
