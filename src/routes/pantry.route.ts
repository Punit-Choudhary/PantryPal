import express from 'express';
import * as pantryController from '../controllers/pantry.controller';

const router = express.Router();

router.get('/', pantryController.getAllItemsInPantry);
router.get('/:id', pantryController.getItemFromPantryById);
router.get('/search', pantryController.searchIngredientsInPantryByName);
router.post('/', pantryController.addNewItemInPantry);
router.put('/:id', pantryController.updatePantryItem);
router.delete('/:id', pantryController.deleteItemFromPantry);
router.post('/processReceipt', pantryController.extractProductNamesFromReceipt);

export default router;
