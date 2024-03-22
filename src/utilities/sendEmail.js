const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
        auth: {
            user: //YAHA APNI EMAIL ID DAL LIO ,
            pass: // YAHA APNA PASSWORD JO 2 FACTOR AUTHENTICATION OF KARNE K BAAD AEGA
        }
});

transporter.verify((error, success)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("Ready for message");
        console.log(success);
    }
});

const sendEmail = async(mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

module.exports = sendEmail;