import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INotifications {
    id: mongoose.Schema.Types.ObjectId;
    notification: string;
    user_id: mongoose.Schema.Types.ObjectId;
    seen: boolean;
    type: string;
    meta: Object;
    expiresAt: Date;
}

let NotificationSchema: Schema<INotifications> = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    notification: { type: String, rerquired: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seen: { type: Boolean, default: false },
    type: { type: String, enum: ["info", "success", "warning", "error", "promo"], default: "info" },
    meta: { type: Object, default:{} },
    expiresAt: { type: Date },
},
    {
        timestamps: true,
    }
)

let NotificationModel: Model<INotifications> = mongoose.model<INotifications>('Notifications', NotificationSchema);
export default NotificationModel;