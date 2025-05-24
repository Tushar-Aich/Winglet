import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  content: String;
  images: String;
  sender: mongoose.Types.ObjectId;
  receipent: mongoose.Types.ObjectId;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      maxlength: [150, "content cannot be more than 150 words"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receipent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    images: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

const MessageModel =
  (mongoose.models.Message as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
