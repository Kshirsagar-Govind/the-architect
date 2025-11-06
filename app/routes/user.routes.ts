import express from 'express';
import {
  createNewUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../controller/user.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
let route = express.Router();

route.get('/', getUsers);
route.post('/', VerifyToken, createNewUser);
route.put('/:id', VerifyToken, updateUser);
route.delete('/:id', VerifyToken, deleteUser);

export default route;
