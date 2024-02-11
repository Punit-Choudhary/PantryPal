import { model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String},
    phone: { type: String, required: true },
    isAccountVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);
export default User;