// testConnection.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    try {
        // Coba ambil data dari tabel users
        const users = await prisma.user.findMany();
        console.log('Koneksi berhasil! Pengguna:', users);
    } catch (error) {
        console.error('Koneksi gagal:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();