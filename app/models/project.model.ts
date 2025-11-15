import { generateProjectId } from "../utils/generateID";
import mongoose, { Schema, Document, Model } from 'mongoose';
import ClientModel from "./client.model";
import UserModel from "./user.model";

export interface IProject extends Document {
  id: string;
  title: string;
  desc: string;
  projectType: string,
  client: mongoose.Types.ObjectId;
  manager: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  appFile: {
    name: string,
    url: string,
    size: number,
    uploadedAt: Date,
  };
}

const ProjectSchema: Schema<IProject> = new mongoose.Schema({
  id: { type: String, default: generateProjectId },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  projectType: {
    type: String,
    enum: ["web", "mobile", "product"],
    default: "web",
  },
  client: { type: Schema.Types.ObjectId, ref: ClientModel, required: true },
  manager: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: UserModel, default: [] }],
  appFile: {
    name: { type: String },
    url: { type: String },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
    default: {},
  }
},
  {
    timestamps: true
  }
)
// ProjectSchema.path('appFile').default({});
const ProjectModel: Model<IProject> = mongoose.model<IProject>('Projects', ProjectSchema);
export default ProjectModel;