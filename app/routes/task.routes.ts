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

route.get('/tasks', activityLogs, asyncHandler(getTasks));
route.post('/task', VerifyToken, activityLogs, asyncHandler(createTask));
route.put('/task/:id', VerifyToken, activityLogs, asyncHandler(updateTask));
route.put('/assign-task', VerifyToken, activityLogs, asyncHandler(assignTask));
route.post('/task/:id/upload-art', VerifyToken, activityLogs, asyncHandler(uploadArt));


export default route;
