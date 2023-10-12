const crypto = require('crypto');
const hashService = require('./hash-service');
const smsSid = process.env.SMS_SID;
const smsAuth = process.env.SMS_AUTH_TOKEN;

const twilio = require('twilio')(smsSid,smsAuth,{
    lazyLoading: true,
})
class OtpService{
    async generateOtp(){
        const otp =crypto.randomInt(1000,9999);
        return otp;
    }
    async sendBySms(phone,otp){
        return await twilio.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `Yours SocialHouse OTP is ${otp}`
        })
    }
    verifyOtp(hashedOtp,data){
        let computedHash = hashService.hashOtp(data)

        if(computedHash === hashedOtp){
            return true
        }
        return false;
    }
    
}



module.exports= new OtpService();