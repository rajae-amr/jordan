import mongoose, { Schema, models } from 'mongoose';

export interface INotification {
  userId: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: 'booking' | 'review' | 'system';
  status: 'unread' | 'read';
  link?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['booking', 'review', 'system'],
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
  link: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// إضافة مؤشر للبحث السريع
notificationSchema.index({ userId: 1, status: 1 });

const Notification = models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;