// utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Wraps async route handlers and forwards errors to the error middleware
export const asyncHandler = (fn: RequestHandler) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
