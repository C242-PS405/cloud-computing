import scraperService from "../service/scraper-service.js";

const scraper = async (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        const userId = req.user.id;

        const result = await scraperService.scrapeFromUrl(url, userId);
        res.json({
            status: "success",
            code: 200,
            message: "URL analysis completed successfully",
            data: {
                prediction: result.prediction,
                isJudol: result.prediction === "Judi Online",
                url: url,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default {
    scraper,
};
