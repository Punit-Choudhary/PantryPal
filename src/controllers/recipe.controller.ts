import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../models/recipe.model';
import { Pantry } from '../models/pantry.model';
import { Types } from 'mongoose';
import { verifyJwtToken } from '../utils/token.util';

// Function to adjust quantity of ingredients in the pantry
const adjustPantryQuantity = async (recipeIngredients: Types.ObjectId[], userId: string, multiplier: number) => {
    try {
        // Fetch user's pantry inventory
        const pantry = await Pantry.findOne({ user: userId });
        if (!pantry) {
            throw new Error("Pantry not found");
        }
        
        // Iterate over recipe ingredients
        for (const ingredientId of recipeIngredients) {
            // Find the ingredient in the pantry
            const pantryItem = pantry.ingredients.find(item => item.ingredient.equals(ingredientId));
            if (!pantryItem) {
                throw new Error(`Ingredient ${ingredientId} not found in pantry`);
            }
            
            // Calculate the adjusted quantity based on recipe multiplier
            const adjustedQuantity = pantryItem.quantity - multiplier;
            if (adjustedQuantity < 0) {
                // Remove the ingredient from the pantry if quantity becomes negative
                pantry.ingredients = pantry.ingredients.filter(item => !item.ingredient.equals(ingredientId));
            } else {
                // Update the quantity of the ingredient in the pantry
                pantryItem.quantity = adjustedQuantity;
            }
        }
        
        // Save the updated pantry inventory
        await pantry.save();
    } catch (error) {
        throw error;
    }
};

// Controller to handle cooking a recipe
export const cookRecipe = async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId, multiplier, token } = req.body;

    try {
        const userId = verifyJwtToken(token, next);

        if (!userId) {
            return res.status(401).json({
                type: "error",
                message: "Unauthorized"
            });
        }
        // Fetch the recipe details
        const recipe = await Recipe.findById(recipeId).populate('ingredients');
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        
        // Get the ObjectIds of recipe ingredients
        const recipeIngredientIds = recipe.ingredients.map(ingredient => ingredient._id);
        
        // Adjust the quantity of ingredients in the pantry
        await adjustPantryQuantity(recipeIngredientIds, userId as string, multiplier);
        
        res.status(200).json({
            type: "success",
            message: "Recipe cooked successfully",
            data: {
                recipe
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json({
            type: "success",
            message: "All recipes fetched successfully",
            data: { recipes }
        });
    } catch (error) {
        next(error);
    }
};

// Function to create a new recipe
export const createRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, posterImage, backgroundImage, shortDescription, ingredients, steps } = req.body;
        const newRecipe = await Recipe.create({ name, posterImage, backgroundImage, shortDescription, ingredients, steps });
        res.status(201).json({
            type: "success",
            message: "Recipe created successfully",
            data: { recipe: newRecipe }
        });
    } catch (error) {
        next(error);
    }
};

// Function to find matching recipes based on ingredients in the pantry
export const findMatchingRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        const userId = verifyJwtToken(token, next);

        if (!userId) {
            return res.status(401).json({
                type: "error",
                message: "Unauthorized"
            });
        }
        // Fetch user's pantry inventory
        const pantry = await Pantry.findOne({ user: userId });
        if (!pantry) {
            return res.status(404).json({ message: "Pantry not found" });
        }

        // Get the list of ingredient names from the pantry
        const pantryIngredients = pantry.ingredients.map(item => item.ingredient.toString());

        // Fetch all recipes from the database
        const recipes = await Recipe.find();

        // Filter recipes based on matching ingredients in the pantry
        const matchingRecipes = recipes.filter(recipe => {
            // Get the list of ingredient names from the recipe
            const recipeIngredients = recipe.ingredients.map(ingredient => ingredient.toString());

            // Calculate the intersection of ingredients between the recipe and pantry
            const commonIngredients = recipeIngredients.filter(ingredient => pantryIngredients.includes(ingredient));

            // Check if the recipe has 70% or more of its ingredients in the pantry
            return (commonIngredients.length / recipeIngredients.length) * 100 >= 70;
        });

        res.status(200).json({
            type: "success",
            message: "Matching recipes found",
            data: { recipes: matchingRecipes }
        });
    } catch (error) {
        next(error);
    }
};