import coupons from "../models/coupons";

interface ICoupon {
  label: string;
  percent: number;
  max: number;
  min: number;
  description: string;
}

export const createCouponService = async ({
  label,
  percent,
  max,
  min,
  description,
}: ICoupon) => {
  const findCoupon = await coupons.findOne({ label });
  if (findCoupon) {
    throw new Error("Coupon already exists");
  }
  const newCoupon = await coupons.create({
    label,
    percent,
    max,
    description,
    min,
  });
  return newCoupon;
};

export const getAllCouponsService = async () => {
  const coupon = await coupons.find();
  return coupon;
};

export const getCouponByIdService = async (id: string) => {
  const coupon = await coupons.findById(id);
  return coupon;
};

export const getCouponByLabelService = async (label: string) => {
  const coupon = await coupons.findOne({ label });
  return coupon;
};

export const updateCouponService = async (id: string, data: ICoupon) => {
  const coupon = await coupons.findByIdAndUpdate(id, data);
  return coupon;
};

export const deleteCouponService = async (id: string) => {
  const coupon = await coupons.findByIdAndDelete(id);
  return coupon;
};
