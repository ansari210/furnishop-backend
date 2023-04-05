import { Router } from "express";
import {
  bulkOrderStatusUpdateController,
  createOrderController,
  deleteOrderController,
  findOrderByOrderIdController,
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
router.delete("/:id", isAdmin, deleteOrderController);
router.patch("/update-status/:id", isAdmin, updateOrderStatusController);
router.get("/success/:orderId", orderPaymentSuccessController);
router.get("/cancel/:orderId", orderPaymentFailedController);
router.post("/send-order-details", sendOrderDetaisEmailController);
router.patch("/bulk-update", isAdmin, bulkOrderStatusUpdateController);
router.get("/search/:orderId", findOrderByOrderIdController);

export default router;
