import { generateHash } from '../utils/generateHash';
import { generateUserId } from '../utils/generateID';
import mongoose, { Schema, Document, Model } from 'mongoose';
export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  hashPassword(): Promise<void>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  id: { type: String, default: generateUserId },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'member'], default: 'member' },
  password: { type: String, required: true },
},
  {
    timestamps: true
  }
);

UserSchema.methods.hashPassword = async function () {
  this.password = await generateHash.call({ round: 10 }, this.password)
}

const UserModel: Model<IUser> = 
mongoose.model<IUser>('Users', UserSchema);
export default UserModel;