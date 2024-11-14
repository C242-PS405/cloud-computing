import jwt from 'jsonwebtoken';
import { prismaClient } from "../application/database.js";
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
config();


export const authMiddleware = async (req, res, next) => {

    try {
        // Ambil token dari header Authorization
        const authHeader = req.get('Authorization');
        
        // Periksa apakah token ada
        if (!authHeader) {
            return res.status(401).json({
                errors: "Unauthorized: No token provided"
            });
        }

        // Ekstrak token (support format "Bearer token")
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : authHeader;

        // Verifikasi token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            // Handle berbagai error token
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    errors: 'Token expired', 
                    message: 'Refresh token needed' 
                });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    errors: 'Invalid token' 
                });
            }
            return res.status(500).json({ 
                errors: 'Token verification failed' 
            });
        }

        // Cari user berdasarkan ID dari token
        const user = await prismaClient.user.findUnique({
            where: {
                id: decoded.userId // Sesuaikan dengan struktur payload
            },
            select: {
                // Pilih field yang aman untuk di-attach ke request
                id: true,
                name: true,
                email: true
            }
        });

        // Periksa apakah user ditemukan
        if (!user) {
            return res.status(401).json({
                errors: "Unauthorized: User not found"
            });
        }

        // Attach user ke request
        req.user = user;
        next();

    } catch (error) {
        // Tangani error yang tidak terduga
        // console.error('Auth Middleware Error:', error);
        res.status(500).json({
            errors: "Internal Server Error"
        });
    }
};

export const refreshTokenRateLimiter = rateLimit({
    // windowMs: 10 * 60 * 1000,
    windowMs: parseInt(process.env.REFRESH_TOKEN_WINDOW_MS, 10),
    max: 5, 
    message: 'Terlalu banyak percobaan refresh token'
});