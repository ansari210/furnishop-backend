import { orderStatus } from "../constants/OrderStatus";
import Order from "../models/orders";
import { orderStatusTemplate } from "../templates/order-status";
import { getPercentagePrice } from "../utils/GetDiscountPrice";
import {
  findAccessoriesLocallyService,
  findBedVariantWithProductNameByIdService,
} from "./accessories-services";
import { getCouponByIdService } from "./coupon-services";
import { sendEmailWithTemplate } from "./email-services";
import { resizeImageAndUpload } from "./image-service";
import { ObjectId } from "mongodb";
//create order
export const createOrderService = async (order: any) => {
  if (order?.orderItems && order?.orderItems?.length > 0) {
    const coupon = await getCouponByIdService(order?.couponId);

    const test = order.orderItems.map(async (orderItem: any) => {
      const bedVariantWithProductName =
        await findBedVariantWithProductNameByIdService(
          orderItem?.bedId,
          orderItem._id
        );

      if (bedVariantWithProductName) {
        const data = findAccessoriesLocallyService(
          bedVariantWithProductName as any,
          orderItem?.headboard,
          orderItem?.feet,
          orderItem?.mattress,
          orderItem?.color,
          orderItem?.storage
        );

        console.log({ total: data?.totalPrice });

        return {
          name: data?.name,
          categories: data?.categories,
          image: data?.variant?.image,
          quantity: orderItem?.quantity,
          price: data?.totalPrice * Number(orderItem?.quantity),
          accessories: {
            size: data?.size,
            headboard: data?.headboard,
            mattress: data?.mattress,
            color: data?.color,
            storage: data?.storage,
            feet: data?.feet,
          },
        };
      }
    });

    order.orderItems = await Promise.all(test);

    order.totalPrice = order.orderItems.reduce(
      (acc: any, item: any) => acc + item.price,
      0
    );

    if (coupon) {
      order.discount = {
        price: getPercentagePrice(order.totalPrice, coupon?.percent),
        percent: coupon?.percent,
        code: coupon?.label,
      };
    }

    const newOrder = await Order.create(order);
    return newOrder;
  }
};

export const getOrderByIdsService = async (order: any) => {
  if (order?.orderItems && order?.orderItems?.length > 0) {
    const coupon = await getCouponByIdService(order?.couponId);

    const test = order.orderItems.map(async (orderItem: any) => {
      const bedVariantWithProductName =
        await findBedVariantWithProductNameByIdService(
          orderItem?.bedId,
          orderItem._id
        );

      if (bedVariantWithProductName) {
        const data = findAccessoriesLocallyService(
          bedVariantWithProductName as any,
          orderItem?.headboard,
          orderItem?.feet,
          orderItem?.mattress,
          orderItem?.color,
          orderItem?.storage
        );

        console.log({ total: data?.totalPrice });

        return {
          name: data?.name,
          categories: data?.categories,
          image: data?.variant?.image,
          quantity: orderItem?.quantity,
          price: data?.totalPrice * Number(orderItem?.quantity),
          accessories: {
            size: data?.size,
            headboard: data?.headboard,
            mattress: data?.mattress,
            color: data?.color,
            storage: data?.storage,
            feet: data?.feet,
          },
        };
      }
    });

    order.orderItems = await Promise.all(test);

    order.totalPrice = order.orderItems.reduce(
      (acc: any, item: any) => acc + item.price,
      0
    );

    if (coupon) {
      order.discount = {
        price: getPercentagePrice(order.totalPrice, coupon?.percent),
        percent: coupon?.percent,
        code: coupon?.label,
      };
    }

    return order;
  }
};

// const orders = await Order.find().where("_id").in(ids).exec();
// const records = await Order.find().where("_id").in(ids).exec();
//get order by id
export const getOrderByMultipleIdService = async (ids: string[]) => {
  // const changeToObjectIds = ids.map((id) => new ObjectId(id));
  // const records = await Order.find().where("_id").in(changeToObjectIds).exec();
  // const records = await Order.find({
  //   _id: { $in: ids.map((pd) => new ObjectId(pd)) },
  // });
  // const records=await Order.where(id:{:$in=>ids})

  // console.log({ records });
  const records = await Order.find({
    _id: {
      $in: ids.map((id) => new ObjectId(id)),
    },
  });
  return records;
};

//get order by id
export const getOrderByIdService = async (id: string) => {
  const order = await Order.findById(id).populate(
    "lastModifiedBy",
    "name email"
  );
  return order;
};

