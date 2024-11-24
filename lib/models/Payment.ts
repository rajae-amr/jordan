import mongoose, { Schema, models } from 'mongoose';

export interface IPayment {
  bookingId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'JOD',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  stripePaymentIntentId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;