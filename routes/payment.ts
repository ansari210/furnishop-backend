import { Router } from "express";
import {
  createKlarnaSessionController,
  handleAmazonPayController,
  handleClearPaySessionController,
  handleKlarnaPlaceOrderController,
  handlePaymentController,
} from "../controllers/payment-controller";

const router = Router();

router.post("/", handlePaymentController);
router.post("/klarna", createKlarnaSessionController);
router.post("/klarna/place-order", handleKlarnaPlaceOrderController);
router.post("/clearpay/order", handleClearPaySessionController);
router.post("/amazon/order", handleAmazonPayController);

export default router;
