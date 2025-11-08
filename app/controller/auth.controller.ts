/*
import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import User from '../models/user.model';
import ErrorHandler from '../utils/errorHandler';
import { verifyPassword, generateAuthToken, generateHash } from '../utils/generateHash';

export async function userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    let foundUser = Users.find(us => us.email == email);
    if (!foundUser) {
        throw new ErrorHandler({ errorMessage: "Invalid Credentials", statusCode: httpStatusCodes.BAD_REQUEST })
    }
    const passwordCorrect = await verifyPassword(password, foundUser.password);
    if (!passwordCorrect) throw new ErrorHandler({ errorMessage: "Invalid Credentials", statusCode: httpStatusCodes.BAD_REQUEST })
    let token = await generateAuthToken({ id: foundUser.id, email: foundUser.email })
    return res.status(httpStatusCodes.OK).json({ message: 'Loggin Successful', token })
}

export async function passwordReset(req: Request, res: Response) {
    const { email, oldPassword, newPassword } = req.body;
    //matching old and new password
    if (oldPassword == newPassword) throw new ErrorHandler({ errorMessage: "Old passowrd can not be same as new password", statusCode: httpStatusCodes.BAD_REQUEST })
    let foundUser = Users.find(us => us.email == email);
    if (!foundUser) {
        throw new ErrorHandler({ errorMessage: "Invalid Credentials", statusCode: httpStatusCodes.BAD_REQUEST })
    }
    //verifying old password with existed password
    const passwordCorrect = await verifyPassword(oldPassword, foundUser.password);
    if (!passwordCorrect) throw new ErrorHandler({ errorMessage: "Provided passowrd is incorrect", statusCode: httpStatusCodes.BAD_REQUEST })

    let index = Users.findIndex(us => us.id == foundUser.id);

    //updating new with old password
    Users[index].password = await generateHash.call({ round: 10 }, newPassword);
    return res.status(httpStatusCodes.OK).json({ message: "Password updated successfully!" })
}

export async function refreshToken(req: Request, res: Response) { 
    const {refreshToken, authToken} = req.body;
    
}

export async function userLogout(req: Request, res: Response) { }
*/