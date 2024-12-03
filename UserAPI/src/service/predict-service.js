import { ResponseError } from "../error/response-error.js";
import axios from "axios";
import { config } from "dotenv";
config();

const predictApiUrl = process.env.PREDICT_API_URL;

const predictContent = async (text) => {
    try {
        const response = await axios.post(predictApiUrl, { text }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!response.data || !response.data.prediction) {
            throw new ResponseError(500, "Invalid prediction response");
        }

        return {
            prediction: response.data.prediction,
            probability: response.data.probability || null,
        };
    } catch (error) {
        throw new ResponseError(500, "Prediction failed");
    }
};

export default {
    predictContent,
};
