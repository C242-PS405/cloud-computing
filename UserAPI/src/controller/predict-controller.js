import predictService from "../service/predict-service.js";

const predict = async (req, res, next) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;

        const result = await predictService.predictContent(text, userId);
        
        res.json({
            status: "success",
            statusCode: 200,
            message: "Text analysis completed successfully",
            data: {
                prediction: result.prediction, 
                isGambling: result.prediction === "Judi Online", 
                probability: result.probability || null, 
                details: {
                    originalText: text, 
                    userId: userId 
                }
            }
        });
    } catch (error) {
        next({
            status: "error",
            statusCode: error.statusCode || 500,
            message: error.message || "Prediction process failed",
            details: error.details || null
        });
    }
};

export default {
    predict,
};