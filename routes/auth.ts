import { Router } from "express";
import {
    handleAdminRegisterController,
    handleLoginController,
    handleUserRegisterController,
    handleVerifyTokenController,
    handleLogoutController,
    updateusePass,
} from "../controllers/auth-controller";

const router = Router();

router.post("/register-admin", handleAdminRegisterController);
router.post("/login", handleLoginController);
router.post("/register", handleUserRegisterController);
router.post("/verify-token", handleVerifyTokenController);
router.post("/logout", handleLogoutController);
router.put("/update/:id",updateusePass)

export default router;
