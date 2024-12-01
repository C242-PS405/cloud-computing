import express from "express";
import userController from "../controller/user-controller.js";
import historyController from "../controller/history-controller.js";
import profileController from "../controller/profile-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { upload } from '../middleware/upload-middleware.js';
import scraperController from "../controller/scraper-controller.js";

const userRoute = new express.Router();
userRoute.use(authMiddleware)
userRoute.get('/api/users/profile', userController.get);
userRoute.patch('/api/users/update', userController.update);
userRoute.delete('/api/users/logout', userController.logout);
userRoute.get('/api/logs/:id?', historyController.getLogs);
userRoute.post('/api/users/profile-picture', upload.single('profilePicture'), profileController.updateProfilePicture);
userRoute.post('/api/scraper', scraperController.scraper);

export { userRoute };