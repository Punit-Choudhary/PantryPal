import { Request, Response, NextFunction } from 'express';
import { Ingredient } from '../models/ingredient.model';
import { IIngredient } from '../interfaces/ingredient.interface';

// Get all ingredients
export const getAllIngredients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json({
            type: "success",
            message: "All available ingredients",
            data: {
                ingredients
            }
        });
    } catch (error) {
        next(error);
    }
};

// Add new ingredient
export const addNewIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newIngredient = await Ingredient.create(req.body);
        res.status(201).json({
            type: "success",
            message: "New ingredient added",
            data: {
                newIngredient
            }
        });
    } catch (error) {
        next(error);
    }
};

// Search ingredients with complete or incomplete name
export const searchIngredientsByName = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.query;
    try {
        const ingredients = await Ingredient.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).json({
            type: "success",
            message: "Found ingredients",
            data: {
                ingredients
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get specific ingredient using id
export const getIngredientById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            next({ status: 404, message: 'Ingredient not found' });
            return;
        }
        res.status(200).json(ingredient);
    } catch (error) {
        next(error);
    }
};
