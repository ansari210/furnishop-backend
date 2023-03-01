import { Router } from "express";
import {
  createKlarnaSessionController,
  handleKlarnaPlaceOrderController,
  handlePaymentController,
} from "../controllers/payment-controller";

const router = Router();

router.post("/", handlePaymentController);
router.post("/klarna", createKlarnaSessionController);
router.post("/klarna/place-order", handleKlarnaPlaceOrderController);

export default router;
