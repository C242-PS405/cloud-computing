import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware, refreshTokenRateLimiter } from "../middleware/auth-middleware.js";

const userRoute = new express.Router();
// userRoute.get('/api/users/token', userController.refreshToken);
userRoute.get('/api/users/token', refreshTokenRateLimiter,userController.refreshToken);
userRoute.use(authMiddleware)
userRoute.get('/api/users/current', userController.get);
userRoute.patch('/api/users/current', userController.update);
userRoute.delete('/api/users/logout', userController.logout);


export { userRoute };