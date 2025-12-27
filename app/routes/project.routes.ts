import express from 'express';
import {
    createProject,
    deleteProject,
    getProject,
    updatedProject,
    assignManager,
    assignMembers,
} from '../controller/project.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { activityLogs } from '../middlewares/activityLog.middleware';
let route = express.Router();

route.get('/', activityLogs, asyncHandler(getProject));
route.post('/', VerifyToken, activityLogs, asyncHandler(createProject));
route.put('/:id', VerifyToken, activityLogs, asyncHandler(updatedProject));
route.delete('/:id', VerifyToken, activityLogs, asyncHandler(deleteProject));
route.put('/:id/assign-manager', VerifyToken, activityLogs, asyncHandler(assignManager));
route.put('/:id/assign-members', VerifyToken, activityLogs, asyncHandler(assignMembers));

export default route;
