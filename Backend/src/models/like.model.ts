import mongoose, { Schema, Document } from "mongoose";


export interface ILike extends Document {
    user: mongoose.Types.ObjectId;
    tweet?: mongoose.Types.ObjectId;
    comment?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
  },
  {
    timestamps: true,
  }
);

const LikeModel =
  (mongoose.models.Like as mongoose.Model<ILike>) ||
  mongoose.model<ILike>("Like", LikeSchema);

export default LikeModel;
