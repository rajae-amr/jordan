import mongoose, { Schema, models } from 'mongoose';

export interface IPackage {
  name: string;
  description: string;
  features: string[];
  price: number;
  duration: number; // بالأيام
  maxBookings: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
}

const packageSchema = new Schema<IPackage>({
  name: {
    type: String,
    required: [true, 'اسم الباقة مطلوب'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'وصف الباقة مطلوب'],
  },
  features: [{
    type: String,
    required: true,
  }],
  price: {
    type: Number,
    required: [true, 'سعر الباقة مطلوب'],
    min: 0,
  },
  duration: {
    type: Number,
    required: [true, 'مدة الباقة مطلوبة'],
    min: 1,
  },
  maxBookings: {
    type: Number,
    required: [true, 'عدد الحجوزات المسموحة مطلوب'],
    min: 1,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Package = models.Package || mongoose.model<IPackage>('Package', packageSchema);
export default Package;