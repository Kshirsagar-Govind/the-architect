import express from 'express';
import {
    getVulnerabilities,
    createVulnerability,
    updateVulnerability,
    updateVulnerabilityStatus,
    updateVulnerabilitySeverity,
    deleteVulnerability,
} from '../controller/vulnerability.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { activityLogs } from '../middlewares/activityLog.middleware';

const router = express.Router();

// 🔹 Fetch all or specific vulnerabilities for a project
router.get('/:projectId', activityLogs, asyncHandler(getVulnerabilities));

// 🔹 Create a new vulnerability under a project
router.post('/:projectId', VerifyToken, activityLogs, asyncHandler(createVulnerability));

// 🔹 Update vulnerability details
router.put('/:projectId/:id', VerifyToken, activityLogs, asyncHandler(updateVulnerability));

// 🔹 Update only the status (open, in-progress, resolved, closed)
router.put('/:projectId/:id/update-status', VerifyToken, activityLogs, asyncHandler(updateVulnerabilityStatus));

// 🔹 Update only the severity (low, medium, high, critical)
router.put('/:projectId/:id/update-severity', VerifyToken, activityLogs, asyncHandler(updateVulnerabilitySeverity));

// 🔹 Delete a vulnerability
router.delete('/:projectId/:id', VerifyToken, activityLogs, asyncHandler(deleteVulnerability));

export default router;
