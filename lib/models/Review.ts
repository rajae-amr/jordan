import mongoose, { Schema, models } from 'mongoose';

export interface IReview {
  userId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  bookingId: Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
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
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true, // لضمان عدم تكرار التقييم لنفس الحجز
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// إضافة مؤشرات للبحث السريع
reviewSchema.index({ userId: 1, providerId: 1 });
reviewSchema.index({ bookingId: 1 }, { unique: true });

const Review = models.Review || mongoose.model<IReview>('Review', reviewSchema);
export default Review;