import { mealRouter } from "./meal.routes.js";
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database.js";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        const express = require("express");
        const app = express();
        const PORT = process.env.PORT || 3030;

        app.use(cors());
        app.use("/meals", mealRouter);

        // start the Express server
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        });

    })
    .catch(error => console.error(error));
