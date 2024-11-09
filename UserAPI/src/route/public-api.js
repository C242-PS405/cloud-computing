import express from "express";
import userController from "../controller/user-controller.js";

const publicRoute = new express.Router();
publicRoute.post('/api/users', userController.register);
publicRoute.post('/api/users/login', userController.login);

export { publicRoute };