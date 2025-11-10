import mongoose, { Document, Schema, Model, model } from 'mongoose';
import { generateRowId } from '../utils/generateID';

interface IFileVersion {
    fileUrl: string;
    uploadedAt: Date;
    notes?: string;
}

interface IFeedback {
    authorId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}

interface ITask extends Document {
    id: string;
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true };
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true };
    title: string;
    desc: string;
    type: string;
    priority: 'low' | 'medium' | 'high';
    feedback: IFeedback[];
    attachement: IFileVersion[];
    status: 'assigned' | 'in-progress' | 'submitted' | 'approved' | 'rejected' | 'hold';
    dueDate: Date;
}

const taskSchema: Schema<ITask> = new Schema({
    id: { type: String, default: generateRowId() },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    desc: { type: String, default: '' },
    type: { type: String, default: '' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    feedback: [
        {
            authorId: { type: Schema.Types.ObjectId, ref: 'User' },
            text: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
    attachement: [
        {
            fileUrl: { type: String, default: '' },
            notes: { type: String, default: '' },
            uploadedAt: Date,
        }
    ],
    status: {
        type: String,
        enum: ['assigned', 'in-progress', 'submitted', 'approved', 'rejected', 'hold'],
        default: 'assigned',
    },
    dueDate: { type: Date, default: Date.now() }
}, {
    timestamps: true
})

const taskModel: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
export default taskModel;