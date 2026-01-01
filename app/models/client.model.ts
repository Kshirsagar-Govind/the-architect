import mongoose, { Schema, Document, Model } from 'mongoose';
import { generateUserId } from '../utils/generateID';
import { generateHash } from '../utils/generateHash';

export interface IClient extends Document {
  _id: mongoose.Types.ObjectId; 
  id: string;
  name: string;
  company?: string;
  email: string;
  password: string;
  accountStatus: string;
  phone?: string;
  address?: string;
  country?: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  hashPassword(): Promise<void>;
}

const ClientSchema: Schema<IClient> = new mongoose.Schema(
  {
    id: { type: String, default: generateUserId },
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountStatus: { type: String, enum: ['pending', 'active', 'blocked', 'deleted'], default:'pending' },
    phone: { type: String },
    address: { type: String },
    country: { type: String },
    website: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

ClientSchema.methods.hashPassword = async function () {
  this.password = await generateHash.call({ round: 10 }, this.password)
}

const ClientModel: Model<IClient> = mongoose.model<IClient>('Clients', ClientSchema);
export default ClientModel;
