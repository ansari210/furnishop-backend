import stripe from "stripe";

const stripeClient = new stripe(
  "sk_live_CUVyTk8BpzaPc2nUXWRNwasK002PNVOTdn",
  undefined as any
);

export const createCheckoutSessionService = async (line_items: any) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    return session;
  } catch (error: any) {
    console.log(error);
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
