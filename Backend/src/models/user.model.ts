import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: String;
  userName: String;
  email: String;
  password: String;
  OGName: String;
  bio?: String;
  avatar: String;
  coverImage: String;
  birthDate?: String;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  likedPosts: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
  notifications: mongoose.Types.ObjectId[];
  isVerified: Boolean;
  isPrivate: Boolean;
  lastActive: Date;
  accountType: "Free" | "Premium";
  refreshToken: String;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: String): Promise<Boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, "UserName is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "UserName must not be less than 3 characters"],
      maxlength: [20, "UserName must not be more than 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "UserNames can only contain letters, numbers or underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be atleast 8 characters"],
    },
    OGName: {
      type: String,
      required: [true, "Display Name is required"],
      maxlength: [20, "Display Name must not be more than 20 characters"],
    },
    bio: {
      type: String,
      maxlength: [200, "Bio cannot be more than 200 characters"],
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    birthDate: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    accountType: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<Boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
