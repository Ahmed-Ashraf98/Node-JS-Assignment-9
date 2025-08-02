import mongoose from "mongoose";

const DBName = "stickyNotes";
const DBUrl = `mongodb://127.0.0.1:27017/${DBName}`;

export const dbConnectStatus = {
  failed: "failed",
  success: "success",
};

Object.freeze(dbConnectStatus);

export const connectDB = async () => {
  try {
    await mongoose.connect(DBUrl);
    return {
      status: dbConnectStatus.success,
      message: `Connected to the database: ${DBName}`,
    };
  } catch (error) {
    return {
      status: dbConnectStatus.failed,
      message: `Error connecting to the database: ${error.message}`,
    };
  }
};
