import express from 'express';
import * as recipeController from '../controllers/recipe.controller';

const router = express.Router();

router.get('/', recipeController.getAllRecipes);
router.post('/', recipeController.createRecipe);
router.post('/cook', recipeController.cookRecipe);

export default router;
