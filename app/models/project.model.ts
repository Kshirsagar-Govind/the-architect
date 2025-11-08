import { generateProjectId } from "../utils/generateID";
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IProject extends Document {
    id: string;
    title: string;
    desc: string;
    owner: string;
    members: Array<string>;
}

const ProjectSchema: Schema<IProject> = new mongoose.Schema({
    id: { type:String, default:generateProjectId },
    title: { type: String, required:true },
    desc: { type: String, default: '' },
    owner: { type: String, default: '' },
    members: { type: [String], default: [] }
},
  {
    timestamps: true
  }
)

const ProjectModel: Model<IProject> = mongoose.model<IProject>('Projects', ProjectSchema, 'ProjectManagement');
export default ProjectModel;