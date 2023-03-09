//orders schema
import { Schema, model } from "mongoose";
import Counter from "./counters";

export interface IOrder extends Document {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  orderId: Number;

  orderItems: [
    {
      name: string;
      size: string;
      quantity: number;
      accessories: string[];
      price: number;
      image: string;
    }
  ];

  totalPrice: number;

  shippingAddress: {
    address: string;
    townCity: string;
    postalCode: string;
    country: string;
    companyName: string;
  };

  orderNotes: string;

  payment: {
    paymentMethod: string;
    paymentResult: {
      id: string;
      status: string;
      update_time: string;
      email_address: string;
    };
  };

  isDelivered: boolean;

  deliveredAt: Date;

  createdAt: Date;

  updatedAt: Date;

  notes: {
    content: string;
  }[];
  adminImage: string;
  isDeleted: boolean;

  __v: number;

  discount: {
    price: number;
    percent: number;
    code: string;
  };
  lastModifiedBy: any;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    isDeleted: { type: Boolean, default: false },

    orderId: { type: Number, required: false },

    orderItems: [
      {
        name: { type: String, required: false },
        quantity: { type: Number, required: true },
        accessories: { type: Object, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        categories: { type: Array, required: false },
      },
    ],

    totalPrice: { type: Number, required: true },

    discount: {
      price: { type: Number, required: false },
      percent: { type: Number, required: false },
      code: { type: String, required: false },
    },

    shippingAddress: {
      address: { type: String, required: false },
      townCity: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },
      companyName: { type: String, required: false },
    },

    orderNotes: { type: String, required: false },

    payment: {
      paymentMethod: {
        type: String,
        required: true,
        enum: ["stripe", "cash-on-delivery", "klarna", "clearpay", "amazonpay"],
      },
      paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
      },
      status: { type: String, required: true, default: "PENDING_PAYMENT" },
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },
    notes: [
      {
        content: {
          type: String,
        },
        createdBy: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    adminImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function (next) {
  Counter.findByIdAndUpdate(
    { _id: "orderId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
    (err, counter) => {
      if (err) {
        return next(err);
      }
      this.orderId = counter.seq;
      next();
    }
  );
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
