import mongoose, { Document, Schema, Model, model, Types } from 'mongoose';
import { generateRowId } from '../utils/generateID';

interface IFeedback extends Document {
    authorId: Types.ObjectId;
    text: string;
    edited: boolean;
    deleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IFileVersion extends Document {
    fileUrl: string;
    uploadedAt: Date;
    notes?: string;
    feedback: Types.DocumentArray<IFeedback>;
}

export interface ITask extends Document {
    id: string;
    projectId: Types.ObjectId;
    owner: Types.ObjectId;
    title: string;
    desc: string;
    type: string;
    priority: 'low' | 'medium' | 'high';
    versions: Types.DocumentArray<IFileVersion>;
    status: 'assigned' | 'in-progress' | 'submitted' | 'approved' | 'rejected' | 'hold';
    dueDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
    {
        authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        edited: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const FileVersionSchema = new Schema<IFileVersion>({
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    feedback: [FeedbackSchema],
});

const TaskSchema: Schema<ITask> = new Schema(
    {
        id: { type: String, default: generateRowId },
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        desc: { type: String, default: '' },
        type: { type: String, default: '' },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        versions: [FileVersionSchema],
        status: {
            type: String,
            enum: ['assigned', 'in-progress', 'submitted', 'approved', 'rejected', 'hold'],
            default: 'assigned',
        },
        dueDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

const TaskModel: Model<ITask> = model<ITask>('Task', TaskSchema);
export default TaskModel;
