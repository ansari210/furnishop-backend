import { getCouponByIdService } from "../services/coupon-services";
import { getPercentagePrice } from "./GetDiscountPrice";

export default async function createKlarnaPayload(order: any) {
  const line_items = order?.orderItems?.map((item: any) => {
    return {
      reference: item?._id,
      name: item?.name,
      quantity: item?.quantity,
      image_url: item?.image,
      tax_rate: 0,
      unit_price: Number((item?.price || 0) / (item?.quantity || 0)) * 100,
      total_amount: (item?.price || 0) * 100,
      total_tax_amount: 0,
      total_discount_amount: 0,
    };
  });

  if (!order) throw new Error("Order not found");

  const coupon = await getCouponByIdService(order?.discount?.percent);

  if (coupon) {
    return {
      purchase_country: "GB",
      purchase_currency: "GBP",
      merchant_reference1: `#${order?.orderId}`,
      merchant_reference2: order?._id,
      locale: "en-GB",
      order_amount: getPercentagePrice(order.totalPrice, coupon?.percent),
      order_tax_amount: 0,
      order_lines: line_items,
      customer: {
        type: "person",
      },
      merchant_urls: {
        confirmation: `${process.env.BASE_URL}/api/order/success/${order?._id}`,
      },
    };
  } else {
    return {
      purchase_country: "GB",
      purchase_currency: "GBP",
      merchant_reference1: `#${order?.orderId}`,
      merchant_reference2: order?._id,
      locale: "en-GB",
      order_amount: (order?.totalPrice || 0) * 100,
      order_tax_amount: 0,
      order_lines: line_items,
      customer: {
        type: "person",
      },
      merchant_urls: {
        confirmation: `${process.env.BASE_URL}/api/order/success/${order?._id}`,
      },
    };
  }
}
