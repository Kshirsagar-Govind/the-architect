import express from 'express';
import {
    userLogin,
    passwordReset,
    refreshToken,
    userLogout,
    fileUpload,
    forgetPassword
} from '../controller/auth.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { activityLogs } from '../middlewares/activityLog.middleware';
let route = express.Router();

route.post('/login', activityLogs, asyncHandler(userLogin));
route.post('/logout', asyncHandler(userLogout));
route.post('/reset-password', VerifyToken, asyncHandler(passwordReset));
route.post('/refresh-token', activityLogs, asyncHandler(refreshToken));
route.post('/file-upload', activityLogs, asyncHandler(fileUpload));
route.post('/forget-password', asyncHandler(forgetPassword));

export default route;
