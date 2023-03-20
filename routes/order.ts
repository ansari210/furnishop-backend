//order routes
import { Router } from "express";

import {
  bulkOrderStatusUpdateController,
  createOrderController,
  deleteOrderController,
  findOrderByOrderIdController,
  generateInvoice,
  getAllOrdersController,
  getOrderByIdController,
  orderPaymentFailedController,
  orderPaymentSuccessController,
  sendOrderDetaisEmailController,
  updateOrderController,
  updateOrderStatusController,
} from "../controllers/order-controller";
import { isAdmin } from "../middlewares/authentication";

const router = Router();

router.post("/", createOrderController);
router.get("/", getAllOrdersController);
router.get("/:id", getOrderByIdController);
router.put("/:id", isAdmin, updateOrderController);
router.delete("/:id", deleteOrderController);
router.patch("/update-status/:id", updateOrderStatusController);
router.get("/success/:orderId", orderPaymentSuccessController);
router.get("/cancel/:orderId", orderPaymentFailedController);
router.post("/send-order-details", sendOrderDetaisEmailController);
router.patch("/bulk-update", bulkOrderStatusUpdateController);
router.get("/search/:orderId", findOrderByOrderIdController);

// Generate Multiple Invoice in Zip

router.post("/generate-bulk-invoice", generateInvoice);
export default router;
