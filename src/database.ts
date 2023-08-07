import * as mongodb from "mongodb";
import { Meal } from "./meal";
import { User } from "./user";

export const collections: {
    meals?: mongodb.Collection<Meal>;
    users?: mongodb.Collection<User>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackExample");
    await applySchemaValidation(db);

    const mealsCollection = db.collection<Meal>("meals");
    collections.meals = mealsCollection;

    const usersCollection = db.collection<User>("users");
    collections.users = usersCollection;
}

// Update our existing collection with JSON schema validation, so we know our documents will always match the shape of our Meal model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema1 = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "imgSource", "url"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                imgSource: {
                    bsonType: "string",
                    description: "'imgSource' is required and is a string"
                },
                url: {
                    bsonType: "string",
                    description: "'url' is required and is a string"
                },
                id: {
                    bsonType: "string",
                    description: "'id' is required and is a string"
                },
            },
        },
    };
    const jsonSchema2 = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "id", "idToken", "photoUrl"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string"
                },
                id: {
                    bsonType: "string",
                    description: "'id' is required and is a string"
                },
                idToken: {
                    bsonType: "string",
                    description: "'idToken' is required and is a string"
                },
                photoUrl: {
                    bsonType: "string",
                    description: "'photoUrl' is required and is a string"
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
    await db.command({
        collMod: "meals",
        validator: jsonSchema1
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("meals", {validator: jsonSchema1});
        }
    });

    await db.command({
        collMod: "users",
        validator: jsonSchema2
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("users", {validator: jsonSchema2});
        }
    });
}
