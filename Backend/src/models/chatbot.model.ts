import mongoose, { Schema, Document } from "mongoose";

export interface IChatbot extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  prompt: string;
  response: string;
  timestamp: Date;
}

const ChatbotSchema = new Schema<IChatbot>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

const ChatbotModel =
  (mongoose.models.Chatbot as mongoose.Model<IChatbot>) ||
  mongoose.model<IChatbot>("Chatbot", ChatbotSchema);

export default ChatbotModel;
