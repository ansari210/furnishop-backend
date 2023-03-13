import { getDiscountPrice, getPercentagePrice } from "./GetDiscountPrice";

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

  if (order?.discount?.code) {
    line_items.push({
      name: `${order?.discount?.percent}% discount`,
      quantity: 1,
      reference: `discount-${order?.discount?.code}`,
      tax_rate: 0,
      total_amount:
        -getDiscountPrice(order.totalPrice, order?.discount?.percent) * 100,
      total_tax_amount: 0,
      unit_price:
        -getDiscountPrice(order.totalPrice, order?.discount?.percent) * 100,
    });
  }

  if (!order) throw new Error("Order not found");

  return {
    purchase_country: "GB",
    purchase_currency: "GBP",
    merchant_reference1: `#${order?.orderId}`,
    merchant_reference2: order?._id,
    locale: "en-GB",
    order_amount: order?.discount?.code
      ? getPercentagePrice(order.totalPrice, order?.discount?.percent) * 100
      : order.totalPrice * 100,

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
