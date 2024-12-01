import { ResponseError } from "../error/response-error.js";
import UserAgent from '../utils/user-agent.js';
import { prismaClient } from "../application/database.js";
import cloudStorage from "../service/cloud-storage.js";
import axios from "axios";
import { load } from "cheerio";
import { URL } from "url";
import { config } from "dotenv";
config();

const predictApiUrl = process.env.PREDICT_API_URL;

const validateAndFormatUrl = (url) => {
    try {
        const formattedUrl = new URL(
            url.startsWith("http") ? url : `http://${url}`
        );
        return formattedUrl.href;
    } catch (err) {
        throw new ResponseError(400, "Invalid URL");
    }
};

const predictContent = async (text) => {
    try {
        const response = await axios.post(predictApiUrl, { text }, {
            // timeout: 5000, // Timeout untuk prediksi
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new ResponseError(500, "Prediction failed");
    }
};

const scrapeFromUrl = async (url, userId) => {
    if (!url) {
        throw new ResponseError(400, "URL is required");
    }

    // Validate and format the URL
    const formattedUrl = validateAndFormatUrl(url);
    try {
        const userAgent = UserAgent.getUserAgent();
        const response = await axios.get(formattedUrl, {
            timeout: 8000,
            headers: {
                'User-Agent': userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            },
        })
        // Proses prediksi dapat dilakukan secara asinkron
        const $ = load(response.data);
        const title = $("title").text().trim() || "";
        const description = $('meta[name="description"]').attr("content")?.trim() || "";
        const keywords = $('meta[name="keywords"]').attr("content")?.trim() || "";

        const combinedText = `${title} ${description} ${keywords}`.trim();

        if (!combinedText) {
            throw new ResponseError(404, "No content found for the given URL");
        }

        // Prediksi konten
        const predictionResult = await predictContent(combinedText);

        // Siapkan data untuk logging dan penyimpanan
        const jsonData = {
            url: formattedUrl,
            combinedText: combinedText,
            extractedAt: new Date().toISOString(),
            prediction: predictionResult.prediction
        };

        (async () => {
            try {
                const jsonString = JSON.stringify(jsonData, null, 2);
                // const fileName = `${userId}-${Date.now()}_${path.basename(formattedUrl)}.json`;
                const fileName = `${userId}-${Date.now()}_${new URL(formattedUrl).hostname}.json`;

                const folderPath = predictionResult.prediction === "Judi Online"
                    ? `judol/${fileName}`
                    : `non-judol/${fileName}`;

                // Upload file ke cloud storage
                await cloudStorage.uploadFile(
                    {
                        buffer: Buffer.from(jsonString, "utf-8"),
                        mimetype: "application/json"
                    },
                    folderPath
                );

                // Log aktivitas jika terdeteksi Judi Online
                if (predictionResult.prediction === "Judi Online") {
                    await prismaClient.logActivity.create({
                        data: {
                            userId: userId,
                            siteName: formattedUrl,
                            status: "Judol",
                        }
                    });
                }
            } catch (uploadError) {
                console.error("Background upload/logging failed:", uploadError);
            }
        })();

        // Kembalikan hasil prediksi
        return {
            prediction: predictionResult.prediction,
        };
    } catch (error) {
        if (error.response) {
            throw new ResponseError(
                error.response.status,
                `Failed to fetch the URL (status code: ${error.response.status})`
            );
        } else if (error.code === "ECONNABORTED") {
            throw new ResponseError(408, "Request timed out");
        } else if (error instanceof ResponseError) {
            throw error;
        } else {
            throw new ResponseError(500, "Blocked by Kominfo");
        }
    }
};

export default {
    scrapeFromUrl,
};
