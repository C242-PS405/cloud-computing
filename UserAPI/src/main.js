import { app } from "./application/app.js";
import { logger } from "./application/logging.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
});