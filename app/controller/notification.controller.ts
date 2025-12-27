import { Request, Response } from 'express';
import NotificationModel, { INotifications } from '../models/notification.model';
import mongoose from 'mongoose';
// import {producer}  from '../kafka/producers'
interface notification {
    notification: string;
    user_id: mongoose.Schema.Types.ObjectId;
    type: string;
    meta: Object;
    expiresAt: Date;
}

export const sendNotification=async(notificationData:notification)=>{
    let { notification, user_id} = notificationData;
    let expiringDate = new Date().getDate()+24;
    expiringDate = expiringDate;

    let newNotification = new NotificationModel({
        notification,
        user_id,
        type:"info",
        expiresAt:expiringDate
    })
    await newNotification.save();
}

export const broadcastNotification =async(req:Request, res:Response)=>{
    const { notification } = req.body;

    // const myProducer = producer; 

    // await myProducer.send({
    //     topic:"notification",
    //     messages:[
    //         {
    //             value: JSON.stringify({
    //                 type: 'BROADCAST',
    //                 notification
    //             })
    //         }
    //     ]
    // })
    
    return res.status(200).json({
      success: true,
      message: "Broadcast event sent to Kafka",
    });


}

export const seenNotification=async(req:Request, res:Response)=>{
    
}