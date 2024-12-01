import historyService from "../service/history-service.js";

const getLogs = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const paramId = req.params.id ? parseInt(req.params.id) : null;
        const { page = 1, limit = 10 } = req.query; 

        const logs = await historyService.getLogs(userId, paramId, parseInt(page), parseInt(limit));
        res.status(200).json({
            status: 'success',
            code: 200,
            message: "User logs retrieved successfully",
            data: logs.data,
        });
    } catch (e) {
        next(e);
    }
};

export default {
    getLogs
};