//get all orders
export const getAllOrdersService = async (query: string | undefined) => {
  if (query) {
    const orders = await Order.find({
      $or: [
        { orderId: isNaN(Number(query)) ? undefined : Number(query) },
        { "user.firstName": { $regex: query, $options: "i" } },
        { "user.lastName": { $regex: query, $options: "i" } },
        { "user.email": { $regex: query, $options: "i" } },
        { "shippingAddress.postalCode": { $regex: query, $options: "i" } },
      ],
    }).sort("-createdAt");
    return orders;
  }
  const orders = await Order.find().sort("-createdAt");
  return orders;
};

//update order
export const updateOrderService = async (
  id: string,
  order: any,
  lastModifiedBy: string
) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { ...order, lastModifiedBy },
    {
      new: true,
    }
  );
  return updatedOrder;
};

//delete order
export const deleteOrderService = async (id: string) => {
  const deletedOrder = await Order.findByIdAndDelete(id);
  return deletedOrder;
};

//update order status
export const updateOrderStatusService = async (id: string, status: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { ["payment.status"]: status },
    { new: true }
  );

  if (status === orderStatus.Cancelled) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.billingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      subject: "Order Cancelled",
      message: `Notification to let you know – order #${updatedOrder?.orderId}
            belonging to <strong>${updatedOrder?.user?.firstName} ${updatedOrder?.user?.lastName}</strong> has been cancelled:`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Cancelled"
    );
  } else if (status === orderStatus.Processing) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.billingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      // order processing
      subject: "Your Beds Divans order has been received!",
      message: `Hi ${updatedOrder?.user?.firstName}, <br> <br> Thank you for placing your order with DBZ Khan LTD. @Bedsdivans.co.uk <br> <br> We have received your order, which is currently in process with our logistics team awaiting to be scheduled on a route for delivery. <br> <br> Our aim is to deliver your items within 3-5 working days from when you have placed the order between the hours of 7am-7pm mon-fri. <br> <br> If your delivery address falls within the 100 mile radius of our postcode (WV14 7HZ) then your estimated delivery will be as mentioned above, (within 3-5 working days). <br> <br> However, if your delivery address falls above the 100 mile radius of our (wv14 7hz) postcode then the estimated delivery will be between 3-7 working days with our third-party courier provider (sgk logistics) who will get in touch regarding a delivery day & time via email & text. <br> <br> Our office staff will call/text or email you 24hrs-48hrs prior to your scheduled delivery day to confirm the time of delivery. <br> <br> Furthermore, providing your correct contact details will speed the delivery process. <br> <br>  If you require further assistance then please do read our policy & warranty guidelines and useful information section on our website.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Your Beds Divans order has been received!"
    );
  } else if (status === orderStatus.Completed) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.shippingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      subject: "Order Completed",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been payment has been completed. Thank you for shopping with us. We will send you an email when your order has been shipped. You can track your order by clicking the link below.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Completed"
    );
  } else if (status === orderStatus.Delivered) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.billingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      subject: "Order Delivered",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been delivered. Thank you for shopping with us.`,
    });
  } else if (status === orderStatus.PendingPayment) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.billingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      subject: "Order Payment Pending",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been payment has been pending. Please pay to complete your order.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Payment Pending"
    );
  } else if (status === orderStatus.Refunded) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.billingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      subject: "Order Refunded",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order money has been refunded to your account , Thank you for shopping with us.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Refunded"
    );
  } else if (status === orderStatus.OnHold) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.billingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      subject: "Order On Hold",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been placed on hold, due to some payment issues. Please contact us for more details.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order On Hold"
    );
  } else if (status === orderStatus.Failed) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.billingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      subject: "Order Payment Failed",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order payment has been failed, Please try again.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Payment Failed"
    );
  } else if (status === orderStatus.Pending) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress:
        (updatedOrder?.billingAddress as any) ||
        (updatedOrder?.shippingAddress as any),
      paymentMethod: updatedOrder?.payment?.paymentMethod as any,
      subject: "Order Pending",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been placed on pending, Please contact us for more details.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Pending"
    );
  }

  return updatedOrder;
};

export const bulkOrderUpdateService = async (ids: string[], status: string) => {
  console.log({ ids, status });

  if (status === orderStatus.MoveToBin) {
    const orders = await Order.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          isDeleted: true,
          ["payment.status"]: "",
        },
      }
    );
    return orders;
  } else {
    const orders = await Order.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          ["payment.status"]: status,
          isDeleted: false,
        },
      }
    );
    return orders;
  }
};

export const findOrderByOrderIdService = async (query: string) => {
  return await Order.find({
    $or: [
      // { orderId: Number(query) },
      { "user.firstName": { $regex: query, $options: "i" } },
      { "user.lastName": { $regex: query, $options: "i" } },
      { "user.email": { $regex: query, $options: "i" } },
      { "shippingAddress.postalCode": { $regex: query, $options: "i" } },
    ],
  });
};
