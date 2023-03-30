import { Router } from "express";
import { getProductByIdController } from "../controllers/merchant-controller";
const router = Router();
router.get("/:id", getProductByIdController);
export default router;
