import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_SENDER,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}
