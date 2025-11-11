import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import Project from '../models/project.model';
import ErrorHandler from '../utils/errorHandler';
import { generateAuthToken } from '../utils/generateHash';
import Logger from '../utils/logger';
// export let Projects: Project[] = [];

export async function getProject(req: Request, res: Response) {
    const { title, desc } = req.query;

    if (!title && !desc) {
        let Projects = await Project.find();
        return res.status(httpStatusCodes.OK).json({ message: "Fetch", data: Projects });
    }
    let found = await Project.find(
        {
            $or: [
                { title: { $regex: title } },
                { desc: { $regex: desc } }
            ]
        })
    return res.status(httpStatusCodes.OK).json({ message: "Fetch", data: found });
}

export async function createProject(req: Request, res: Response) {
    const { title, desc, manager, client } = req.body;

    if (req.user?.role != 'admin') {
        throw new ErrorHandler({ statusCode: httpStatusCodes.UNAUTHORIZED, errorMessage: "Only admin can delete the project, please request admin for project deletion" })
    }
    const members = req.body.members;
    if (!title || !desc || !manager) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_REQUEST, errorMessage: 'Please provider complete detail' })
    let newProject = {
        desc,
        members,
        client,
        manager,
        title,
    };
    await Project.create(newProject);
    return res
        .status(httpStatusCodes.CREATED)
        .json({ message: 'New Project Created' });
}

export async function updatedProject(req: Request, res: Response) {
    const { title, desc, manager, members, client } = req.body;
    const { id } = req.params;
    if (!id) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_REQUEST, errorMessage: 'Please provider id' })
    let updated = await Project.findByIdAndUpdate({_id:id} , { title, desc, manager, members, client }, { new: true })
    return res
        .status(httpStatusCodes.OK)
        .json({ message: 'Project Updated', data: updated });
}

export async function deleteProject(req: Request, res: Response) {
    const { id } = req.params;
    if (req.user?.role != 'admin') {
        throw new ErrorHandler({ statusCode: httpStatusCodes.UNAUTHORIZED, errorMessage: "Only admin can delete the project, please request admin for project deletion" })
    }
    if (!id) throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'Please provider id' })
    let deleted = await Project.deleteOne({ id });
    if (deleted.deletedCount == 0) throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'Project not deleted, invalid Project ID' })
    return res
        .status(httpStatusCodes.OK)
        .json({ message: 'Project Deleted' });
}

export async function assignManager(req: Request, res: Response) {
    if (req.user?.role != 'admin') {
        throw new ErrorHandler({ statusCode: httpStatusCodes.UNAUTHORIZED, errorMessage: "Only admin can delete the project, please request admin for project deletion" })
    }
    const { manager } = req.body;
    const { id } = req.params;
    if (!id) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_REQUEST, errorMessage: 'Please provider id' })
    let updated = await Project.findOneAndUpdate({ id }, { manager }, { new: true })
    return res
        .status(httpStatusCodes.OK)
        .json({ message: 'Project manager assigned', data: updated });
}
