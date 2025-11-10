import mongoose, { Schema, Document, Model } from 'mongoose';
import { generateUserId } from '../utils/generateID';

export interface IClient extends Document {
  _id: mongoose.Types.ObjectId; 
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema<IClient> = new mongoose.Schema(
  {
    id: { type: String, default: generateUserId },
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true, unique: true },
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

const ClientModel: Model<IClient> = mongoose.model<IClient>('Clients', ClientSchema);
export default ClientModel;
