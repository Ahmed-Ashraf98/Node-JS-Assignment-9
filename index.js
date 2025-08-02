import { bootstrap } from "./src/app.bootstrap.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
bootstrap(express, app);
