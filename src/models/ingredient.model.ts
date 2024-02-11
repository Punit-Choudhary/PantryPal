import { Schema, model } from "mongoose";
import { IIngredient } from "../interfaces/ingredient.interface";

const ingredientSchema = new Schema<IIngredient>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    shelfLife: { type: Number, required: true },
    itemType: { type: String, required: true }
});
  
export const Ingredient =  model<IIngredient>('Ingredient', ingredientSchema);