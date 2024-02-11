import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  isAccountVerified: boolean;
  pantry: Array<{
    ingredient: Types.ObjectId;
    expiryDate: Date;
  }>
}

export interface IAuthToken {
  token: string;
  generatedAt?: number;
  attempts?: number;
  user: IUser;
}