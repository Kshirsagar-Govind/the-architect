import express from 'express';
import {
  createNewUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../controller/user.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
let route = express.Router();

route.get('/', asyncHandler(getUsers));
route.post('/', asyncHandler(createNewUser));
route.put('/:id', VerifyToken, asyncHandler(updateUser));
route.delete('/:id', VerifyToken, asyncHandler(deleteUser));

export default route;
