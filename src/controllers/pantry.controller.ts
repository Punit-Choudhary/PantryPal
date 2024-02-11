import { Request, Response, NextFunction } from 'express';
import { Pantry } from '../models/pantry.model';
import { AZURE_ENDPOINT, AZURE_KEY } from '../config';
import axios from 'axios';
// import { IPantry } from '../interfaces/pantry.interface';

// Get all items in pantry
export const getAllItemsInPantry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await Pantry.find();
        res.status(200).json({
          type: "success",
          message: "All items in pantry",
          data: {
            items
          }
        });
    } catch (error) {
        next(error);
    }
};

// Get specific item from pantry (using id)
export const getItemFromPantryById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await Pantry.findById(id);
        if (!item) {
          next({ status: 404, message: 'Item not found in pantry' });
          return;
        }
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

// Search ingredients with complete or incomplete name in pantry
export const searchIngredientsInPantryByName = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.query;
    try {
        const items = await Pantry.find().populate({
            path: 'ingredients',
            match: { name: { $regex: name, $options: 'i' } }
        });
        res.status(200).json({
          type: "success",
          message: "Item in pantry",
          data: {
            items
          }
        });
    } catch (error) {
        next(error);
    }
};

// Add new item in pantry
export const addNewItemInPantry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newItem = await Pantry.create(req.body);
        res.status(201).json({
          type: "success",
          message: "New item added",
          data: {
            newItem
          }
        });
    } catch (error) {
        next(error);
    }
};

// Update pantry item
export const updatePantryItem = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const updatedItem = await Pantry.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
          type: "success",
          message: "Item updated successfully",
          data: {
            updatedItem
          }
        });
    } catch (error) {
        next(error);
    }
};

// Delete item from pantry
export const deleteItemFromPantry = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const deletedItem = await Pantry.findByIdAndDelete(id);
        if (!deletedItem) {
          next({ status: 404, message: "Item not found in pantry" });
          return;
        }
        res.status(200).json({
          type: "success",
          message: "Item deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const extractProductNamesFromReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
      // Check if image file exists in the request body
      if (!req.file) {
          return res.status(400).json({ message: "Image file not provided" });
      }

      // Get the image file from the request
      const imageFile = req.file.buffer;

      const azureEndpoint = AZURE_ENDPOINT;
      const azureApiKey = AZURE_KEY;

      // Send the image to Azure Document Reading API for processing
      const response = await axios.post(`${azureEndpoint}/vision/v3.0/read/analyze`, imageFile, {
          headers: {
              'Content-Type': 'application/octet-stream',
              'Ocp-Apim-Subscription-Key': azureApiKey
          }
      });

      // Extract product names from the API response
      const extractedProductNames: string[] = [];
      const readResults = response.data?.analyzeResult?.readResults;

      if (readResults && readResults.length > 0) {
          for (const readResult of readResults) {
              for (const line of readResult.lines) {
                  // Extract product names based on specific patterns or keywords
                  if (line.text.toLowerCase().includes('product') || line.text.toLowerCase().includes('item')) {
                      // Example: Extracting product names from lines containing 'Product' or 'Item' keyword
                      extractedProductNames.push(line.text.replace(/product|item/gi, '').trim());
                  }
              }
          }
      }

      // Send the extracted product names as response
      res.status(200).json({
          type: "success",
          message: "Product names extracted from receipt",
          data: { productNames: extractedProductNames }
      });
  } catch (error) {
      // Handle errors
      // console.error("Error extracting product names from receipt:", error);
      // res.status(500).json({ message: "Error extracting product names from receipt" });
      next({ status: 500, message: "Error extracting product names from receipt"});
  }
};