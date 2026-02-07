import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export async function sendMail(to, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Verification OTP",
    html: (
      `<p>
        This is verification otp by vingo. OTP : ${otp} OTP is valid for 5 min.
      </p>`
    ),
  });
}
