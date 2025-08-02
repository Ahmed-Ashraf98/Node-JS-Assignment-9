import { connectDB, dbConnectStatus } from "./DB/connection.js";
import userRouter from "./Modules/User/user.controller.js";
import noteRouter from "./Modules/Note/note.controller.js";
import authRouter from "./Modules/Auth/auth.controller.js";

const connectionResult = await connectDB();

export const bootstrap = (express, app) => {
  if (connectionResult.status !== dbConnectStatus.success) {
    console.log("Unable to connect to the database. Exiting...");
    process.exit(1);
  }

  app.listen(process.env.Port, () => {
    console.log(`Server is running on port ${process.env.Port}`);
  });

  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/notes", noteRouter);

  app.use((err, req, res, next) => {
    res.status(500).json({ message: err });
  });
};
