import { Storage } from '@google-cloud/storage';
import { config } from 'dotenv';
config();

// Inisialisasi Google Cloud Storage
const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEYFILE_PATH, // File kunci JSON
});

const bucketName = process.env.CLOUD_STORAGE_BUCKET_NAME;

// Fungsi untuk mengunggah file
const uploadFile = async (file, destination) => {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(destination);
    const stream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype || 'application/json',
        },
    });

    return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', async () => {
            await blob.makePublic(); 
            resolve(`https://storage.googleapis.com/${bucketName}/${destination}`);
        });
        stream.end(file.buffer);
    });
};


const deleteFile = async (fileName) => {
    try {
        await storage.bucket(bucketName).file(fileName).delete();
        // console.log(`File ${fileName} berhasil dihapus.`);
    } catch (error) {
        console.error(`Error menghapus file: ${error.message}`);
    }
};


export default {
    uploadFile,
    deleteFile
};
