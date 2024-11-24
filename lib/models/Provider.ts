import mongoose, { Schema, models } from 'mongoose';

export interface IProvider {
  userId: Schema.Types.ObjectId;
  specialty: 'education' | 'physiotherapy' | 'psychology' | 'homecare';
  location: 'amman' | 'irbid' | 'zarqa' | 'aqaba';
  experience: string;
  bio?: string;
  rating: number;
  reviews: Array<{
    userId: Schema.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
  }>;
  available: boolean;
  createdAt: Date;
}

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

const providerSchema = new Schema<IProvider>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialty: {
    type: String,
    required: [true, 'التخصص مطلوب'],
    enum: ['education', 'physiotherapy', 'psychology', 'homecare'],
  },
  location: {
    type: String,
    required: [true, 'الموقع مطلوب'],
    enum: ['amman', 'irbid', 'zarqa', 'aqaba'],
  },
  experience: {
    type: String,
    required: [true, 'سنوات الخبرة مطلوبة'],
  },
  bio: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [reviewSchema],
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// حساب متوسط التقييم عند إضافة أو تحديث التقييمات
providerSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = Number((totalRating / this.reviews.length).toFixed(1));
  }
  next();
});

const Provider = models.Provider || mongoose.model<IProvider>('Provider', providerSchema);
export default Provider;