import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  accountType: 'provider' | 'client';
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    minlength: [2, 'الاسم يجب أن يكون على الأقل حرفين'],
    maxlength: [50, 'الاسم يجب أن لا يتجاوز 50 حرف'],
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'صيغة البريد الإلكتروني غير صحيحة'],
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
  },
  accountType: {
    type: String,
    enum: {
      values: ['provider', 'client'],
      message: 'نوع الحساب غير صحيح',
    },
    required: [true, 'نوع الحساب مطلوب'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// إضافة مؤشر للبريد الإلكتروني
userSchema.index({ email: 1 }, { unique: true });

// التحقق من وجود النموذج قبل إنشائه
const User = models.User || model<IUser>('User', userSchema);

export default User;