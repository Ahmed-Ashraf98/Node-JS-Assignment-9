import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  service: "gmail",
  auth: {
    user: process.env.senderEmail,
    pass: process.env.passKey,
  },
});

export const sendMail = async (subject, template, toAddresseList) => {
  const toAdresses = toAddresseList.join(", ");

  const info = await transporter.sendMail({
    from: `"${process.env.senderName}" <${process.env.senderEmail}>`,
    to: toAdresses,
    subject: subject,
    html: template,
  });

  console.log("Message sent:", info.messageId);
};
