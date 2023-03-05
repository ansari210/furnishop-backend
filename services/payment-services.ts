import stripe from "stripe";
import axios from "axios";
import { getCouponByIdService } from "./coupon-services";
import { getDiscountCouponPrice } from "../utils/GetDiscountPrice";
import createKlarnaPayload from "../utils/CreateKlarnaPayload";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
const sdk = require("api")("@clearpay-online/v2#1cjo2ll9zk68ae");

import Client = require("@amazonpay/amazon-pay-api-sdk-nodejs");

//INITIALIZATION AND CONFIGURATION
const PRODUCTION_MODE = true;

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

const AMAZON_PAY_CLIENT_ID =
  "amzn1.application-oa2-client.78a09ba05239471a938c8cb9a83d08c4";
const AMAZON_PAY_CLIENT_SECRET =
  "1f52d4fb3399edc9dc2594c97967eb94e4c5ced05183a29d050f10267128df56";

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

sdk.auth(
  "400251166",
  "b889523ab62ade54370313d2c819c013894950bb0dfb00a1dde79ab297cd90036d0d5053fc7e45e984e56d64cb44cf1050390ab98a5b8cfd5cd766f8fbfab9d9"
);
export const clearPayCreateSessionService = async (orderInfo: any) => {
  try {
    const session = await sdk.createCheckout(orderInfo);
    return session;
  } catch (error: any) {
    console.log({ error });
    throw new Error(error);
  }
};

export const amazonPayCreateSessionService = async (orderInfo: any) => {
  // @amazonpay/amazon-pay-api-sdk-nodejs

  const config = {
    publicKeyId: "SANDBOX-AGOCAOVIKBMLVD3QEPTQT75S",
    privateKey: fs.readFileSync("sandbox.pem"),
    region: "eu",
    sandbox: true,
  };

  const payload = {
    webCheckoutDetails: {
      checkoutReviewReturnUrl: "https://example.com/checkout/review",
      checkoutResultReturnUrl: "https://example.com/checkout/result",
    },
    storeId: "amzn1.application-oa2-client.78a09ba05239471a938c8cb9a83d08c4",

    chargeAmount: {
      amount: "2000",
      currencyCode: "GBP",
    },
    merchantMetadata: {
      merchantReferenceId: "123",
    },
  };

  const headers = {
    "x-amz-pay-idempotency-key": uuidv4().toString().replace(/-/g, ""),
  };

  const testPayClient = new Client.WebStoreClient(config);

  testPayClient.createCheckoutSession(payload, headers).then((data) => {
    console.log({ data });
    return data;
  });
};
