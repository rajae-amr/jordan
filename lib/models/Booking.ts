import mongoose, { Schema, models } from 'mongoose';

export interface IBooking {
  userId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>({
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
  date: {
    type: Date,
    required: [true, 'التاريخ مطلوب'],
  },
  time: {
    type: String,
    required: [true, 'الوقت مطلوب'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;