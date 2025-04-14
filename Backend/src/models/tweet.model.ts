import mongoose, { Schema, Document } from "mongoose";

export interface ITweet extends Document {
  content: String;
  owner: mongoose.Types.ObjectId;
  media: String;
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
    media: {
      type: String
    },
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
