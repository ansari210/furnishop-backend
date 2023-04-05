import { Request, Response } from "express";
import createInvoice from "../config/createInvoice";
import { AcceptedOrderStatus, orderStatus } from "../constants/OrderStatus";
import { paymentMethods } from "../constants/PaymentMethods";
import { roles } from "../constants/Roles";
import fs from "fs";
import {
  sendEmailWithTemplate,
  sendOrderDetailsService,
} from "../services/email-services";
import {
  bulkOrderUpdateService,
  createOrderService,
  deleteOrderService,
  findOrderByOrderIdService,
  getAllOrdersService,
  getOrderByIdService,
  getOrderByMultipleIdService,
  updateOrderService,
  updateOrderStatusService,
} from "../services/order-services";
import {
  clearPayCreateSessionService,
  createCheckoutSessionService,
  createKlarnaSessionService,
} from "../services/payment-services";
import { createUserService } from "../services/user-services";
import { orderStatusTemplate } from "../templates/order-status";
import createAfterPayPayload from "../utils/CreateAfterPayPayload";
import createKlarnaPayload from "../utils/CreateKlarnaPayload";

//create order controller
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const order = await createOrderService(req.body);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    await createUserService({
      name: `${order?.user?.firstName} ${order?.user?.lastName}`,
      phone: order?.user?.phone || "",
      email: order?.user?.email || "",
      role: roles.customer,
    });
    if (order?.payment?.paymentMethod === paymentMethods.stripe) {
      const line_items = order?.orderItems?.map((item: any) => {
        return {
          name: item?.name,
          images: [item?.image],
          amount: Number((item?.price || 0) / (item?.quantity || 0)) * 100,
          currency: "GBP",
          quantity: item?.quantity,
        };
      });
      const stripeCheckout = await createCheckoutSessionService(
        line_items,
        order.orderId as any,
        order._id as any,
        req.body?.couponId || ""
      );
      res.status(201).json({ stripe: stripeCheckout });
    } else if (order?.payment?.paymentMethod === paymentMethods.klarna) {
      //KLARNA PAYMENT
      const klarnaPayload = await createKlarnaPayload(order);
      console.log({ klarnaPayload });
      const session = await createKlarnaSessionService(klarnaPayload);
      res.status(201).json({ session, order });
    } else if (order?.payment?.paymentMethod === paymentMethods.clearPay) {
      //CLEARPAY PAYMENT
      const clearPayPayload = await createAfterPayPayload(order);
      console.log({ clearPayPayload });
      const session = await clearPayCreateSessionService(clearPayPayload);

      res.status(201).json({ session, order });
    } else {
      await updateOrderStatusService(order._id as any, orderStatus.Processing);
      res.status(201).json({ order });
    }

    // const template = orderStatusTemplate({
    //   orderId: order?.orderId as any,
    //   orderAt: order?.createdAt as any,
    //   orderItems: order?.orderItems as any,
    //   totalPrice: order?.totalPrice || 0,
    //   shippingPrice: 0,
    //   user: order?.user as any,
    //   shippingAddress: order?.shippingAddress as any,
    //   billingAddress: order?.shippingAddress as any,
    //   subject: "Order Successfully Placed",
    //   paymentMethod: order?.payment?.paymentMethod,
    //   message: `Notification to let you know – order #${order?.orderId}
    //         belonging to <strong>${order?.user?.firstName} ${order?.user?.lastName}</strong> has been placed successfully.`,
    // });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const orderPaymentSuccessController = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "OrderId not found" });
    }
    const order = await updateOrderStatusService(
      orderId,
      orderStatus.Processing
    );

    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    const adminTemplate = orderStatusTemplate({
      orderId: order?.orderId as any,
      orderAt: order?.createdAt as any,
      orderItems: order?.orderItems as any,
      totalPrice: order?.totalPrice || 0,
      shippingPrice: 0,
      user: order?.user as any,
      shippingAddress: order?.shippingAddress as any,
      billingAddress:
        (order?.billingAddress as any) || (order?.shippingAddress as any),
      paymentMethod: order?.payment?.paymentMethod as any,
      subject: "New Order Created",
      message: `Notification to let you know – order #${order?.orderId}
              belonging to <strong>${order?.user?.firstName} ${order?.user?.lastName}</strong> has been placed successfully.`,
    });

    await sendEmailWithTemplate(
      process.env.ADMIN_EMAIL as any,
      adminTemplate,
      "New Order Created"
    );

    res.redirect(
      `${process.env.CLIENT_URL}/order/success?paymentMethod=${order?.payment?.paymentMethod}&price=${order?.totalPrice}&orderId=${order?.orderId}&createdAt=${order?.createdAt}`
    );
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const orderPaymentFailedController = async (
  req: Request,
  res: Response
) => {
  try {
    // const { orderId } = req.params;
    res.redirect(`${process.env.CLIENT_URL}/cart`);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

//get order by id controller
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const order = await getOrderByIdService(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error });
  }
};

