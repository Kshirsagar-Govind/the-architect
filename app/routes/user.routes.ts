import express from 'express';
import {
  createNewUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../controller/user.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { activityLogs } from '../middlewares/activityLog.middleware';
let route = express.Router();

route.get('/', activityLogs, asyncHandler(getUsers));
route.post('/', activityLogs, asyncHandler(createNewUser));
route.put('/:id', VerifyToken, activityLogs, asyncHandler(updateUser));
route.delete('/:id', VerifyToken, activityLogs, asyncHandler(deleteUser));

export default route;
