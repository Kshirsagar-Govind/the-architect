import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import User from '../models/user.model';
import ErrorHandler from '../utils/errorHandler';
import { generateAuthToken } from '../utils/generateHash';
import Logger from '../utils/logger';

export async function createNewUser(req: Request, res: Response) {
  let { name, email, password } = req.body;
  let userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.CONFLICT, errorMessage: 'Account already exists' });
  }
  const addNewUser = new User({
    name,
    email,
    password,
  });
  await addNewUser.hashPassword();
  await addNewUser.save();
  let token = await generateAuthToken({ id: addNewUser.id, email: addNewUser.email });
  return res
    .status(httpStatusCodes.CREATED)
    .json({ message: 'New User Created', token });

}

export async function getUsers(req: Request, res: Response, next: NextFunction) {

  const { id } = req.query;
  const email = String(req.query.email || '');
  const name = String(req.query.name || '');
  const Users = await User.find();
  if (Users.length == 0) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.NO_CONTENT, errorMessage: 'No Users available' })
  }

  if (id) {
    let found = await User.findOne({ id });
    if (found) return res.status(httpStatusCodes.OK).json({ message: 'Users fetched', data: found });
    else throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with given id:' + id });
  }

  if (email) {
    const found = await User.find({
      email: { $regex: email, $options: 'i' } // 'i' → case-insensitive
    });
    if (name) {
      const found = await User.find({
        name: { $regex: name, $options: 'i' } // 'i' → case-insensitive
      });
    }
    if (found) return res.status(httpStatusCodes.OK).json({ message: 'Users fetched', data: found });
    else throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with that email:' + email });
  }

  return res
    .status(httpStatusCodes.OK)
    .json({ message: 'Users fetched', data: Users });

}

export async function updateUser(req: Request, res: Response) {

  let { id } = req.params;
  let { name, email, password } = req.body;
  let userExists = await User.findOne({ id });

  if (!userExists) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with given id:' + id });
  }
  let updated = await User.findOneAndUpdate({
    id: id
  }, {
    name, email, password
  },
  {new: true})
  if (!updated) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_MODIFIED, errorMessage: 'Failed to update.' });
  }
  return res
    .status(httpStatusCodes.OK)
    .json({ message: `User detail updated`, data:updated });

}

export async function deleteUser(req: Request, res: Response) {
  let { id } = req.params;
  let userExists = await User.findOne({ id });

  if (!userExists) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with given id:' + id });
  }
  await User.deleteOne({ id })
  return res
    .status(httpStatusCodes.OK)
    .json({ message: `User with id ${id} is deleted` });
}