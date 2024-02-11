import { model, Schema, Types } from 'mongoose';
import {IPantry } from '../interfaces/pantry.interface';

const pantrySchema = new Schema<IPantry>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ingredients: [{
    ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true, default: 1 },
  }]
});

export const Pantry =  model<IPantry>('Pantry', pantrySchema);
