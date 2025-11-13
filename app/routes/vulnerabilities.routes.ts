import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import VulnerabilityModel from '../models/vulnerability.model';
import ErrorHandler from '../utils/errorHandler';
import Logger from '../utils/logger';

/**
 * @desc Get all vulnerabilities for a specific project
 * @route GET /api/vulnerability/:projectId
 */
export async function getVulnerabilities(req: Request, res: Response) {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Project ID is required',
    });
  }

  const vulnerabilities = await VulnerabilityModel.find({ projectId })
    .populate('reportedBy', 'name email')
    .populate('verifiedBy', 'name email')
    .sort({ createdAt: -1 });

  return res.status(httpStatusCodes.OK).json({
    message: 'Vulnerabilities fetched successfully',
    data: vulnerabilities,
  });
}

/**
 * @desc Create a new vulnerability for a project
 * @route POST /api/vulnerability/:projectId
 */
export async function createVulnerability(req: Request, res: Response) {
  const { projectId } = req.params;
  const {
    title,
    type,
    desc,
    stepToReproduce,
    severity,
    impact,
    recommendation,
    affectedEndpoint,
    proofOfConcept,
    attachments,
    tags,
  } = req.body;

  if (!projectId) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Project ID is required',
    });
  }

  if (!title || !type || !req.user?._id) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Missing required fields: title, type, or reporter',
    });
  }

  const newVulnerability = await VulnerabilityModel.create({
    title,
    type,
    desc,
    stepToReproduce,
    severity,
    impact,
    recommendation,
    affectedEndpoint,
    proofOfConcept,
    attachments,
    tags,
    reportedBy: req.user._id,
    projectId,
  });

  return res.status(httpStatusCodes.CREATED).json({
    message: 'Vulnerability created successfully',
    data: newVulnerability,
  });
}

/**
 * @desc Update vulnerability details
 * @route PUT /api/vulnerability/:projectId/:id
 */
export async function updateVulnerability(req: Request, res: Response) {
  const { id, projectId } = req.params;
  const updateData = req.body;

  if (!id || !projectId) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Vulnerability ID and Project ID are required',
    });
  }

  const updated = await VulnerabilityModel.findOneAndUpdate(
    { _id: id, projectId },
    updateData,
    { new: true }
  );

  if (!updated) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Vulnerability not found',
    });
  }

  return res.status(httpStatusCodes.OK).json({
    message: 'Vulnerability updated successfully',
    data: updated,
  });
}

/**
 * @desc Update vulnerability status
 * @route PUT /api/vulnerability/:projectId/:id/update-status
 */
export async function updateVulnerabilityStatus(req: Request, res: Response) {
  const { id, projectId } = req.params;
  const { status } = req.body;

  if (!id || !projectId) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Vulnerability ID and Project ID are required',
    });
  }

  if (!status) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Status is required',
    });
  }

  const updated = await VulnerabilityModel.findOneAndUpdate(
    { _id: id, projectId },
    { status, ...(status === 'resolved' && { resolvedAt: new Date() }) },
    { new: true }
  );

  if (!updated) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Vulnerability not found',
    });
  }

  return res.status(httpStatusCodes.OK).json({
    message: 'Vulnerability status updated successfully',
    data: updated,
  });
}

/**
 * @desc Update vulnerability severity
 * @route PUT /api/vulnerability/:projectId/:id/update-severity
 */
export async function updateVulnerabilitySeverity(req: Request, res: Response) {
  const { id, projectId } = req.params;
  const { severity } = req.body;

  if (!id || !projectId) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Vulnerability ID and Project ID are required',
    });
  }

  if (!severity) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.BAD_REQUEST,
      errorMessage: 'Severity is required',
    });
  }

  const updated = await VulnerabilityModel.findOneAndUpdate(
    { _id: id, projectId },
    { severity },
    { new: true }
  );

  if (!updated) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Vulnerability not found',
    });
  }

  return res.status(httpStatusCodes.OK).json({
    message: 'Vulnerability severity updated successfully',
    data: updated,
  });
}

/**
 * @desc Delete a vulnerability
 * @route DELETE /api/vulnerability/:projectId/:id
 */
export async function deleteVulnerability(req: Request, res: Response) {
  const { id, projectId } = req.params;

  if (req.user?.role !== 'admin') {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.UNAUTHORIZED,
      errorMessage: 'Only admins can delete vulnerabilities',
    });
  }

  const deleted = await VulnerabilityModel.deleteOne({ _id: id, projectId });

  if (deleted.deletedCount === 0) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.NOT_FOUND,
      errorMessage: 'Vulnerability not found or already deleted',
    });
  }

  return res.status(httpStatusCodes.OK).json({
    message: 'Vulnerability deleted successfully',
  });
}
