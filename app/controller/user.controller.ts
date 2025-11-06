import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import User from '../models/user.model';
import ErrorHandler from '../utils/errorHandler';
import { generateAuthToken } from '../utils/generateHash';
import Logger from '../utils/logger';
export let Users: User[] = [];

export async function createNewUser(req: Request, res: Response) {

  let { name, email, password } = req.body;
  let userExists = Users.find((u) => u.email == email);
  if (userExists) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.CONFLICT, errorMessage: 'Account already exists' });
  }

  const newUser = new User({
    id: 'NA',
    name,
    email,
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await newUser.hashPassword();
  let token = "";
  token = await generateAuthToken({ id: newUser.id, email: newUser.email });
  return res
    .status(httpStatusCodes.CREATED)
    .json({ message: 'New User Created', token });

}

export function getUsers(req: Request, res: Response, next: NextFunction) {

  const { id } = req.query;
  const email = String(req.query.email || '');

  if (Users.length == 0) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.NO_CONTENT, errorMessage: 'No Users available' })
  }

  if (id) {
    let found = Users.find(u => u.id == id);
    if (found) return res.status(httpStatusCodes.OK).json({ message: 'Users fetched', data: found });
    else throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with given id:' + id });
  }

  if (email) {
    let found = Users.filter(u => u.email.includes(email));
    if (found) return res.status(httpStatusCodes.OK).json({ message: 'Users fetched', data: found });
    else throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with that email:' + email });
  }

  return res
    .status(httpStatusCodes.OK)
    .json({ message: 'Users fetched', data: Users });

}

export function updateUser(req: Request, res: Response) {

  let { id } = req.params;
  let { name, email, password } = req.body;
  let userExists = Users.find((u) => u.id == id);
  if (!userExists) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with given id:' + id });
  }
  let updateIndex = Users.findIndex((u) => u.id == id);
  Users[updateIndex].name = name;
  Users[updateIndex].email = email;
  Users[updateIndex].password = password;
  Users[updateIndex].updatedAt = new Date();

  return res
    .status(httpStatusCodes.OK)
    .json({ message: `User detail updated` });

}

export async function deleteUser(req: Request, res: Response) {
  let { id } = req.params;
  let userExists = Users.find((u) => u.id == id);

  if (!userExists) {
    throw new ErrorHandler({ statusCode: httpStatusCodes.NOT_FOUND, errorMessage: 'No User found with given id:' + id });
  }
  let deleteIndex = Users.findIndex((u) => u.id == id);
  Users.splice(deleteIndex, 1);
  return res
    .status(httpStatusCodes.OK)
    .json({ message: `User with id ${id} is deleted` });
}