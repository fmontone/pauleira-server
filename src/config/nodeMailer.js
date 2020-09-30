import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

function sendEmail(mailTo, subject, text, html) {
  return transporter.sendMail({
    from: `Pauleira Web <${process.env.NODEMAILER_USER}>`,
    to: mailTo || 'montone@gmail.com',
    subject,
    text,
    html,
  });
}

export default sendEmail;
