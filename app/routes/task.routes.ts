import express from 'express';
import {
    getTasks,
    createTask,
    updateTask,
    assignTask,
    uploadArt
} from '../controller/task.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { activityLogs } from '../middlewares/activityLog.middleware';
let route = express.Router();

route.get('/:projectId', activityLogs, asyncHandler(getTasks));
route.post('/:projectId/', VerifyToken, activityLogs, asyncHandler(createTask));
route.put('/:taskId', VerifyToken, activityLogs, asyncHandler(updateTask));
route.put('/assign/:taskId', VerifyToken, activityLogs, asyncHandler(assignTask));
route.post('/:taskId/art', VerifyToken, activityLogs, asyncHandler(uploadArt));


export default route;
