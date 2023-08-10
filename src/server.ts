import { mealRouter } from "./meal.routes";
import { userRouter } from "./user.routes";
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

// const express = require("express");

connectToDatabase(ATLAS_URI)
    .then(() => {
        const PORT = 3000;
        // const express = require("express");
        // const mealRouter = require("./meal.routes");
        // const userRouter = require("./user.routes");
        const app = express();
        app.use(cors());
        app.use("/users", userRouter);
        app.use("/meals", mealRouter);

        // start the Express server
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        });

    })
    .catch(error => console.error(error));
