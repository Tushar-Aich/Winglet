import mongoose, { Schema, Document } from "mongoose";

export interface ITweet extends Document {
  content: String;
  owner: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  replies: mongoose.Types.ObjectId[];
  media: mongoose.Types.ObjectId[];
  mentions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TweetSchema = new Schema<ITweet>(
  {
    content: {
      type: String,
      required: true,
      maxlength: [150, "content cannot be more than 150 words"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    media: [
      {
        type: Schema.Types.ObjectId,
        ref: "edia",
      },
    ],
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Mention",
      },
    ],
  },
  {
    timestamps: true,
  }
);


const TweetModel =
  (mongoose.models.Tweet as mongoose.Model<ITweet>) ||
  mongoose.model<ITweet>("Tweet", TweetSchema);

export default TweetModel;
