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
        let Projects = await Project.find({});
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
    const { title, desc, owner } = req.body;
    const members = req.body.members;
    if (!title || !desc || !owner) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_REQUEST, errorMessage: 'Please provider complete detail' })
    let newProject = {
        desc,
        members,
        owner,
        title,
    };
    await Project.create(newProject);
    return res
        .status(httpStatusCodes.CREATED)
        .json({ message: 'New Project Created' });
}

export async function updatedProject(req: Request, res: Response) {
    const { title, desc, owner, members } = req.body;
    const { id } = req.params;
    if (!id) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_REQUEST, errorMessage: 'Please provider id' })
    let updated = await Project.findOneAndUpdate({ id }, { title, desc, owner, members },{new:true})
    return res
        .status(httpStatusCodes.OK)
        .json({ message: 'Project Updated', data:updated });
}

export async function deleteProject(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_GATEWAY, errorMessage: 'Please provider id' })
    await Project.deleteOne({ id });
    return res
        .status(httpStatusCodes.OK)
        .json({ message: 'Project Deleted' });
}