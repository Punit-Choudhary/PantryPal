import { model, Schema, Types } from 'mongoose';
import { IRecipe } from '../interfaces/recipe.interface';

const recipeSchema = new Schema<IRecipe>({
    name: { type: String, required: true },
    posterImage: { type: String, required: true },
    backgroundImage: { type: String, required: true },
    shortDescription: { type: String, required: true },
    ingredients: [{
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
    }],
    steps: { type: [String], required: true },
});

export const Recipe = model<IRecipe>('Recipe', recipeSchema);
