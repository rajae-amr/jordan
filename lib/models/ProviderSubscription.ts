import mongoose, { Schema, models } from 'mongoose';

export interface IProviderSubscription {
  providerId: Schema.Types.ObjectId;
  packageId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  remainingBookings: number;
  status: 'active' | 'expired' | 'cancelled';
  paymentId?: Schema.Types.ObjectId;
  createdAt: Date;
}

const providerSubscriptionSchema = new Schema<IProviderSubscription>({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  packageId: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  remainingBookings: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// إضافة مؤشرات للبحث السريع
providerSubscriptionSchema.index({ providerId: 1, status: 1 });
providerSubscriptionSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

const ProviderSubscription = models.ProviderSubscription || mongoose.model<IProviderSubscription>('ProviderSubscription', providerSubscriptionSchema);
export default ProviderSubscription;