import mongoose, { Document, Model, Schema } from "mongoose";
import ClientModel from "./client.model";
import CreditsModel from "./credits.model";
import { PLAN_FEATURES } from "../constants/plan/plan";

export interface ISubscription extends Document {
    clientId: Schema.Types.ObjectId;
    plan: 'basic' | 'standard' | 'advanced';
    boughtOn: Date;
    paymentStatus: "in-progress" | "cancelled" | "paid";
}

const SubscriptionSchema = new mongoose.Schema<ISubscription>({
    clientId: { type: Schema.Types.ObjectId, ref: ClientModel, required: true },
    plan: { type: String, enum: ['basic', 'standard', 'advanced'], default: 'standard' },
    boughtOn: { type: Date, default: Date.now },
    paymentStatus: {
        type: String,
        enum: ["in-progress", "cancelled", "paid"],
        default: "in-progress",
    }
}, {
    timestamps: true,
});

SubscriptionSchema.post('save', async function (doc, next) {
    try {
        let credits = await CreditsModel.findOne({ clientId: doc.clientId });
        if (!credits) {
            let cred = PLAN_FEATURES[doc.plan].credits;
            await CreditsModel.create({
                clientId: doc.clientId,
                subscriptionId: doc._id,
                balance: cred,
                history: [{
                    statement: `On purchasing the ${doc.plan} plan, ${cred} added to your credits balance !`,
                    amount: cred,
                }]
            })
        }
        next();
    } catch (err: any) {
        next(err);
    }
});

const SubscriptionModel: Model<ISubscription> =
    mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default SubscriptionModel;
