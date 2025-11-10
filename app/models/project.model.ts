import { generateProjectId } from "../utils/generateID";
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  id: string;
  title: string;
  desc: string;
  client: mongoose.Types.ObjectId;   
  manager: mongoose.Types.ObjectId;   
  members: mongoose.Types.ObjectId[];  
}

const ProjectSchema: Schema<IProject> = new mongoose.Schema({
  id: { type: String, default: generateProjectId },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  manager: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'Users', default: [] }],
},
  {
    timestamps: true
  }
)

const ProjectModel: Model<IProject> = mongoose.model<IProject>('Projects', ProjectSchema);
export default ProjectModel;