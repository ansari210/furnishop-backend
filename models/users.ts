import { model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string | undefined;
  isRegistered: boolean;
}
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      default: "customer",
    },
    avatar: {
      type: String,
      required: false,
    },
    isRegistered: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("users", userSchema);
