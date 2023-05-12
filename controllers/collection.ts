import { ObjectId } from "mongodb";
import collection from "../models/collection";
import { Request, Response } from "express";
import upload from "../config/multer";
import { isValidObjectId } from "mongoose";
import { rm } from "fs/promises";
import { resiSizeBanner } from "../services/image-service";
import { existsSync } from "fs";
import path from "path";

//Get All Collection
export const getAllCollection = async (req: Request, res: Response) => {
  try {
    const createcollection = await collection.find().sort({ createdAt: -1 });
    res.status(200).json(createcollection);
  } catch (error) {
    res.status(500).send(error);
  }
};

//Get Single Collection By ID
export const getCollectionByID = async (req: Request, res: Response) => {
  // Validations...
  if (req.params.id) {
    try {
      const _id = new ObjectId(req.params.id);
      const data = await collection.findOne({ _id });
      if (!data) {
        return res.status(404).json({
          message: "Collection No Found",
        });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

// Cretate Collection
export const createCollection = async (req: Request, res: Response) => {
  //validation
  try {
    let { name } = req.body;
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "IMAGE is required",
      });
    }
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Collection Name and Banner  required",
      });
    }
    //check duplicasy collection
    const findDuplicateCollection = await collection.findOne({
      name: name,
    });

    if (findDuplicateCollection) {
      return res.status(400).send({
        success: false,
        message: "Collection already exists & must be unique",
      });
    }
    const getUrl = await resiSizeBanner(req.file, "banner");

    const collectionCategory = new collection({
      name: name,
      image: getUrl,
    });
    collectionCategory.save((err, data) => {
      if (err) throw err;
      res.send(data);
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Update Collection by Id
export const updateCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file ? req.file : undefined;
  const { name } = req.body;
  try {
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "valid id is required",
      });
    }
    const imageUrl = await resiSizeBanner(req.file, "banner");
    const response = await collection
      .findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: name,
            image: file ? imageUrl : undefined,
          },
        },
        { new: true }
      )
      .then((data) => {
        if (file) {
          // Delete old Banner
          const pathname = path.join(
            __dirname,
            `../banner/icons/${data?.image.split("/").pop()}`
          );
          if (existsSync(pathname)) {
            rm(pathname);
          }
        }
        console.log({ data });
        // res.send(data);
        res.status(200).json({ data });
      });
    console.log({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//Delete Collection By ID
export const collectionDelete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid id",
      });
    }
    const deleteBanner = collection.findByIdAndDelete(id);
    deleteBanner.exec((err, data) => {
      if (err) throw err;
      res.send(data);
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
