import { Document, Types } from "mongoose";

export interface IPantry extends Document{
    user: Types.ObjectId;
    ingredients: Array<{
        quantity: number;
        ingredient: Types.ObjectId;
        expiryDate: Date
    }>
}