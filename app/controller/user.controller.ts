import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import User from '../models/user.model';
let Users: User[] = [];

export function createNewUser(req: Request, res: Response) {
  try {
    let { name, email, password } = req.body;
    let userExists = Users.find((u) => u.email == email);
    if (userExists) {
      return res
        .status(httpStatusCodes.CONFLICT)
        .json({ message: 'Account already exists' });
    }
    const newUser = new User({
      id: 'NA',
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    newUser.hashPassowrd();
    return res
      .status(httpStatusCodes.CREATED)
      .json({ message: 'New User Created' });
  } catch (err: any) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
}

export function deleteUser(req: Request, res: Response) {
  try {
    let { id } = req.params;
    let userExists = Users.find((u) => u.id == id);
    if (!userExists) {
      res
        .status(httpStatusCodes.NOT_FOUND)
        .json({ message: 'No Account exists with given id' });
    }
    let deleteIndex = Users.findIndex((u) => u.id == id);
    Users.splice(deleteIndex, 1);
    return res
      .status(httpStatusCodes.OK)
      .json({ message: `User with id ${id} is deleted` });
  } catch (err: any) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
}

export function updateUser(req: Request, res: Response) {
  try {
    let { id } = req.params;
    let { name } = req.body;
    let userExists = Users.find((u) => u.id == id);
    if (!userExists) {
      res
        .status(httpStatusCodes.NOT_FOUND)
        .json({ message: 'No Account exists with given id' });
    }
    let updateIndex = Users.findIndex((u) => u.id == id);
    Users[updateIndex].name = name;
    Users[updateIndex].updatedAt = new Date();
    return res
      .status(httpStatusCodes.OK)
      .json({ message: `User detail updated` });
  } catch (err: any) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
}

export function getUsers(req: Request, res: Response) {
  try {
    if (Users.length == 0) {
      return res
        .status(httpStatusCodes.NO_CONTENT)
        .json({ message: 'No Users available' });
    }
    return res
      .status(httpStatusCodes.OK)
      .json({ message: 'Users fetched', data: Users });
  } catch (err: any) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
}
