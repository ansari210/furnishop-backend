//order routes
import { Router } from "express";

import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  getOrderByIdController,
  orderPaymentFailedController,
  orderPaymentSuccessController,
  sendOrderDetaisEmailController,
  updateOrderController,
  updateOrderStatusController,
} from "../controllers/order-controller";

const router = Router();

router.post("/", createOrderController);
router.get("/", getAllOrdersController);
router.get("/:id", getOrderByIdController);
router.put("/:id", updateOrderController);
router.delete("/:id", deleteOrderController);
router.patch("/update-status/:id", updateOrderStatusController);
router.get("/success/:orderId", orderPaymentSuccessController);
router.get("/cancel/:orderId", orderPaymentFailedController);
router.post("/send-order-details", sendOrderDetaisEmailController);

export default router;
