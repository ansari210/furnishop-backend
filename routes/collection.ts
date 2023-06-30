import { Router } from "express";
import { collectionDelete, createCollection, getAllCollection, getCollectionByID, updateCollection } from "../controllers/collection";
import upload from "../config/multer";

const router = Router({ mergeParams: true, strict: true, caseSensitive: true });

router.get("/", getAllCollection);
router.get("/:id", getCollectionByID,);
router.post("/", upload.single("image"), createCollection,);
router.put("/:id",upload.single("image"), updateCollection);
router.delete("/:id", collectionDelete);
export default router;

