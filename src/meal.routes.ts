import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const mealRouter = express.Router();
mealRouter.use(express.json());

// 'GET /meals' endpoint retrieves all meals in database
mealRouter.get("/", async (_req, res) => {
    try {
        const meals = await collections.meals.find({}).toArray();
        res.status(200).send(meals);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 'GET /meals/usermeals/:userId' endpoint retrieves all of user's meals in database
mealRouter.get("/usermeals/:userId", async (_req, res) => {
    try {
        const userId = _req?.params?.userId;
        const meals = await collections.meals.find(
            { id: userId }).toArray();
        console.log(userId);
        console.log(meals);
        res.status(200).send(meals);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 'GET /meals/:id' endpoint retrieves a single meal by MongoDB object id
mealRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const meal = await collections.meals.findOne(query);

        if (meal) {
            res.status(200).send(meal);
        } else {
            res.status(404).send(`Failed to find a meal: ID ${id}`);
        }

    } catch (error) {
        res.status(404).send(`Failed to find a meal: ID ${req?.params?.id}`);
    }
});

// ‘POST /meals’ endpoint creates a new meal
mealRouter.post("/", async (req, res) => {
    try {
        const meal = req.body;
        const result = await collections.meals.insertOne(meal);

        if (result.acknowledged) {
            res.status(201).send(`Created a new meal: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new meal.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

// ‘PUT /meals/:id’ endpoint updates an existing meal
mealRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const meal = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.meals.updateOne(query, { $set: meal });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an meal: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an meal: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an meal: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// ‘DELETE /meals/:id’ endpoint deletes an existing meal
mealRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.meals.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a meal: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a meal: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a meal: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
