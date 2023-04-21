import { Router } from "express";
import upload from "../config/multer";
import { resizeImageAndUpload } from "../services/image-service";
import {
  createBlog,
  deleteSingleBlog,
  getAllBlogs,
  getSingleBlogBySlug,
  getSingleBlogbyId,
  updateSingleBlog,
} from "../controllers/blog-controller";

const router = Router({ mergeParams: true, strict: true, caseSensitive: true });
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
// Create blogs...
router.get("/", getAllBlogs);
// Get Single Blog by Slug
router.get("/:slug/slug", getSingleBlogBySlug);
// Get Single Blog by ID
router.get("/:id/id", getSingleBlogbyId);
// Create blogs...
router.post("/", createBlog);
// Update Single Blogs by using ID or slug
router.put("/:id", updateSingleBlog);
// Delete Single Blogs by using ID or slug
router.delete("/:id", deleteSingleBlog);
export default router;
