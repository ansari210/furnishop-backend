import { Router } from "express";
import {
  createUserController,
  getAllUsersController,
  getMyselfController,
} from "../controllers/user-controller";
import { isAdmin, isAuthenticated } from "../middlewares/authentication";

const router = Router();

router.get("/", isAuthenticated, getMyselfController);
router.post("/create", isAdmin, createUserController);
router.get("/all", isAdmin, getAllUsersController);

export default router;
