import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../application/database.js";

const getLogs = async (userId, paramId, page, limit) => {
    if (!userId) {
        throw new ResponseError(400, "User ID is required");
    }

    if (paramId && paramId !== userId) {
        throw new ResponseError(403, "Unauthorized access to logs for this user");
    }

    // Pagination: hitung offset dan batas data
    const skip = (page - 1) * limit;

    const [userLogs, totalLogs] = await Promise.all([
        prismaClient.logActivity.findMany({
            where: {
                userId: paramId || userId, 
                status: "Judol", 
            },
            select: {
                id: true,
                siteName: true,
                status: true,
                timestamp: true,
            },
            orderBy: {
                timestamp: "desc", 
            },
            skip, 
            take: limit, 
        }),
        prismaClient.logActivity.count({
            where: {
                userId: paramId || userId,
                status: "Judol",
            },
        }),
    ]);

    if (userLogs.length === 0) {
        throw new ResponseError(404, "No logs found for this user");
    }

    return {
        data: userLogs,
        pagination: {
            totalItems: totalLogs,
            totalPages: Math.ceil(totalLogs / limit),
            currentPage: page,
            perPage: limit,
        },
    };
};

export default { 
    getLogs, 
};
