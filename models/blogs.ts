import { model, Schema } from "mongoose";
import slugify from "slugify";

const blogSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: false,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    categories: [
      {
        type: String,
        required: false,
      },
    ],
    metaTitle: {
      type: String,
      required: false,
    },
    metaDescription: {
      type: String,
      required: false,
    },
    keyWord: [
      {
        type: String,
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// blogSchema.pre("save", function (next) {
//   // Only generate slug if title has changed
//   if (this.isModified("name")) {
//     // Generate slug from title using slugify package
//     this.slug = slugify(this.slug, { lower: true });
//   }
// });

const Blogs = model("blogs", blogSchema);
export default Blogs;
