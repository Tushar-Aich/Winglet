import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  sender: mongoose.Types.ObjectId;
  receipent: mongoose.Types.ObjectId;
  type: 'like' | 'retweet' | 'reply' | 'follow';
  tweet?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receipent: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
        type: String,
        enum: ['like' , 'retweet' , 'reply' , 'follow'],
        required: true
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }
  },
  {
    timestamps: true,
  }
);

const NotificationModel =
  (mongoose.models.Notification as mongoose.Model<INotification>) ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default NotificationModel;
