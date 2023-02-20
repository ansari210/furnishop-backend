import { Router } from "express";
import {
  createUserController,
  getMyselfController,
} from "../controllers/user-controller";
import { isAdmin, isAuthenticated } from "../middlewares/authentication";

const router = Router();

router.get("/", isAuthenticated, getMyselfController);
router.post("/create", isAdmin, createUserController);

export default router;
