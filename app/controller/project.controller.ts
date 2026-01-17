import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import Project from '../models/project.model';
import ErrorHandler from '../utils/errorHandler';
import { prisma } from '../lib/prisma';
import { Environment, ProjectStatus } from '@prisma/client';

/**
 * GET /projects
 * Fetch all projects or filter by title/desc
 */
export async function getProject(req: Request, res: Response) {
  const { title, status, manager, member, client } = req.query;
  const id = req.query.id === 'string' ? req.user.id : '';
  const query: any = {};
  if (id) {
    const project = await prisma.project.findUnique({ where: { id } });
    return res.status(200).json({
      message: "Project fetched successfully",
      data: project,
    });
  }
  if(client){
    query.clientId = client;
  }

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (status) {
    query.status = status;
  }

  if (manager) {
    query.managerId = manager;
  }

  if (member) {
    query.members={some:{userId : { in: [member] }}};
  }

  const projects = await prisma.project.findMany({
    where: query,
    include: { client: true, manager: true, members: true }
  });

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
  // if (req.user?.role !== "ADMIN" || req.user?.role !== "MANAGER") {
  //   throw new ErrorHandler({
  //     statusCode: httpStatusCodes.UNAUTHORIZED,
  //     errorMessage: "Only admin can create a project.",
  //   });
  // }


  const {
    title,
    desc,
    projectType,
    clientId,
    managerId,
    members = [],
    status,
    scope,
    endpoints,
    testingTypes,
    appFile,
  } = req.body;
console.log(req.body.title,'+++++++++++++++++++', title, clientId, projectType);

  // 🔴 Required validations
  if (!title || !projectType || !clientId) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: "Missing required fields: title, projectType, or client.",
    });
  }

  // 🔴 projectType-based validation
  if (
    (projectType === "WEBSITE" || projectType === "WEB_APP") &&
    !scope?.websiteUrl
  ) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: "websiteUrl is required for website/web-app projects.",
    });
  }

  if (projectType === "API" && !scope?.baseApiUrl) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: "baseApiUrl is required for API projects.",
    });
  }

  if (projectType === "MOBILE_APP" && !appFile?.url) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: "App file is required for mobile-app projects.",
    });
  }

  const newProject = await prisma.project.create({
    data: {
      title,
      desc,
      projectType,
      clientId,
      managerId,
      members: {
        create: members.map((mem: any) => ({ userId: mem }))
      },
      scope: {
        create: scope
      },
      endpoints: { create: endpoints },
      testingTypes: { create: testingTypes.map((type: string) => ({
    type
  })) }
    }
  });

  return res.status(httpStatusCodes.CREATED).json({
    message: "New project created successfully",
    data: newProject,
  });
}


/**
 * PUT /projects/:id
 * Update an existing project using _id
 */
export async function updatedProject(req: Request, res: Response) {
  const { id } = req.params;
  const { title, desc, status } = req.body;

  if (!id) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Project ID is required.',
    });
  }

  const updated =
    await prisma.project.update({
      data: {
        title,
        desc,
        status
      },
      where: { id }
    })

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

export async function softDeleteProject(req: Request, res: Response) {

  if (req.user.role != 'CLIENT') {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Only client role can delete the project.',
    });
  }
  const { id } = req.params;
  const { title, desc, status } = req.body;

  if (!id) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Project ID is required.',
    });
  }

  const updated =
    await prisma.project.update({
      data: {
        status: ProjectStatus.DELETED
      },
      where: { id }
    })

  if (!updated) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Project not found.',
    });
  }

  return res.status(httpStatusCodes.OK).json({
    message: 'Project Deleted Successfully',
    data: updated,
  });
}

/**
 * DELETE /projects/:id
 * Delete a project using _id
 */
export async function deleteProject(req: Request, res: Response) {
  const { id } = req.params;

  if (req.user?.role !== 'ADMIN') {
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

  const projectExists = await prisma.project.findUnique({ where: { id } });

  if (!projectExists) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Project not found or already deleted.',
    });
  }

  const deleted = await prisma.project.delete({ where: { id } });

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
  console.log({ id, manager }, "<<<<<<<<<<<<< assignManager", req.user);

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

  const updated = await prisma.project.update(
    {
      data: {
        managerId: manager
      },
      where: { id }
    },
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
  const { members, manager, status } = req.body;
  console.log(req.body, "<<<<<<<<<<<<< assignMembers");

  if (req.user?.role !== 'ADMIN' && req.user?.role !== 'MANAGER') {
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
  let ids = members.map((mem: any) => ({userId:mem}) )
  console.log(ids,'=+=+=');        
  const updated = await prisma.project.update(
    {
      data:
      {
        members: {
          deleteMany:{},
          create: ids
        },
        managerId: manager,
        status: status
      },
      where: { id }
    },
  );

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
