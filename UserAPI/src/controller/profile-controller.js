// profile-controller.js
import cloudStorage from '../service/cloud-storage.js';
import { prismaClient } from "../application/database.js";

const updateProfilePicture = async (req, res, next) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            throw new Error('No file uploaded');
        }

        // Ambil data user untuk mengetahui URL foto lama
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { profilePic: true, lastProfileUpdate: true },
        });

        const now = new Date();
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

        if (user.lastProfileUpdate && (now - user.lastProfileUpdate < oneWeekInMs)) {
            return res.status(403).json({
                message: 'Anda hanya dapat mengganti foto profil sekali dalam seminggu.',
            });
        }

        // Hapus foto lama dari Cloud Storage jika ada
        if (user?.profilePic) {
            const oldFileName = user.profilePic.split('/').pop();
            await cloudStorage.deleteFile(`profile_pictures/${oldFileName}`);
        }

        // Upload file baru ke Cloud Storage
        const fileName = `profile_pictures/${userId}-${Date.now()}-${req.file.originalname}`;
        const fileUrl = await cloudStorage.uploadFile(req.file, fileName);

        // Update URL di database
        const updatedUser = await prismaClient.user.update({
            where: { id: userId },
            data: { 
                profilePic: fileUrl,
                lastProfileUpdate: now 
            },
            select: { id: true, name: true, profilePic: true },
        });

        res.status(200).json({
            message: 'Profile picture updated successfully',
            data: updatedUser,
        });
    } catch (e) {
        next(e);
    }
};

export default {
    updateProfilePicture
};