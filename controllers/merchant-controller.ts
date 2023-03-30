import beds from "../models/beds";
import { Request, Response } from "express";
import { insertDataToMerchant } from "../services/google-services";
import { randomInt } from "crypto";

const endpoint = `https://bedsdivans.co.uk/product`;

type VarientsTypes = {
  price: {
    basePrice: number;
    salePrice: number;
  };
  accessories: {
    color: {
      name: string;
    }[];
  };
  _id: string;
  size: string;
  image: string;
};
//get order by id controller
export const getProductByIdController = async (req: Request, res: Response) => {
  const { id } = req.params as any;
  try {
    const product = await beds.findOne({ _id: id }).populate({
      path: "variants",
      select: `_id accessories.color size price image`,
      perDocumentLimit: 1,
    });
    const variant = product?.variants[0] as unknown as VarientsTypes;
    const response = await insertDataToMerchant({
      batchId: randomInt(0, 99999),
      offerId: `${randomInt(0, 9999)}`,
      title: product?.name as string,
      description: product?.metaDescription || (product?.description as string),
      color: variant?.accessories?.color[0]?.name,
      imageLink: variant?.image,
      link: `${endpoint}/${product?.slug}`,
      mobileLink: `${endpoint}/${product?.slug}`,
      price: {
        value: `${variant?.price?.basePrice}`,
        currency: "GBP",
      },
      sizes: [variant?.size],
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).send(error);
  }
};
