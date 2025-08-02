import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const encDecSettings = {
  algorithm: "aes-256-cbc",
  secretKey: Buffer.from(process.env.Secret_Key, "hex"),
  iv: Buffer.from(process.env.IV, "hex"),
};

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const encryptPhone = (phone) => {
  const cipher = crypto.createCipheriv(
    encDecSettings.algorithm,
    encDecSettings.secretKey,
    encDecSettings.iv
  );
  let encrypted = cipher.update(phone, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptPhone = (encryptedPhone) => {
  const decipher = crypto.createDecipheriv(
    encDecSettings.algorithm,
    encDecSettings.secretKey,
    encDecSettings.iv
  );
  let decrypted = decipher.update(encryptedPhone, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const generateToken = (userId) => {
  const options = { expiresIn: "1h" };
  const token = jwt.sign(userId, process.env.Token_Sign, options);
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.Token_Sign);
    return decoded;
  } catch (error) {
    return null;
  }
};
