import express from "express";
import cookieParser from "cookie-parser";
// import cors from "cors";
import { userRoute } from "../route/user-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRoute } from "../route/public-api.js";

export const app = express();
app.use(express.json());
// app.use(cors(credentials: true, origin: "http://your-android-app-origin.com"));
app.use(cookieParser());

app.use(publicRoute); 
app.use(userRoute);

app.use(errorMiddleware)