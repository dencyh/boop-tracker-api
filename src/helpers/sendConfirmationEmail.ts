const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (user) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.CONFIRMATION_EMAIL,
      pass: process.env.CONFIRMATION_EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Boop Tracker" <foo@example.com>',
    to: user.email, // list of receivers
    subject: "Email confirmation", // Subject line
    text: "", // plain text body
    html: `<div style="text-align: center; background: #222222; color:#e4e4e4; padding: 40px"><div style="margin:0 auto; max-width: 500px; padding:30px;border-radius: 15px; background: #333333"><h3>Welcome to Boop Tracker🚀, ${user.firstName} ${user.lastName}!</h3><h3 style="font-weight: normal" ><a style="color: #00a286" href='${process.env.API_URL}/api/confirm/${user.confirmationLink}'>Click here to confirm your e-mail address!</a></h3></div></div>`, // html body
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = {
  sendConfirmationEmail,
};
