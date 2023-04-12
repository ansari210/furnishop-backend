import { Router, Request, Response } from "express";
import Blogs from "../models/blogs";
import upload from "../config/multer";
import { isValidObjectId } from "mongoose";
import { resizeImageAndUpload } from "../services/image-service";

const router = Router();

const IDORSLUG = (id: string) => {
  const isValid = isValidObjectId(id);
  const finder = {
    [isValid ? "_id" : "slug"]: isValid ? id : id,
  };
  return finder;
};

// Create blogs...
router.get("/", async (req: Request, res: Response) => {
  // Validations...
  try {
    const createBlogs = await Blogs.find();
    res.status(200).json(createBlogs);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Get Single Blogs
router.get("/:id_or_slug", async (req: Request, res: Response) => {
  // Validations...
  if (req.params.id_or_slug) {
    try {
      const finder = IDORSLUG(req.params.id_or_slug);
      const data = await Blogs.findOne(finder);
      if (!data) {
        return res.status(404).json({
          ...finder,
          message: "Not Found",
        });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

// Create blogs...
router.post("/", async (req: Request, res: Response) => {
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

    const createBlogs = await Blogs.create(payload);
    res.json({
      message: "Blog Created Successfully",
      data: createBlogs,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Upload image
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

// Delete Single Blogs by using ID or slug

router.delete("/:id_or_slug", async (req, res) => {
  if (req.params.id_or_slug) {
    try {
      const finder = IDORSLUG(req.params.id_or_slug);
      const data = await Blogs.findOneAndDelete(finder);
      res.json({
        message: "Blog Deleted Succesfully",
        data,
      });
    } catch (error: any) {
      res.status(500).send(error);
    }
  }
});
// Update Single Blogs by using ID or slug
router.put("/:id_or_slug", async (req, res) => {
  const updateBody = {
    ...req.body,
    images: Array.isArray(req.body.images) ? req.body.images : undefined,
    categories: Array.isArray(req.body.categories)
      ? req.body.categories
      : undefined,
    keyWord: Array.isArray(req.body.keyWord) ? req.body.keyWord : undefined,
  };

  if (req.params.id_or_slug) {
    try {
      const finder = IDORSLUG(req.params.id_or_slug);

      const updatedData = await Blogs.findOneAndUpdate(finder, updateBody, {
        new: true,
        runValidators: true,
      });
      if (!updatedData) {
        return res.status(404).json({
          ...finder,
          message: "Not Found",
        });
      }
      res.json({ message: "Blog Updated Succesfully", data: updatedData });
    } catch (error: any) {
      res.status(500).send(error);
    }
  }
});

export default router;
