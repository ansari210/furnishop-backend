import { Request, Response } from "express";
import { createCheckoutSessionService } from "../services/payment-services";

export const handlePaymentController = async (req: Request, res: Response) => {
  try {
    const { line_items, orderId, mongoObjectId } = req.body;
    if (!line_items || !orderId)
      return res.status(400).json({ error: "Missing line_items or orderId" });
    const session = await createCheckoutSessionService(
      line_items,
      orderId,
      mongoObjectId
    );
    res.status(200).json({ session });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
