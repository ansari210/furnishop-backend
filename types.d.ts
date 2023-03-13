declare namespace Express {
  export interface Request {
    user: any;
    io: any;
  }
  export interface Response {
    user: any;
  }
}

interface IActiveUser {
  socketId: string;
  orderId?: string;
  name?: string;
}

declare module "@amazonpay/amazon-pay-api-sdk-nodejs" {
  interface AmazonPayClient {}
}
