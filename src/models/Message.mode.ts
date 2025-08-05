import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  ticketId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', messageSchema);
