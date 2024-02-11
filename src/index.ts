import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express, { Express, Request, Response, NextFunction } from 'express';
import { MONGODB_URI, NODE_ENV, PORT } from './config';
import morgan from 'morgan';
import { IError } from './interfaces/error.interface';
import { NOT_FOUND, SERVER_ERROR } from './errors';
import mongoose from 'mongoose';

import authRoute from './routes/auth.route';
import ingredientRoute from './routes/ingredient.route';
import pantryRoute from './routes/pantry.route';
import multer from 'multer';

const app: Express = express();

app.use(express.json());

if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(upload.single('image'));

// routes
app.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({
        type: 'success',
        message: 'Pong 🏓'
    });
});


app.use('/auth', authRoute);
app.use('/ingredient', ingredientRoute);
app.use('/pantry', pantryRoute);

// routes ends

// ---------------- Error Handling --------------------
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error: IError = {
      status: 404,
      message: NOT_FOUND
    };
  
    next(error);
  });
  
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || SERVER_ERROR;

    console.log(message);
  
    res.status(status).json({
      type: 'error',
      message
    });
  
    next();
  });
  // -------------- Error Handling Ends -----------------


  async function main() {
    try {
      await mongoose
        .connect(MONGODB_URI)
        .then(() => {
          console.log('Connected with MongoDB ✅');
        })
        .catch((err) => {
          console.error(`Failed to connect to MongoDB. Error: ${err}`);
        });
  
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT} 🚀`);
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
  
  main();