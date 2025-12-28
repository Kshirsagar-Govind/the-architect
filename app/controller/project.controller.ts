import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import Project from '../models/project.model';
import ErrorHandler from '../utils/errorHandler';

/**
 * GET /projects
 * Fetch all projects or filter by title/desc
 */
export async function getProject(req: Request, res: Response) {
  const { title, id, status, manager, member } = req.query;

  if (id) {
    const project = await Project.findById(id)
      .populate("client")
      .populate("manager")
      .populate("members");

    return res.status(200).json({
      message: "Project fetched successfully",
      data: project,
    });
  }

  const query: any = {};

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (status) {
    query.status = status;
  }

  if (manager) {
    query.manager = manager;
  }

  if (member) {
    query.members = { $in: [member] };
  }

  const projects = await Project.find(query)
    .populate("client")
    .populate("manager")
    .populate("members");

  return res.status(200).json({
    message: "Projects fetched successfully",
    data: projects,
  });
}


/**
 * POST /projects
 * Create a new project
 */
export async function createProject(req: Request, res: Response) {
  if (req.user?.role !== 'admin') {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.UNAUTHORIZED,
      errorMessage: 'Only admin can create a project.',
    });
  }

  const { title, desc, manager, client, members = [], projectType, appFile } =
    req.body;

  if (!title || !manager || !client) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Missing required fields: title, manager, or client.',
    });
  }

  const newProject = await Project.create({
    title,
    desc,
    manager,
    client,
    members,
    projectType,
    appFile,
  });

  return res.status(httpStatusCodes.CREATED).json({
    message: 'New project created successfully',
    data: newProject,
  });
}

/**
 * PUT /projects/:id
 * Update an existing project using _id
 */
export async function updatedProject(req: Request, res: Response) {
  const { id } = req.params;
  const { title, desc, manager, members, client, projectType, appFile, status } = req.body;

  if (!id) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Project ID is required.',
    });
  }

  const updated = await Project.findByIdAndUpdate(
    id,
    { title, desc, manager, members, client, projectType, appFile, status },
    { new: true }
  );

  if (!updated) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Project not found.',
    });
  }

  return res.status(httpStatusCodes.OK).json({
    message: 'Project updated successfully',
    data: updated,
  });
}

/**
 * DELETE /projects/:id
 * Delete a project using _id
 */
export async function deleteProject(req: Request, res: Response) {
  const { id } = req.params;

  if (req.user?.role !== 'admin') {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.UNAUTHORIZED,
      errorMessage: 'Only admin can delete a project.',
    });
  }

  if (!id) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Project ID is required.',
    });
  }

  const deleted = await Project.findByIdAndDelete(id);

  if (!deleted) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Project not found or already deleted.',
    });
  }

  return res
    .status(httpStatusCodes.OK)
    .json({ message: 'Project deleted successfully' });
}

/**
 * PATCH /projects/:id/assign-manager
 * Assign a new manager to a project using _id
 */
export async function assignManager(req: Request, res: Response) {
  const { id } = req.params;
  const { manager } = req.body;
  console.log(req.user,id,'==============req.user');
  
  if (req.user?.role !== 'ADMIN') {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.UNAUTHORIZED,
      errorMessage: 'Only admin can assign project managers.',
    });
  }

  if (!id || !manager) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Project ID and manager ID are required.',
    });
  }

  const updated = await Project.findByIdAndUpdate(
    id,
    { manager },
    { new: true }
  );

  if (!updated) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Project not found.',
    });
  }

  return res.status(httpStatusCodes.OK).json({
    message: 'Project manager assigned successfully',
    data: updated,
  });
}


export async function assignMembers(req: Request, res: Response) {
  const { id } = req.params;
  const { members } = req.body;

  if (req.user?.role !== 'admin' && req.user?.role !== 'manager') {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.UNAUTHORIZED,
      errorMessage: 'Only admin and manager can assign members to projects.',
    });
  }

  if (!id || !members || !Array.isArray(members)) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Project ID and members array are required.',
    });
  }

  const updated = await Project.findByIdAndUpdate(
    id,
    { members },
    { new: true }
  ).populate('members').populate('manager').populate('client');

  if (!updated) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Project not found.',
    });
  }

  return res.status(httpStatusCodes.OK).json({
    message: 'Members assigned to the project successfully',
    data: updated,
  });
}
