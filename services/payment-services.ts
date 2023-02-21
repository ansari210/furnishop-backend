import stripe from "stripe";

const stripeClient = new stripe(
  "sk_live_CUVyTk8BpzaPc2nUXWRNwasK002PNVOTdn",
  undefined as any
);

export const createCheckoutSessionService = async (
  line_items: any,
  orderId: string
) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
      client_reference_id: orderId,
      // metadata:{ //TO add additional data to the session
      //   orderId,
      // }
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/api/order/success/${orderId}`,
      cancel_url: `${process.env.BASE_URL}/api/order/cancel/${orderId}`,
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
