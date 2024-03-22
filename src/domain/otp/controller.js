const OTP = require("./model");
const generateOTP = require("./../../utilities/generateOTP");
const sendEmail = require("./../../utilities/sendEmail");
const { hashData,verifyHashedData } = require("./../../utilities/hashData");
const verifyOTP = async ({ email, otp }) =>{
    try {
        if(!(email && otp)){
            throw Error("Please provide values fro email, otp");
        }

        const matchedOTPRecord = await OTP.findOne({
            email,
        });

        if(!matchedOTPRecord){
            throw Error("No otp found.");
        }

        const { expiresAt } = matchedOTPRecord;
        if(expiresAt < Date.now()){
            await OTP.deleteOne({ email });
            throw Error("Code has expired.Request for new one.");
        }

        const hashedOTP = matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp,hashedOTP);
        return validOTP;
    } catch (error) {
        throw error;
    }
};


const sendOTP = async ({ email, subject, message, duration = 1}) =>{
    try {
        if(!(email && subject && message)) {
            throw Error("Provide values for emal, subject and message");
        }

        //clear any old record 
        await OTP.deleteOne({ email });

        // generate pin
        const generatedOTP = await generateOTP();

        // send email
        const mailOptions = {
            from: 'rnnitish2336@gmail.com',
            to: 'nitish0972.be21@chitkara.edu.in',
            subject:"Please Verify Your Mail",
            text: `Your otp is ${generatedOTP}` 
        };
        await sendEmail(mailOptions);

        // save otp record
        const hashedOTP = await hashData(generatedOTP);
        const newOTP = await new OTP({
            email,
            otp:hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 *+ duration,
        });

        const createdOTPRecord = await newOTP.save();
        return createdOTPRecord;
    } catch (error) {
        throw error;
    }
};

const deleteOTP = async (email) =>{
    try {
      await OTP.deleteOne({ email });  
    } catch (error) {
       throw error; 
    }
}

module.exports = { sendOTP, verifyOTP, deleteOTP };