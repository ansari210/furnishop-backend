import { model, Schema } from "mongoose";

const blogsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    categories: [
      {
        type: String,
        required: false,
      },
    ],
    images: [
      {
        type: String,
        required: false,
      },
    ],
    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "bedsVariants",
      },
    ],
    isDraft: {
      type: Boolean,
      required: true,
      default: false,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    keyword: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("blog", blogsSchema);
