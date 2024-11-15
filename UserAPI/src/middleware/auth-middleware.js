import jwt from 'jsonwebtoken';
import { prismaClient } from "../application/database.js";
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
            decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            // Handle berbagai error token
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
                email: true,
                token: true
            }
        });

        // Periksa apakah token di database sama dengan token yang dikirim
        if (!user.token || user.token !== token) {
            return res.status(401).json({
                errors: "Unauthorized: Invalid or expired token"
            });
        }

        // Attach user ke request
        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({
            errors: "Internal Server Error"
        });
    }
};