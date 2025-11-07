import express from 'express';
import {
    createProject,
    deleteProject,
    getProject,
    updatedProject
} from '../controller/project.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
let route = express.Router();

route.get('/', asyncHandler(getProject));
route.post('/', VerifyToken, asyncHandler(createProject));
route.put('/:id', VerifyToken, asyncHandler(updatedProject));
route.delete('/:id', VerifyToken, asyncHandler(deleteProject));

export default route;
