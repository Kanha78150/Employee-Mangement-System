const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEmail = async (to, subject, htmlBody) => {
  try {
    const info = await transporter.sendMail({
      from: `"Employee Dashboard" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlBody,
    });
    console.log(`📩 Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};
