import { model, Schema, Document } from "mongoose";

export interface IMultipleFile extends Document {
  name: string;
  price: string;
  destination: string;
  files: any;
  createdAt: string;
  updatedAt: string;
}

const mulitipleFileSchema = new Schema<IMultipleFile>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    files: [Object],
  },
  { timestamps: true }
);

export default model<IMultipleFile>("multipleFile", mulitipleFileSchema);
