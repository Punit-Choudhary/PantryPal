import express from 'express';
import * as ingredientController from '../controllers/ingredient.controller';

const router = express.Router();

router.get('/', ingredientController.getAllIngredients);
router.post('/', ingredientController.addNewIngredient);
router.get('/search', ingredientController.searchIngredientsByName);
router.get('/:id', ingredientController.getIngredientById);

export default router;
