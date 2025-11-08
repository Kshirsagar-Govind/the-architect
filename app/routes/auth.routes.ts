import express from 'express';
import {
    userLogin,
    passwordReset,
    refreshToken,
    userLogout
} from '../controller/auth.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
let route = express.Router();

route.post('/login', asyncHandler(userLogin));
route.post('/logout', asyncHandler(userLogout));
route.post('/reset-password', VerifyToken, asyncHandler(passwordReset));
route.post('/refresh-token', asyncHandler(refreshToken));

export default route;
