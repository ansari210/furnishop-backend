import stripe from "stripe";
import axios from "axios";
import { getCouponByIdService } from "./coupon-services";
import { getDiscountCouponPrice } from "../utils/GetDiscountPrice";
import createKlarnaPayload from "../utils/CreateKlarnaPayload";

//INITIALIZATION AND CONFIGURATION
const PRODUCTION_MODE = false;

const STRIPE_SECRET_KEY = (
  PRODUCTION_MODE
    ? "sk_live_CUVyTk8BpzaPc2nUXWRNwasK002PNVOTdn"
    : "sk_test_51JXndeSCcM1FuO5Bq3FH8TTDggwtXoGMxWi4wtHtz5AbcoLwuGlxp8Nlr7j42rnXRsrwWGC0pZpDLo2lnydXPoGF00rEnGP4NL"
) as string;

const KLARNA_URL = PRODUCTION_MODE
  ? "https://api.klarna.com"
  : "https://api.playground.klarna.com";

const KLARNA_USERNAME = PRODUCTION_MODE
  ? "K1091283_c00586368e18"
  : "PK70159_db1dd6c92247";

const KLARNA_PASSWORD = PRODUCTION_MODE
  ? "bZnO1gzxCa6qFJvu"
  : "UX4sVGUG9y78EvvF";

console.log({
  STRIPE_SECRET_KEY,
  KLARNA_URL,
  KLARNA_USERNAME,
  KLARNA_PASSWORD,
});

const stripeClient = new stripe(STRIPE_SECRET_KEY, undefined as any);

//SERVICE FUNCTIONS
export const createCheckoutSessionService = async (
  line_items: any,
  orderId: string,
  mongoObjectId: string,
  couponId: string
) => {
  try {
    if (!orderId) throw new Error("OrderId not found");

    if (couponId) {
      const coupon = await getCouponByIdService(couponId);

      const couponCode = await stripeClient.coupons.create({
        percent_off: coupon?.percent,
        duration: "forever",
      });

      console.log({ couponCode, coupon, couponId, line_items });
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
        discounts: [
          {
            coupon: couponCode.id,
          },
        ],
        success_url: `${process.env.BASE_URL}/api/order/success/${mongoObjectId}`,
        cancel_url: `${process.env.BASE_URL}/api/order/cancel/${mongoObjectId}`,
      });
      return session;
    }
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

export const createKlarnaSessionService = async (orderInfo: any) => {
  const klarnaSessionEndpoint = `${KLARNA_URL}/payments/v1/sessions`;
  console.log({ KLARNA_USERNAME, KLARNA_PASSWORD });
  try {
    const createSession = await axios.post(klarnaSessionEndpoint, orderInfo, {
      auth: {
        username: KLARNA_USERNAME || "",
        password: KLARNA_PASSWORD || "",
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log(createSession.data);
    return createSession.data;
  } catch (error: any) {
    console.log(error?.response?.data?.error_messages);
    throw new Error(error);
  }
};

export const klarnaPlaceOrderService = async (
  orderInfo: any,
  authorization_token: string
) => {
  const orderItems = await createKlarnaPayload(orderInfo);
  const klarnaPlaceOrderEndpoint = `${KLARNA_URL}/payments/v1/authorizations/${authorization_token}/order`;
  try {
    const placeOrder = await axios.post(klarnaPlaceOrderEndpoint, orderItems, {
      auth: {
        username: KLARNA_USERNAME || "",
        password: KLARNA_PASSWORD || "",
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return placeOrder.data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
