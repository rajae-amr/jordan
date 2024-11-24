import mongoose, { Schema, models } from 'mongoose';

export interface IMessage {
  sender: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  readAt?: Date;
}

export interface IChat {
  participants: Schema.Types.ObjectId[];
  messages: IMessage[];
  lastMessage?: IMessage;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readAt: Date,
});

const chatSchema = new Schema<IChat>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [messageSchema],
  lastMessage: messageSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// إضافة مؤشرات للبحث السريع
chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

const Chat = models.Chat || mongoose.model<IChat>('Chat', chatSchema);
export default Chat;