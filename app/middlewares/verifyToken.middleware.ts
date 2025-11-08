import { Response, Request, NextFunction } from 'express';
import httpStatusCodes from 'http-status-codes';
import User, { IUser } from '../models/user.model';
import { decodeJWTToken } from '../utils/generateHash';
const jwt = require('jsonwebtoken');

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}
export default function VerifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let authorization = req.headers['authorization'] || '';
    if (!authorization) {
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ message: 'NO TOKEN' });
    }
    
    let token = authorization.split(' ')[1];
    const secretKey = process.env.SECRET_KEY || 'your_secret_key';
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        return res
          .status(httpStatusCodes.BAD_REQUEST)
          .json({ message: 'INVALLID TOKEN' });
      }
      req.user = decoded;
      next();
    });
  } catch (err: any) {
    return res
      .status(httpStatusCodes.BAD_REQUEST)
      .json({ message: 'INVALLID TOKEN' });
  }
}