//get all orders controller
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersService(req?.query?.id as any);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ error });
  }
};

//update order controller
export const updateOrderController = async (req: Request, res: Response) => {
  try {
    const { id: lastModifiedBy } = req.user;

    req.body?.notes?.map((note: any) => {
      if (!note?.createdBy) {
        note.createdBy = req?.user?.name;
      }
    });

    const order = await updateOrderService(
      req.params.id,
      req.body,
      lastModifiedBy
    );
    res.status(200).json({ order });
  } catch (error: any) {
    res.status(400).json({ error: error?.message });
  }
};

//delete order controller
export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const order = await deleteOrderService(req.params.id);
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error });
  }
};

//update order status
export const updateOrderStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !req?.body?.status ||
      !AcceptedOrderStatus.includes(req?.body?.status)
    ) {
      res.status(400).json({ error: "Invalid Order Status" });
    }

    const order = await updateOrderStatusService(
      req.params.id,
      req.body?.status
    );
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const sendOrderDetaisEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const orderEmail = await sendOrderDetailsService(
      req.body.email,
      req.body.message
    );
    res.status(200).json({ orderEmail: orderEmail });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const bulkOrderStatusUpdateController = async (
  req: Request,
  res: Response
) => {
  try {
    const { ids, status } = req.body;
    const updatedOrders = await bulkOrderUpdateService(ids, status);
    res.status(200).json({ updatedOrders });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const findOrderByOrderIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const order = await findOrderByOrderIdService(orderId);
    res.status(200).json({ ok: "ok" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// GENERATE INVOICE

// export const generateInvoice = async (req: Request, res: Response) => {
//   // const ids = req.body;
//   // const data = await getOrderByMultipleIdService(ids);

//   const invoice = {
//     shipping: {
//       name: "John Doe",
//       address: "1234 Main Street",
//       city: "San Francisco",
//       state: "CA",
//       country: "US",
//       postal_code: 94111,
//     },
//     items: [
//       {
//         item: "Mattress",
//         description: "6FT – Orthopedic Mattress",
//         quantity: 1,
//         amount: 254,
//       },
//       {
//         item: "Headboard",
//         description: "26 Inch Diamond Button Cube Headboard",
//         quantity: 1,
//         amount: 254,
//       },
//       {
//         item: "Feet",
//         description: "Free Castor Wheels",
//         quantity: 1,
//         amount: 254,
//       },
//       {
//         item: "Storage Options",
//         description: "2 Drawers Same Side",
//         quantity: 1,
//         amount: 254,
//       },
//       {
//         item: "Size",
//         description: "6FT",
//         quantity: 1,
//         amount: 254,
//       },
//       {
//         item: "Colour",
//         description: "Black Veince",
//         quantity: 1,
//         amount: 254,
//       },
//     ],
//     subtotal: 8000,
//     paid: 0,
//     invoice_nr: 1234,
//   };

//   const invoices = await createInvoice(invoice);
//   const archive = archiver("zip", {
//     zlib: { level: 9 }, // set the compression level
//   });

//   const filename = `Receipt_123.pdf`;

//   archive.append(invoices, { name: filename });
//   archive.finalize();

//   const stream = res.writeHead(200, {
//     "Content-Type": "application/zip",
//     "Content-disposition": `attachment;filename=${filename}.zip`,
//   });

//   archive.pipe(stream);
// };
