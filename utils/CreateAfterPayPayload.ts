import { getDiscountPrice } from "./GetDiscountPrice";

export default async function createAfterPayPayload(order: any) {
  const line_items = order?.orderItems?.map((item: any) => {
    return {
      reference: String(item?._id),
      name: item?.name,
      quantity: item?.quantity,
      imageUrl: item?.image,
      price: {
        amount: Number((item?.price || 0) / (item?.quantity || 0)).toFixed(2),
        currency: "GBP",
      },
    };
  });

  const discounts = [];
  if (order?.discount?.code) {
    discounts.push({
      displayName: `${order?.discount?.percent}% discount - ${order?.discount?.code}`,
      amount: {
        amount: getDiscountPrice(
          order.totalPrice,
          order?.discount?.percent
        ).toFixed(2),
        currency: "GBP",
      },
    });
  }

  if (!order) throw new Error("Order not found");

  return {
    amount: { amount: order?.totalPrice?.toFixed(2), currency: "GBP" },
    items: line_items,
    taxAmount: { amount: "0.00", currency: "GBP" },
    shippingAmount: { amount: "0.00", currency: "GBP" },
    purchaseCountry: "UK",
    merchantReference: `#${order?.orderId}`,
    discounts: discounts,
    merchant: {
      redirectConfirmUrl: `${process.env.BASE_URL}/api/order/success/${order?._id}`,
      redirectCancelUrl: `${process.env.BASE_URL}/api/order/cancel/${order?._id}`,
      popupOriginUrl: `${process.env.CLIENT_URL}/cart`,
    },
    consumer: {
      givenNames: order?.user?.firstName,
      surname: order?.user?.lastName,
      email: order?.user?.email,
      phoneNumber: order?.user?.phone,
    },
    billing: {
      name: order?.user?.firstName,
      line1: order?.shippingAddress?.address,
      postcode: order?.shippingAddress?.postalCode,
      countryCode: "GB",
      area1: order?.shippingAddress?.townCity,
      region: "GB",
      phoneNumber: order?.user?.phone,
    },
    shipping: {
      name: order?.user?.firstName,
      line1: order?.shippingAddress?.address,
      postcode: order?.shippingAddress?.postalCode,
      countryCode: "GB",
      area1: order?.shippingAddress?.townCity,
      region: "GB",
      phoneNumber: order?.user?.phone,
    },
  };
}
