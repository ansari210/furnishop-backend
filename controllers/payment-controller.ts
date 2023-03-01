import { Request, Response } from "express";
import {
  createCheckoutSessionService,
  createKlarnaSessionService,
  klarnaPlaceOrderService,
} from "../services/payment-services";

export const handlePaymentController = async (req: Request, res: Response) => {
  try {
    const { line_items, orderId, mongoObjectId, couponId } = req.body;
    if (!line_items || !orderId)
      return res.status(400).json({ error: "Missing line_items or orderId" });
    const session = await createCheckoutSessionService(
      line_items,
      orderId,
      mongoObjectId,
      couponId
    );
    res.status(200).json({ session });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createKlarnaSessionController = async (
  req: Request,
  res: Response
) => {
  try {
    const { line_items } = req.body;
    const session = await createKlarnaSessionService(line_items);
    res.status(200).json({ session });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleKlarnaPlaceOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const { line_items, token } = req.body;
    if (!line_items) return res.status(400).json({ error: "Missing order" });
    if (!token) return res.status(400).json({ error: "Missing token" });
    const session = await klarnaPlaceOrderService(line_items, token);
    res.status(200).json({ session });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
