import bcrypt from "bcrypt";
import crypto from "crypto";

const getEncDecSettings = () => {
  return {
    algorithm: "aes-256-cbc",
    secretKey: Buffer.from(process.env.Secret_Key, "hex"),
    iv: Buffer.from(process.env.IV, "hex"),
  };
};

export const encryptValue = (value) => {
  const { algorithm, secretKey, iv } = getEncDecSettings();
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptValue = (encryptedValue) => {
  const { algorithm, secretKey, iv } = getEncDecSettings();
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedValue, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const hashValue = async (value) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedValue = await bcrypt.hash(value, salt);
  return hashedValue;
};

/**
 *
 * @param {*} value  The original value
 * @param {*} hashedValue The hashed value
 * @returns true if both values equals otherwis false
 */
export const compareWithHashed = async (value, hashedValue) => {
  return await bcrypt.compare(value, hashedValue);
};
