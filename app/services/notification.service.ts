import NotificationModel from "../models/notification.model";

interface CreateNotificationInput {
  status: string;
  userId: string;
  vulnerabilityId: string;
  type?: string;
  meta?: Record<string, any>;
}


export class NotificationService {
  static async createNotification(data:CreateNotificationInput) {
    return NotificationModel.create({
      user_id: data.userId,
      notification: `Vulnerability status updated to ${data.status}`,
      type:data.type,
      meta:data.meta,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  static async getUserNotifications(userId: string) {
    return NotificationModel.find({ user_id: userId }).sort({ createdAt: -1 });
  }

  static async markAsRead(notificationId: string) {
    return NotificationModel.findByIdAndUpdate(notificationId, {
      seen: true,
    });
  }

  static async getUnreadCount(userId: string) {
    return NotificationModel.countDocuments({ user_id: userId, seen: false });
  }
}
