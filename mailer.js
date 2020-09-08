const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your email addresss',
    pass: 'your email password'
  }
});
//you need to allow your gmail account to use less secure app

const Send =(email)=> {
    const mailOptions = {
        from: 'your email addresss',
        to: email,
        subject: 'verify account',
        text: `please click on this link http://localhost:3000/verify/${email}`
      };
      
    return new Promise((resolve,reject)=>
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        reject({ status:false,error:error});
    } else {
        resolve({status:true,message:'Email sent: ' + info.response});
    }
}))
}
module.exports={
    Send
}