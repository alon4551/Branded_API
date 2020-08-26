const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alon4551@gmail.com',
    pass: 'yeruham@3341'
  }
});


const Send =(email)=> {
    const mailOptions = {
        from: 'alon4551@gmail.com',
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