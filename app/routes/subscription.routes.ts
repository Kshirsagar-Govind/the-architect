import express from 'express';
import {
    purchasePlan,
    getPlan,
    updatePlanPaymentStatus,
    addCredits,
    deductCredits
} from '../controller/subscription.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { activityLogs } from '../middlewares/activityLog.middleware';
let route = express.Router();

route.get(
    '/subscription/:clientId',
    activityLogs, asyncHandler(getPlan));

route.post(
    '/subscription/:clientId/',
    VerifyToken, activityLogs, asyncHandler(purchasePlan));

route.patch(
    '/subscription/:subscriptionId',
    VerifyToken, activityLogs, asyncHandler(updatePlanPaymentStatus));

route.patch(
    '/credit/:clientId',
    VerifyToken, activityLogs, asyncHandler(addCredits));

route.patch(
    '/credit/:clientId',
    VerifyToken, activityLogs, asyncHandler(deductCredits));

export default route;
