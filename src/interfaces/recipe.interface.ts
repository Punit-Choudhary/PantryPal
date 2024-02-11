import { Document, Types } from 'mongoose';

export interface IRecipe extends Document {
    name: string;
    posterImage: string;
    backgroundImage: string;
    shortDescription: string;
    ingredients: Types.ObjectId[];
    steps: string[];
}
