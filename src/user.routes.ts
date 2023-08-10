import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const userRouter = express.Router();
userRouter.use(express.json());

// 'GET /users' endpoint retrieves all users in database
userRouter.get("/", async (_req, res) => {
    try {
        const users = await collections.users.find({}).toArray();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 'GET /users/:id' endpoint retrieves a single user by MongoDB object id
userRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        // const query = { _id: new mongodb.ObjectId(id) };
        const user = await collections.users.findOne({id: id});

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(`Failed to find a user: ID ${id}`);
        }

    } catch (error) {
        res.status(404).send(`Failed to find a user: ID ${req?.params?.id}`);
    }
});

// ‘POST /users’ endpoint creates a new user
userRouter.post("/", async (req, res) => {
    try {
        const user = req.body;
        console.log("const user = " + user);
        const result = await collections.users.insertOne(user);

        if (result.acknowledged) {
            res.status(201).send(`Created a new user: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

// ‘PUT /users/:id’ endpoint creates a new user if the user's id is not already in the collection
userRouter.put(":id", async (req, res) => {
    try {
        const userId = req?.params?.id;
        const user = req.body;
        // const query = { _id: new mongodb.ObjectId(id) };
        // const result = await collections.users.updateOne(query, { $set: user });

        const result = await collections.users.updateOne(
            { id: userId },
            {
                $setOnInsert: user
            },
            { upsert: true }
        );
        
        if (result.acknowledged) {
            res.status(200).send(`Created a new user: ID ${userId}.`);
        } else {
            res.status(304).send(`Failed to create a new user: ID ${userId}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// ‘DELETE /users/:id’ endpoint deletes an existing user
userRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.users.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a user: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a user: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a user: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
