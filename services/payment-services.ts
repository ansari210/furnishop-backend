import stripe from "stripe";

const stripeClient = new stripe(
  "sk_test_51JXndeSCcM1FuO5Bq3FH8TTDggwtXoGMxWi4wtHtz5AbcoLwuGlxp8Nlr7j42rnXRsrwWGC0pZpDLo2lnydXPoGF00rEnGP4NL",
  undefined as any
);

export const createCheckoutSessionService = async (
  line_items: any,
  orderId: string,
  mongoObjectId: string
) => {
  try {
    if (!orderId) throw new Error("OrderId not found");
    const session = await stripeClient.checkout.sessions.create({
      client_reference_id: String(orderId),
      payment_intent_data: {
        description: "Beds Divans Order #" + String(orderId),
        metadata: {
          order_id: String(orderId),
        },
      },
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/api/order/success/${mongoObjectId}`,
      cancel_url: `${process.env.BASE_URL}/api/order/cancel/${mongoObjectId}`,
    });
    return session;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// export const createCheckoutSessionService = async ({ amount, id }: any) => {
//     const payment = await stripeClient.paymentIntents.create({
//         amount: amount,
//         currency: "USD",
//         description: "Your Company Description",
//         payment_method: id,
//         confirm: true,
//     });
//     return payment;
// };
