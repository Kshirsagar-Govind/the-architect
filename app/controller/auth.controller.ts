import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import ErrorHandler from '../utils/errorHandler';
import { verifyPassword, generateAuthToken, generateHash, decodeJWTToken, generateForgetPasswordToken } from '../utils/generateHash';
import { sendMail } from '../services/email.service';
import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma';

export async function userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    let foundUser = await prisma.user.findUnique({ where: { email } });
    
    if (!foundUser) {
        throw new ErrorHandler({ errorMessage: "Invalid Credentials (email)", statusCode: httpStatusCodes.BAD_REQUEST })
    }
    const passwordCorrect = await verifyPassword(password, foundUser.password);
    if (!passwordCorrect) {throw new ErrorHandler({ errorMessage: "Invalid Credentials", statusCode: httpStatusCodes.BAD_REQUEST })}
    
    let token = await generateAuthToken({ id: foundUser.id, email: foundUser.email });
    let refresh_token = await generateAuthToken({ id: foundUser.id, email: foundUser.email });
    let findOldSession = await prisma.session.findFirst({ where:{userId: foundUser.id}})
    if(findOldSession){
        await prisma.session.update({ data:{refreshToken:refresh_token}, where:{userId: foundUser.id} });
    }else{
        await prisma.session.create({ data:{refreshToken:refresh_token, userId: foundUser.id} });
    }
    return res.status(httpStatusCodes.OK).json({ message: 'Loggin Successful', token, refresh_token })
}


export async function passwordReset(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const id = req.user?.id;
    //matching old and new password

    if (oldPassword == newPassword) throw new ErrorHandler({ errorMessage: "Old passowrd can not be same as new password", statusCode: httpStatusCodes.BAD_REQUEST })
    let foundUser = await prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
        throw new ErrorHandler({ errorMessage: "Invalid Credentials", statusCode: httpStatusCodes.BAD_REQUEST })
    }
    //verifying old password with existed password
    const passwordCorrect = await verifyPassword(oldPassword, foundUser.password);
    if (!passwordCorrect) throw new ErrorHandler({ errorMessage: "Provided passowrd is incorrect", statusCode: httpStatusCodes.BAD_REQUEST })

    //updating new with old password
    let hashed = await generateHash.call({ round: 10 }, newPassword);
    await prisma.user.update({
        data: { password: hashed },
        where: { id }
    })
    return res.status(httpStatusCodes.OK).json({ message: "Password updated successfully!" })
}

export async function refreshToken(req: Request, res: Response) {
    const { refresh_token } = req.body;

    let decoded = await decodeJWTToken(refresh_token);
    console.log(refresh_token,"<---refresh_token user--->>",req.user);
    
    let userFound = await prisma.user.findFirst({ where: { id: decoded.id } });
    if (!userFound) {
        throw new ErrorHandler({ errorMessage: "User not valid", statusCode: httpStatusCodes.NOT_FOUND })
    }

    let newRefreshToken = await generateAuthToken({ id: userFound.id, email: userFound.email });
    await prisma.session.update({
        data: { refreshToken: newRefreshToken },
        where: { userId: userFound.id }
    })

    let newAccessToken = await generateAuthToken({ id: userFound.id, email: userFound.email });
    return res.status(httpStatusCodes.OK).json({
        token: newAccessToken,
        refresh_token: newRefreshToken,
        message: "Token replaced"
    });
}

export async function userLogout(req: Request, res: Response) {
    
    let udpdated = await prisma.session.update({
        data: {
            refreshToken: "expired"
        }, where: {
            userId: req.user?.id
        }
    });
    console.log(udpdated, 'udpdated<- ->udpdated');
    return res.status(httpStatusCodes.OK).json({ message: "Logged out." })
}

export async function forgetPassword(req: Request, res: Response) {
    let { email } = req.body;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new ErrorHandler({ errorMessage: "User not found", statusCode: httpStatusCodes.NOT_FOUND });
    }
    let token = await generateForgetPasswordToken({ id: user.id, email: user.email });
    // Read the HTML template
    const template = fs.readFileSync(path.join(__dirname, '../emailTemplates/forgetPassword.html'), 'utf8');
    if (!template) {
        throw new ErrorHandler({ errorMessage: "Template not found!", statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR });
    }
    // Replace variables in template
    const htmlContent = template
        .replace(/{userName}/g, user.name || 'Dear')
        .replace(/{resetLink}/g, `${process.env.FRONTEND_URL}/reset-password?token=${token}`);

    // await sendMail(email,'' ,'Reset Your Password', htmlContent);
    return res.status(httpStatusCodes.OK).json({ message: "Password reset link sent to your email" });
}

export async function createHash(req: Request, res: Response) {
    const { text } = req.body;
    if (!text) {
        throw new ErrorHandler({ errorMessage: "Please provide valid text to hash", statusCode: httpStatusCodes.BAD_REQUEST })
    }
    const hashed = await generateHash.call({ round: 10 }, text);

    return res.status(httpStatusCodes.OK).json({ message: "Hashed text successfully", hashed });
}

// we will do it later
export async function fileUpload(req: Request, res: Response) {

}