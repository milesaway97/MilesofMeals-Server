import * as mongodb from "mongodb";

export interface User {
    name: string
    email: string
    id: string
    idToken: string
    photoUrl: string
    _id?: mongodb.ObjectId
}

