import { isValidObjectId } from "mongoose";
import headboards, { IHeadboard } from "../models/headboards";
import headboardVariants from "../models/headboardVariants";

//create headboard service

export const createHeadboardService = async (headboard: IHeadboard) => {
    const newHeadboard = new headboards(headboard);
    return await newHeadboard.save();
};

//get headboard by id service
export const getHeadboardByIdService = async (id: string) => {
    return await headboards.findById(id);
};
export const getHeadboardByIdServiceWithVariants = async (id: string) => {
    return await headboards.findById(id).populate("variants");
};

//get all headboards service
export const getAllHeadboardsService = async () => {
    return await headboards.find();
};

export const getHeadboardCountService = async (filter: any) => {
    return await headboards.countDocuments(filter);
};

export const getHeadboardWithVariantService = async (
    page: number | undefined,
    limit: number | undefined,
    category: string | undefined,
    returnNoVariants: boolean | undefined
) => {
    if (returnNoVariants) {
        const searchPayload: any = {};

        if (category) {
            searchPayload.categories = { $elemMatch: { $eq: category } };
        }

        const headboardsData = (await headboards
            .find(searchPayload)
            .populate({
                path: "variants",
                select: "_id accessories.color size price image",
                perDocumentLimit: 1,
            })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(limit) * (Number(page) - 1))
            .lean()) as any;

        headboardsData?.map((headboard: any) => {
            if (headboard && headboard?.variants[0]?.image) {
                headboard.image = headboard?.variants[0]?.image;
            }
        });

        const totalHeadboardCount = await getHeadboardCountService(
            searchPayload
        );
        const pages = Math.ceil(Number(totalHeadboardCount) / Number(limit));
        return { data: headboardsData, pages };
    } else {
        const searchPayload: any = {
            "variants.0": { $exists: true },
            isDraft: { $ne: true },
        };

        if (category) {
            searchPayload.categories = { $elemMatch: { $eq: category } };
        }

        const bedsWithBaseImage = (await headboards
            .find(searchPayload)
            .populate({
                path: "variants",
                select: "_id accessories.color size price image",
                perDocumentLimit: 1,
            })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(limit) * (Number(page) - 1))
            .lean()) as any;

        bedsWithBaseImage.map((bed: any) => {
            if (bed && bed?.variants[0]?.image) {
                bed.image = bed?.variants[0]?.image;
                bed.price = bed?.variants[0]?.price;
            }
        });

        const totalHeadboardCount = await getHeadboardCountService(
            searchPayload
        );
        const pages = Math.ceil(Number(totalHeadboardCount) / Number(limit));

        return { data: bedsWithBaseImage, pages };
    }
};

//update headboard service
export const updateHeadboardService = async (
    id: string,
    headboard: IHeadboard
) => {
    return await headboards.findByIdAndUpdate(id, headboard);
};

//delete headboard service
export const deleteHeadboardService = async (id: string) => {
    return await headboards.findByIdAndDelete(id);
};

export const getHeadboardVariantByIdService = async (id: string) => {
    if (!id) {
        throw Error("ID is required");
    }

    if (!isValidObjectId(id)) {
        throw Error("Invalid ID provided.");
    }

    const getBedVariant = await headboardVariants.findById(id);

    if (!getBedVariant) {
        throw Error("No Bed Variant Found");
    }

    return getBedVariant;
};
