import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
    url: String;
    uploadedBy: mongoose.Types.ObjectId;
    type: 'image' | 'video' | 'gif';
    createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['image' , 'video' , 'gif'],
        required: true
    },
  },
  {
    timestamps: true,
  }
);

const MediaModel =
  (mongoose.models.Media as mongoose.Model<IMedia>) ||
  mongoose.model<IMedia>("Media", MediaSchema);

export default MediaModel;
