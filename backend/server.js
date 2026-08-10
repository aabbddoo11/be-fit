import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Router from "./routes/index.js";
import connectDB from "./config/db.js";
dotenv.config();
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
app.use(logger)
app.use(cors());
app.use(express.json());
app.use('/api',Router)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function main() {
    await connectDB();

    app.listen(PORT, "0.0.0.0",() => {
        console.log(`Server running on port ${PORT}`);
    });
}

main();