import { Request, Response } from "express";
import TaskModel, { ITask } from '../models/tasks.model';
import ErrorHandler from "../utils/errorHandler";
import httpStatusCode from "http-status-codes";


export async function getTasks(req: Request, res: Response) {
    let {
        projectId,
        owner,
        title,
        type,
        priority,
        status
    } = req.query;
    let data = [];
    if (owner) {
        data = await TaskModel.find({
            owner: { $regex: owner, $options: 'i' },
            projectId
        });
    }
    else if (priority) {
        data = await TaskModel.find({
            priority: { $regex: priority, $options: 'i' }, projectId
        });
    }
    else if (status) {
        data = await TaskModel.find({
            status: { $regex: status, $options: 'i' }, projectId
        });
    } else if (title) {
        data = await TaskModel.find({
            title: { $regex: title, $options: 'i' }, projectId
        });
    }
    else if (type) {
        data = await TaskModel.find({
            type: { $regex: type, $options: 'i' }, projectId
        });
    } else data = await TaskModel.find({ projectId });
    res.status(200).json({ success: true, data });

}
export async function createTask(req: Request, res: Response) {
    let {
        projectId,
        owner,
        title,
        dueDate
    } = req.body;
    if (!projectId || !owner || !title || !owner || !dueDate) {
        throw new ErrorHandler({ statusCode: httpStatusCode.BAD_REQUEST, errorMessage: 'Provide all details to create a task' })
    }
    let created = await TaskModel.create(req.body);
    if (!created) {
        throw new ErrorHandler({ statusCode: httpStatusCode.INTERNAL_SERVER_ERROR, errorMessage: 'Something went wrong' })
    }
    return res.status(httpStatusCode.CREATED).json({ message: "New task created" })
}
export async function updateTask(req: Request, res: Response) {
    let {
        taskId, owner, title, desc, type, priority, feedback, attachement, status, dueDate
    } = req.body;
    const { id } = req.params;

    await TaskModel.updateOne({
        id
    }, {
        taskId, owner, title, desc, type, priority, feedback, attachement, status, dueDate
    })
}
export async function updateTaskStatus(req: Request, res: Response) {
    let { status } = req.body;
    const { id } = req.params;
    await TaskModel.updateOne({ id }, { status })
}
export async function updateTaskPriority(req: Request, res: Response) {
    let { priority } = req.body;
    const { id } = req.params;
    await TaskModel.updateOne({ id }, { priority })
}

export async function assignTask(req: Request, res: Response) {
    let { owner } = req.body;
    const { id } = req.params;
    await TaskModel.updateOne({ id }, { owner })
}

export const uploadArt = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fileUrl, notes } = req.body;

    const task = await TaskModel.findById(id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const newVersion = {
        fileUrl,
        uploadedAt: new Date(),
        notes: notes || '',
        feedback: [] // starts with empty feedback array
    };

    task.versions.push(newVersion);
    await task.save();

    return res.status(201).json({ message: "Art uploaded successfully", task });
};

export const addFeedback = async (req: Request, res: Response) => {
    const { taskId, versionId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    const task = await TaskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const version = task.versions.id(versionId);
    if (!version) return res.status(404).json({ message: "Version not found" });

    version.feedback.push({ authorId: userId, text });
    await task.save();

    res.status(201).json({ message: "Feedback added", version });
};

