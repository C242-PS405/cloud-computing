import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import { loginUserValidation, registerUserValidation, updateUserValidation, getUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
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

    // Menggunakan variabel lingkungan untuk waktu kedaluwarsa
    const accessTokenExpiry = parseInt(process.env.ACCESS_TOKEN_EXPIRY); // Default 20 menit
    const refreshTokenExpiry = parseInt(process.env.REF_TOKEN_EXPIRY); // Default 1 hari

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: accessTokenExpiry
    });
    const refreshToken = jwt.sign(payload, process.env.REF_TOKEN_SECRET, {
        expiresIn: refreshTokenExpiry
    });

    // Hitung waktu kedaluwarsa untuk refresh token
    const expiresAt = new Date(Date.now() + refreshTokenExpiry * 1000);

    await prismaClient.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: expiresAt
        }
    });

    return {
        name: user.name,
        accessToken: accessToken,
        cookies: {
            refreshToken: {
                value: refreshToken,
                options: {
                    httpOnly: true,
                    maxAge: refreshTokenExpiry * 1000,
                    // secure: true, // aktifkan untuk https saja
                    // sameSite: "none"
                }
            }
        }

    };
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


const refreshToken = async (req) => {
    const cookieRefreshToken = req.cookies?.refreshToken;

    if (!cookieRefreshToken) {
        throw new ResponseError(401, "No refresh token provided");
    }
    // Verifikasi token JWT
    const decoded = jwt.verify(cookieRefreshToken, process.env.REF_TOKEN_SECRET);

    // Cari token di database
    const refreshTokenEntry = await prismaClient.refreshToken.findUnique({
        where: {
            token: cookieRefreshToken,
            userId: decoded.userId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    // Validasi token di database
    if (!refreshTokenEntry) {
        throw new ResponseError(401, "Invalid refresh token");
    }

    // Periksa masa berlaku token
    if (new Date() > refreshTokenEntry.expiresAt) {
        // Hapus token yang expired
        await prismaClient.refreshToken.delete({
            where: {
                id: refreshTokenEntry.id
            }
        });
        throw new ResponseError(401, "Refresh token has expired");
    }

    // Validasi payload tambahan
    if (!decoded.userId || decoded.userId !== refreshTokenEntry.userId) {
        throw new ResponseError(401, "Invalid token payload");
    }

    // Generate ulang access token
    const payload = {
        userId: refreshTokenEntry.user.id,
        name: refreshTokenEntry.user.name,
        email: refreshTokenEntry.user.email
    };

    const accessTokenExpiry = parseInt(process.env.ACCESS_TOKEN_EXPIRY);

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: accessTokenExpiry
    });

    return {
        name: refreshTokenEntry.user.name,
        accessToken: accessToken
    };
}

const update = async (req) => {
    const user = validate(updateUserValidation, req);

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "User is not found");
    }

    const data = {}
    if (user.name) {
        data.name = user.name
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    })
}

const logout = async (id, cookieRefreshToken) => {
    if (!cookieRefreshToken) {
        throw new ResponseError(401, "No refresh token provided");
    }

    const refreshTokenEntry = await prismaClient.refreshToken.findUnique({
        where: {
            token: cookieRefreshToken,
            userId: id
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    });

    // Validasi token di database
    if (!refreshTokenEntry) {
        throw new ResponseError(401, "Invalid refresh token");
    }

    // Hapus token dari pengguna
    return prismaClient.user.update({
        where: {
            id: id // Menggunakan id pengguna
        },
        data: {
            refreshTokens: {
                delete: {
                    id: refreshTokenEntry.id // Menghapus refresh token yang sesuai
                }
            }
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
    refreshToken
}