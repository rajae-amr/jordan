import mongoose, { Schema, models } from 'mongoose';

export interface IStatistics {
  visitors: number;
  members: number;
  providers: number;
  lastUpdated: Date;
}

const statisticsSchema = new Schema<IStatistics>({
  visitors: {
    type: Number,
    default: 0,
  },
  members: {
    type: Number,
    default: 0,
  },
  providers: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Statistics = models.Statistics || mongoose.model<IStatistics>('Statistics', statisticsSchema);
export default Statistics;