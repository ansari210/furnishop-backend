interface IDiscountProps {
  percent: number;
  max: number;
  price: number;
}

export const getDiscountCouponPrice = ({
  percent,
  max,
  price,
}: IDiscountProps) => {
  const discountAmount = (price * percent) / 100;
  if (discountAmount > max) {
    return price - max;
  } else {
    return price - discountAmount;
  }
};

export const getPercentagePrice = (total: number, discountPct: number) => {
  return (total * discountPct) / 100;
};
