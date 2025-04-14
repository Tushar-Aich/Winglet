import mongoose, { Schema, Document } from "mongoose";


export interface IComment extends Document {
    content: String;
    author: mongoose.Types.ObjectId;
    tweet: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
        type: String,
        required: true,
        maxLength: [150, 'Comment cannot be more than 150 characters']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel =
  (mongoose.models.Comment as mongoose.Model<IComment>) ||
  mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;
