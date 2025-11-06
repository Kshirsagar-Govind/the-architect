import { NextFunction, Request, Response } from "express";
import ErrorHandler from '../utils/errorHandler';
import Logger from '../utils/logger';

export default function ErrorHandlerMiddleware(
  err: ErrorHandler | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  Logger.ERROR(err.message || 'Unknown error occurred');

  if (err instanceof ErrorHandler) {
    return res
      .status(err.statusCode)
      .json({ message: err.errorMessage || 'An error occurred' });
  }

  return res
    .status(500)
    .json({ message: 'Internal Server Error', error: err.message });
}
