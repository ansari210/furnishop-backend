import nodemailer from "nodemailer";
import Order from "../models/orders";
// import { google } from "googleapis";
import { magicLinkTemplate } from "../templates/magic-link";
import { orderDetailsTemplate } from "../templates/order-details";
import { orderStatusTemplate } from "../templates/order-status";

const transporter = nodemailer.createTransport({
  host: "smtppro.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: "info@bedsdivans.co.uk",
    pass: "DuuA1N6wPXh6",
  },
} as any);

export const sendMagicLinkService = async (
  email: string,
  redirectTo: string
) => {
  //   const CLIENT_ID = process.env.CLIENT_ID;
  //   const CLIENT_SECRET = process.env.CLIENT_SECRET;
  //   const REDIRECT_URI = process.env.REDIRECT_URI;
  //   const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  //   const oAuth2Client = new google.auth.OAuth2(
  //     CLIENT_ID,
  //     CLIENT_SECRET,
  //     REDIRECT_URI
  //   );

  //   oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  return new Promise(async (resolve, reject) => {
    // const accessToken = oAuth2Client.getAccessToken((err: any, token) => {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     return token;
    //   }
    // });

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     type: "OAuth2",
    //     user: "singheklavyaofficial@gmail.com",
    //     clientId: CLIENT_ID,
    //     clientSecret: CLIENT_SECRET,
    //     refreshToken: REFRESH_TOKEN,
    //     accessToken: accessToken,
    //   },
    //   tls: {
    //     rejectUnauthorized: true,
    //   },
    // } as any);

    const message = {
      from: "Furnishop <info@bedsdivans.co.uk>",
      to: email,
      subject: "Furnishop - Verify Your Account",
      html: magicLinkTemplate({ redirectTo }),
    };

    transporter.sendMail(message, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

export const sendOrderDetailsService = async (
  email: string,
  orderId: string
) => {
  const findOrder = await Order.findByIdAndUpdate(orderId);

  const template = orderStatusTemplate({
    orderId: findOrder?.orderId as any,
    orderAt: findOrder?.createdAt as any,
    orderItems: findOrder?.orderItems as any,
    totalPrice: findOrder?.totalPrice || 0,
    shippingPrice: 0,
    user: findOrder?.user as any,
    shippingAddress: findOrder?.shippingAddress as any,
    billingAddress:
      (findOrder?.billingAddress as any) || (findOrder?.shippingAddress as any),
    paymentMethod: findOrder?.payment?.paymentMethod as any,
    // order processing
    subject: "Your Furnishop order has been received!",
    message: `Hi ${findOrder?.user?.firstName}, <br> <br> Thank you for placing your order with DBZ Khan LTD. @Bedsdivans.co.uk <br> <br> We have received your order, which is currently in process with our logistics team awaiting to be scheduled on a route for delivery. <br> <br> Our aim is to deliver your items within 3-5 working days from when you have placed the order between the hours of 7am-7pm mon-fri. <br> <br> If your delivery address falls within the 100 mile radius of our postcode (WV14 7HZ) then your estimated delivery will be as mentioned above, (within 3-5 working days). <br> <br> However, if your delivery address falls above the 100 mile radius of our (wv14 7hz) postcode then the estimated delivery will be between 3-7 working days with our third-party courier provider (sgk logistics) who will get in touch regarding a delivery day & time via email & text. <br> <br> Our office staff will call/text or email you 24hrs-48hrs prior to your scheduled delivery day to confirm the time of delivery. <br> <br> Furthermore, providing your correct contact details will speed the delivery process. <br> <br>  If you require further assistance then please do read our policy & warranty guidelines and useful information section on our website.`,
  });

  await sendEmailWithTemplate(
    findOrder?.user?.email as any,
    template,
    "Your Furnishop order has been received!"
  );
};

export const sendEmailWithTemplate = async (
  email: string,
  template: string,
  subject: string
) => {
  //   const CLIENT_ID = process.env.CLIENT_ID;
  //   const CLIENT_SECRET = process.env.CLIENT_SECRET;
  //   const REDIRECT_URI = process.env.REDIRECT_URI;
  //   const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  //   const oAuth2Client = new google.auth.OAuth2(
  //     CLIENT_ID,
  //     CLIENT_SECRET,
  //     REDIRECT_URI
  //   );

  //   oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  return new Promise(async (resolve, reject) => {
    // const accessToken = oAuth2Client.getAccessToken((err: any, token) => {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     return token;
    //   }
    // });

    const message = {
      from: "furnishop@noreply <info@bedsdivans.co.uk>",
      to: email,
      subject: subject,
      html: template,
    };

    return transporter.sendMail(message, function (err, info) {
      if (err) {
        reject(err?.message);
      } else {
        resolve(info);
      }
    });
  });
};
