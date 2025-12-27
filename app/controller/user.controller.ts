import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import User from '../models/user.model';
import ErrorHandler from '../utils/errorHandler';
import { generateAuthToken } from '../utils/generateHash';
import Logger from '../utils/logger';

export async function createNewUser(req: Request, res: Response) {
  let { name, email, password, role } = req.body;
  let userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.CONFLICT, errorMessage: 'Account already exists' });
  }
  const addNewUser = new User({
    name,
    email,
    password,
    role,
  });
  await addNewUser.hashPassword();
  await addNewUser.save();
  let token = await generateAuthToken({ id: addNewUser.id, email: addNewUser.email });
  return res
    .status(httpStatusCodes.CREATED)
    .json({ message: 'New User Created', token });

}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  const { id, email, name, role } = req.query;

  // If ID is provided, return single user
  if (id) {
    const found = await User.findOne({ id });
    if (found) {
      return res.status(httpStatusCodes.OK).json({ message: 'User fetched', data: found });
    } else {
      throw new ErrorHandler({ 
        statusCode: httpStatusCodes.NOT_FOUND, 
        errorMessage: 'No User found with given id: ' + id 
      });
    }
  }

  // Build query object for filtering
  const query: any = {};

  if (email) {
    query.email = { $regex: String(email), $options: 'i' }; // case-insensitive
  }

  if (name) {
    query.name = { $regex: String(name), $options: 'i' }; // case-insensitive
  }

  if (role) {
    query.role = String(role); // Exact match for role
  }

  // Execute query
  const users = Object.keys(query).length > 0 
    ? await User.find(query)
    : await User.find();

  if (users.length === 0) {
    throw new ErrorHandler({ 
      statusCode: httpStatusCodes.NO_CONTENT, 
      errorMessage: 'No Users found matching the criteria' 
    });
  }

  return res
    .status(httpStatusCodes.OK)
    .json({ message: 'Users fetched successfully', data: users });
}

export async function updateUser(req: Request, res: Response) {

  let { id } = req.params;
  let { name, email, password, role, accountStatus } = req.body;
  let userExists = await User.findById(id);

  if (!userExists) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with given id:' + id });
  }
  let updated = await User.findByIdAndUpdate(id, {
    name, email, password, role, accountStatus
  },
  {new: true});
  console.log(updated,'updated============');
  
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