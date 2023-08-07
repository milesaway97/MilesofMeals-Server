import * as mongodb from "mongodb";

export interface Meal {
    name: string
    imgSource: string
    url: string
    id: string
    _id?: mongodb.ObjectId
}

