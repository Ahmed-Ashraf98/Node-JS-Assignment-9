import nodemailer from "nodemailer";

const createTransport = () => {
  const serviceName = "gmail";
  const userEmail = process.env.senderEmail;
  const passKey = process.env.passKey;

  const transporter = nodemailer.createTransport({
    service: serviceName,
    auth: {
      user: userEmail,
      pass: passKey,
    },
  });
  return transporter;
};

export const sendMail = async (subject, template, toAddressesList) => {
  const transporter = createTransport();
  const toAddresses = toAddressesList.join(", ");
  const info = await transporter.sendMail({
    from: `"${process.env.senderName}" <${process.env.senderEmail}>`,
    to: toAddresses,
    subject: subject,
    html: template,
  });

  console.log("Message sent:", info.messageId);
};
