import slugify from "slugify";
import { ObjectId } from "mongodb";
import Blogs from "../models/blogs";
import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

// Create blogs...
export const getAllBlogs = async (req: Request, res: Response) => {
  // Validations...
  try {
    const createBlogs = await Blogs.find().sort({ createdAt: -1 });
    // .select(`-content`);
    res.status(200).json(createBlogs);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Get Single Blog by Slug
export const getSingleBlogBySlug = async (req: Request, res: Response) => {
  // Validations...
  if (req.params.slug) {
    try {
      const data = await Blogs.findOne({ slug: req.params.slug });
      if (!data) {
        return res.status(404).json({
          message: "Not Found",
        });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};
// Get Single Blog by ID
export const getSingleBlogbyId = async (req: Request, res: Response) => {
  // Validations...
  if (req.params.id) {
    try {
      const _id = new ObjectId(req.params.id);
      const data = await Blogs.findOne({ _id });
      if (!data) {
        return res.status(404).json({
          message: "Not Found",
        });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};
// Create blogs...
export const createBlog = async (req: Request, res: Response) => {
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
      slug: slugify(slug, { lower: true, strict: true }),
      content: sanitizeHtml(content),
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
};

// Update Single Blogs by using ID or slug
export const updateSingleBlog = async (req: Request, res: Response) => {
  if (req.params.id) {
    const updateBody = {
      ...req.body,
      slug: slugify(req.body.slug, { lower: true, strict: true }),
      content: sanitizeHtml(req.body.content),
      images: Array.isArray(req.body.images) ? req.body.images : undefined,
      categories: Array.isArray(req.body.categories)
        ? req.body.categories
        : undefined,
      keyWord: Array.isArray(req.body.keyWord) ? req.body.keyWord : undefined,
    };
    try {
      const updatedData = await Blogs.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        updateBody,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedData) {
        return res.status(404).json({
          message: "Not Found",
        });
      }
      res.json({ message: "Blog Updated Succesfully", data: updatedData });
    } catch (error: any) {
      res.status(500).send(error);
    }
  }
};
// Delete Single Blogs by using ID or slug

export const deleteSingleBlog = async (req: Request, res: Response) => {
  if (req.params.id) {
    try {
      const data = await Blogs.findOneAndDelete({
        _id: req.params.id,
      });
      res.json({
        message: "Blog Deleted Succesfully",
        data,
      });
    } catch (error: any) {
      res.status(500).send(error);
    }
  }
};
