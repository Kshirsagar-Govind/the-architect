import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateBody = (schema: Joi.ObjectSchema) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      next(err);
    }
  };
