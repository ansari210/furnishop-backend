import { Router, Request, Response } from "express";
import blogs from "../models/blogs";
import { isValidObjectId } from "mongoose";
import upload from "../config/multer";
import { resizeImageAndUpload } from "../services/image-service";

const router = Router();

// Create blogs...
router.get("/", async (req: Request, res: Response) => {
  // Validations...
  try {
    const createBlogs = await blogs.find();
    res.status(200).json({data: createBlogs});
  } catch (error) {
    res.status(500).send(error);
  }
});
// Create blogs...
router.post("/create", async (req: Request, res: Response) => {
  const {
    name,
    slug,
    content,
    images,
    categories,
    metaTitle,
    metaDescription,
    keyWord,
  } = req.body;

  // Validations...
  if (!name) {
    return res
      .status(404)
      .json({ message: "Blog Heading name cannot be empty" });
  } else if (!slug) {
    return res.status(400).json({ message: "Slug cannot be empty" });
  }

  try {
    const payload = {
      name,
      slug,
      content,
      images: Array.isArray(images) ? images : undefined,
      categories: Array.isArray(categories) ? categories : undefined,
      metaTitle,
      metaDescription,
      keyWord: Array.isArray(keyWord) ? keyWord : undefined,
    };

    const createBlogs = await blogs.create(payload);
    res.json({
      message: "Blog Created Successfully",
      data: createBlogs,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Upload image
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "IMAGE is required",
      });
    }
    const imageUploadUrl = await resizeImageAndUpload(req.file, "blog");
    res.send(imageUploadUrl);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete blogs...
router.delete("/delete-blog/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await blogs.findByIdAndDelete(id);
    res.json({
      message: "Blog Deleted Succesfully",
      data: deletedBlog,
    });
  } catch (error: any) {
    res.status(500).send(error);
  }
});

// Update Blogs...
router.patch("/update-blog/:id", async (req, res) => {
  const { id } = req.params;

  const {
    name,
    slug,
    content,
    images,
    categories,
    metaTitle,
    metaDescription,
    keyWord,
  } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID provided." });
  }

  try {
    const updatedData = await blogs.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        content,
        images: Array.isArray(images) ? images : undefined,
        categories: Array.isArray(categories) ? categories : undefined,
        metaTitle,
        metaDescription,
        keyWord: Array.isArray(keyWord) ? keyWord : undefined,
      },
      {
        new: true,
      }
    );
    res.json({ message: "Blog Updated Succesfully", data: updatedData });
  } catch (error: any) {
    res.status(500).send(error);
  }
});

export default router;
