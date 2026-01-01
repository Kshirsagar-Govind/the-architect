import { generateProjectId } from "../utils/generateID";
import mongoose, { Schema, Document, Model } from 'mongoose';
import ClientModel from "./client.model";
import UserModel from "./user.model";

export interface IProject extends Document {
  id: string;
  title: string;
  desc: string;

  projectType: "website" | "web-app" | "mobile-app" | "api";

  client: mongoose.Types.ObjectId;
  manager?: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];

  status: "hold" | "inactive" | "in-progress" | "completed";

  scope: {
    websiteUrl?: string;          // https://example.com
    baseApiUrl?: string;          // https://api.example.com

    allowedDomains?: string[];
    blockedUrls?: string[];

    environment: "prod" | "staging" | "dev";

    authRequired: boolean;
    testAccounts?: {
      username: string;
      password: string;
      role?: string;
    }[];
  };

  endpoints?: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    description?: string;
  }[];

  appFile?: {
    name: string;
    url: string;
    size: number;
    uploadedAt: Date;
  };

  testingTypes: (
    | "vapt"
    | "web-security"
    | "api-security"
    | "auth-testing"
    | "business-logic"
  )[];

  createdAt: Date;
  updatedAt: Date;
}


const ProjectSchema: Schema<IProject> = 
new mongoose.Schema(
  {
    id: { type: String, default: generateProjectId },

    title: { type: String, required: true },
    desc: { type: String, default: "" },

    projectType: {
      type: String,
      enum: ["website", "web-app", "mobile-app", "api"],
      required: true,
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: ClientModel,
      required: true,
    },

    manager: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      default: null,
    },

    members: [
      { type: Schema.Types.ObjectId, ref: UserModel }
    ],

    status: {
      type: String,
      enum: ["hold", "inactive", "in-progress", "completed"],
      default: "inactive",
    },

    scope: {
      websiteUrl: { type: String },
      baseApiUrl: { type: String },

      allowedDomains: [{ type: String }],
      blockedUrls: [{ type: String }],

      environment: {
        type: String,
        enum: ["prod", "staging", "dev"],
        default: "prod",
      },

      authRequired: { type: Boolean, default: false },

      testAccounts: [
        {
          username: { type: String },
          password: { type: String },
          role: { type: String },
        },
      ],
    },

    endpoints: [
      {
        method: {
          type: String,
          enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        },
        path: { type: String },
        description: { type: String },
      },
    ],

    appFile: {
      name: { type: String },
      url: { type: String },
      size: { type: Number },
      uploadedAt: { type: Date, default: Date.now },
    },

    testingTypes: [
      {
        type: String,
        enum: [
          "vapt",
          "web-security",
          "api-security",
          "auth-testing",
          "business-logic",
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);


// ProjectSchema.path('appFile').default({});
const ProjectModel: Model<IProject> = 
mongoose.model<IProject>('Projects', ProjectSchema);
export default ProjectModel;