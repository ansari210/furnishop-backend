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
      name: {
        label?: string;
      };
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
    const insert = {
      batchId: randomInt(0, 99999),
      offerId: `${id}`,
      title: product?.name as string,
      description: product?.metaDescription || (product?.description as string),
      sizeguide:product?.sizeguide||(product?.sizeguide as string),
      color:
        (variant?.accessories?.color[0]?.name?.label as string) || "One Color",
      imageLink: variant?.image,
      link: `${endpoint}/${product?.slug}`,
      mobileLink: `${endpoint}/${product?.slug}`,
      price: {
        value: `${variant?.price?.basePrice}`,
        currency: "GBP",
      },
      sizes: [variant?.size],
    };
    const response = await insertDataToMerchant(insert);
    res.status(200).json({ merchant: response.data, ...insert });
  } catch (error: any) {
    res.status(500).send(error);
  }
};
