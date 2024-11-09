import express from "express";
import { userRoute } from "../route/user-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRoute } from "../route/public-api.js";

export const app = express();
app.use(express.json());

app.use(publicRoute); 
app.use(userRoute);

app.use(errorMiddleware)