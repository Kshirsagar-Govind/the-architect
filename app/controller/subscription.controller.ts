import { Request, Response } from "express";
import SubscriptionModel from "../models/subscription.mode"
import httpStatusCode from 'http-status-codes';
import ErrorHandler from "../utils/errorHandler";
import CreditsModel from "../models/credits.model";

export async function purchasePlan(req: Request, res: Response) {
    const { clientId } = req.params;
    const { plan, paymentStatus } = req.body;
    if (clientId || plan) {
        throw new ErrorHandler({ statusCode: httpStatusCode.BAD_REQUEST, errorMessage: "Provide Client ID and Plan type!" })
    }
    await SubscriptionModel.create({ clientId, plan, paymentStatus });
    return res.status(httpStatusCode.CREATED).json({ message: "Plan purchased" })
}

export async function getPlan(req: Request, res: Response) {
    const { clientId } = req.params;
    if (clientId) {
        throw new ErrorHandler({ statusCode: httpStatusCode.BAD_REQUEST, errorMessage: "Client ID not provided !" })
    }
    let subscriptions = await SubscriptionModel.find({ clientId })
    return res.status(httpStatusCode.OK).json({ message: "Fetched!", data: subscriptions })
}

export async function updatePlanPaymentStatus(req: Request, res: Response) {
    const { subscriptionId } = req.params;
    await SubscriptionModel.findByIdAndUpdate(subscriptionId, {
        boughtOn: new Date(),
        paymentStatus: 'paid'
    })
}

export async function addCredits(req: Request, res: Response) {
    const { clientId } = req.params;
    const { amount, statement } = req.body;

    const credits = await CreditsModel.findOne({ clientId });
    if (!credits) throw new ErrorHandler({ statusCode: httpStatusCode.OK, errorMessage: "Credits account not found" });

    await credits.addCredits(amount);

    await credits.save();

    return res.status(httpStatusCode.OK).json({ message: "Credits added!" });
}


export async function deductCredits(req: Request, res: Response) {
    const { clientId } = req.params;
    const { amount, statement } = req.body;

    const credits = await CreditsModel.findOne({ clientId });
    if (!credits) throw new ErrorHandler({ statusCode: httpStatusCode.OK, errorMessage: "Credits account not found" });

    await credits.deductCredits(amount, statement);

    await credits.save();

    return res.status(httpStatusCode.OK).json({ message: "Credits deducted!" });
}