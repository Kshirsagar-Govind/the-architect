import { NextFunction, Request, Response } from "express";
import ActivityLogModel from "../models/activityLog.model";
import httpStatusCode from 'http-status-codes';

export async function activityLogs(
    req: Request,
    res: Response,
    next: NextFunction) {
    try {
        if (req.path === '/' || req.path.includes('favicon')) return next();
        let url = req.originalUrl;  // asking resourse
        let email = (req as any).user?.email || "Guest";// user email
        let ip = req.ip; // user email
        let method = req.method; // user email
        // --- sanitize body ---
        const sanitizedBody = { ...req.body };
        const sensitiveKeys = ["password", "token", "accessToken", "refresh_token", "otp"];
        for (const key of sensitiveKeys) {
            if (sanitizedBody[key]) sanitizedBody[key] = "hidden";
        }
        let body= JSON.stringify(sanitizedBody)
        let activity = new ActivityLogModel({ url, email, ip, method, body });
        activity.save();
        next();
    } catch (error) {
        res.status(httpStatusCode.BAD_REQUEST).json({ message: error })
    }
}