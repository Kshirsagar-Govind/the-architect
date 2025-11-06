import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import Logger from '../utils/logger';

export default function ErrorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const safeBody = { ...req.body };
  if (safeBody.password) safeBody.password = '[HIDDEN]';
  if (safeBody.token) safeBody.token = '[HIDDEN]';


  Logger.ERROR(`${err.message} | ${req.method} ${req.originalUrl} | IP: ${req.ip} | body: ${JSON.stringify(safeBody)}`);


  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({ message: err.errorMessage });
  }

  return res.status(500).json({ message: 'Internal Server Error', error: err.message });
}