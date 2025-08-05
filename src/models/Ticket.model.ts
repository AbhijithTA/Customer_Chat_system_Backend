import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
  user: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId | null;
  subject: string;
  message: string;
  status: "open" | "assigned" | "resolved";
  priority: "low" | "medium" | "high";
}

const ticketSchema: Schema<ITicket> = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "assigned", "resolved"],
      default: "open",
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITicket>("Ticket", ticketSchema);
