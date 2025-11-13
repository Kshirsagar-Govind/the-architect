import mongoose, { Document, Model, Schema } from "mongoose";
import { generateVulnerabilityId } from '../utils/generateID';

export interface IVulnerability extends Document {
    id: string;
    title: string;
    type: string;
    desc: string;
    stepToReproduce: string;
    severity: "low" | "medium" | "high" | "critical";
    status: "open" | "in-progress" | "resolved" | "closed";
    impact?: string;
    recommendation?: string;
    affectedEndpoint?: string;
    proofOfConcept?: string[];
    attachments?: {
        fileName: string;
        fileUrl: string;
        fileType: "image" | "video" | "ppt" | "pdf" | "other";
        size?: number;
        uploadedAt?: Date;
    }[];
    tags?: string[];
    reportedBy: mongoose.Types.ObjectId;
    verifiedBy?: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    resolvedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


const VulnerabilitySchema = new mongoose.Schema({
    id: { type: String, default: generateVulnerabilityId },
    title: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, default: '' },
    stepToReproduce: { type: String, default: '' },
    severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium",
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "duplicate", "resolved", "closed"],
        default: "open",
    },
    impact: { type: String },
    recommendation: { type: String },
    affectedEndpoint: { type: String },
    proofOfConcept: [{ type: String }],
    attachments: [
        {
            fileName: { type: String },
            fileUrl: { type: String }, // S3 / Cloudinary / CDN link
            fileType: {
                type: String,
                enum: ["image", "video", "ppt", "pdf", "other"],
                default: "image",
            },
            size: { type: Number }, // bytes
            uploadedAt: { type: Date, default: Date.now },
        },
    ],
    tags: [{ type: String }],
    reportedBy: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    verifiedBy: { type: mongoose.Types.ObjectId, ref: "Users" },
    projectId: { type: mongoose.Types.ObjectId, ref: "Projects", required: true },
    resolvedAt: { type: Date },
}, { timestamps: true });


const VulnerabilitiesModel: Model<IVulnerability> = mongoose.model<IVulnerability>('Vulerabilities', VulnerabilitySchema)
export default VulnerabilitiesModel;