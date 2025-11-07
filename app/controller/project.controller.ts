import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import Project from '../models/project.model';
import ErrorHandler from '../utils/errorHandler';
import { generateAuthToken } from '../utils/generateHash';
import Logger from '../utils/logger';
export let Projects: Project[] = [];

export async function getProject(req: Request, res: Response) {
    const { title, desc } = req.query;
    if (!title && !desc) return res.status(httpStatusCodes.OK).json({ message: "Fetch", data: Projects });
    let found = Projects.filter(pr => pr.title.includes(String(title)) || pr.desc.includes(String(desc)))
    return res.status(httpStatusCodes.OK).json({ message: "Fetch", data: found });
}

export async function createProject(req: Request, res: Response) {
    const { title, desc, owner } = req.body;
    const members = req.body.members;
    if (!title || !desc || !owner || !members) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_REQUEST, errorMessage: 'Please provider complete detail' })
    let newProject = new Project({
        id: '',
        desc,
        members,
        owner,
        title,
        createdOn: new Date(),
        updatedOn: new Date(),
    });
    Projects.push(newProject);
    return res
        .status(httpStatusCodes.CREATED)
        .json({ message: 'New Project Created' });
}

export async function updatedProject(req: Request, res: Response) {
    const { title, desc, owner, members } = req.body;
    const { id } = req.params;
    if (!id) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_REQUEST, errorMessage: 'Please provider id' })
    let foundIndex = Projects.findIndex(pr => pr.id == id);
    if (foundIndex == -1) throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'Project Not Found' })
    Projects[foundIndex].title = title;
    Projects[foundIndex].desc = desc;
    Projects[foundIndex].owner = owner;
    Projects[foundIndex].members = members;
    return res
        .status(httpStatusCodes.OK)
        .json({ message: 'Project Updated' });
}

export async function deleteProject(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) throw new ErrorHandler({ statusCode: httpStatusCodes.BAD_GATEWAY, errorMessage: 'Please provider id' })
    let foundIndex = Projects.findIndex(pr => pr.id == id);
    if (foundIndex == -1) throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'Project Not Found' })
    Projects.splice(1, foundIndex);
    return res
        .status(httpStatusCodes.OK)
        .json({ message: 'Project Deleted' });
}