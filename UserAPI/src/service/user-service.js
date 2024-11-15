import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import { loginUserValidation, registerUserValidation, updateUserValidation, getUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from 'dotenv';
config();

//Register
const register = async (req) => {
    const user = validate(registerUserValidation, req);

    const countUser = await prismaClient.user.count({
        where: {
            email: user.email
        }
    })

    if (countUser === 1) {
        throw new ResponseError(400, "User already registered")
    }

    if (user.password !== user.confirmPassword) {
        throw new ResponseError(400, "Password does not match")
    }

    delete user.confirmPassword;
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    return prismaClient.user.create({
        data: user,
        select: {
            email: true,
            name: true,
        }
    })
}

//Login
const login = async (req) => {
    const loginRequest = validate(loginUserValidation, req);

    const user = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
        }
    })
    if (!user) {
        throw new ResponseError(401, "email or password is wrong")
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "email or password is wrong")
    }

    const payload = {
        userId: user.id,
        name: user.name,
        email: user.email
    };

    const Token = jwt.sign(payload, process.env.TOKEN_SECRET);

    return prismaClient.user.update({
        data: {
            token: Token,
        },
        where: {
            id: user.id,
            email: user.email
        },
        select: {
            token: true,
            name: true
        }
    });
}

//getUser
const get = async (email) => {
    email = validate(getUserValidation, email);
    const user = await prismaClient.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    })

    if (!user) {
        throw new ResponseError(404, "User not found")
    }

    return user
}

const update = async (req) => {
    const user = validate(updateUserValidation, req);

    if (!user.id) {
        throw new ResponseError(400, "User ID is required");
    }

    if (!user.email) {
        throw new ResponseError(400, "User Email is required");
    }

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            id: user.id,
        }
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "User is not found");
    }

    // Mencari pengguna untuk memverifikasi password
    const existingUser = await prismaClient.user.findUnique({
        where: {
            id: user.id
        }
    });

    // Memverifikasi currentPassword
    const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Current password is incorrect");
    }

    // Perbaikan utama: Periksa email yang berbeda
    if (user.email && user.email !== existingUser.email) {
        const existingEmailUser = await prismaClient.user.findUnique({
            where: { email: user.email }
        });

        if (existingEmailUser) {
            throw new ResponseError(400, "Email already in use");
        }
    }

    const data = {}
    if (user.name) {
        data.name = user.name
    }
    if (user.email) {
        data.email = user.email
    }
    if (user.newPassword) {
        data.password = await bcrypt.hash(user.newPassword, 10);
    }

    return prismaClient.user.update({
        where: {
            id: user.id
        },
        data: data,
        select: {
            id: true,
            name: true,
            email: true
        }
    })
}

const logout = async (id, email) => {
    const emailValidation = validate(getUserValidation, email);

    const user = await prismaClient.user.findUnique({
        where: {
            id: id,
            email: emailValidation.email
        },
        select: {
            id: true,
            email: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.user.update({
        where: {
            id: id 
        },
        data: {
            token: null
        },
        select: {
            email: true
        }
    });
}

export default {
    register,
    login,
    get,
    update,
    logout,
}
