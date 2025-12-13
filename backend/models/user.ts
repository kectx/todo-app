import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false,
      trim: true,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;

const User = model<UserDoc>("User", userSchema);
export default User;