//find headboard by id

import beds from "../models/beds";
import bedsVariants, { BedVarient } from "../models/bedsVariants";

export const findHeadboardByIdService = async (
    bedId: string,
    headboardId: string
) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const headboard = bed.accessories.headboard.find(
        (headboard) => headboard._id == headboardId
    );

    if (!headboard) {
        return null;
    }

    return headboard;
};

//find feet by id

export const findFeetByIdService = async (bedId: string, feetId: string) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const feet = bed.accessories.feet.find((feet) => feet._id == feetId);

    if (!feet) {
        return null;
    }

    return feet;
};

//find storage by id

export const findStorageByIdService = async (
    bedId: string,
    storageId: string
) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const storage = bed.accessories.storage.find(
        (storage) => storage._id == storageId
    );

    if (!storage) {
        return null;
    }

    return storage;
};

//find mattress by id

export const findMattressByIdService = async (
    bedId: string,
    mattressId: string
) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const mattress = bed.accessories.mattress.find(
        (mattress) => mattress._id == mattressId
    );

    if (!mattress) {
        return null;
    }

    return mattress;
};

//find color by id

export const findColorByIdService = async (bedId: string, colorId: string) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const color = bed.accessories.color.find((color) => color._id == colorId);

    if (!color) {
        return null;
    }

    return color;
};
//find firm by id
export const findFirmnessByIdService = async (bedId: string, firmId: string) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const firmness = bed.accessories.color.find((firmness) => firmness._id == firmId);

    if (!firmness) {
        return null;
    }

    return firmness;
};
//find gaslift by id
export const findGasLiftByIdService = async (bedId: string, colorId: string) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const gaslift = bed.accessories.color.find((gaslift) => gaslift._id == colorId);

    if (!gaslift) {
        return null;
    }

    return gaslift;
};

//find bed by id
export const findBedVariantWithProductNameByIdService = async (
    bedId: string,
    bedsVariantId: string
) => {
    const bed = (await beds
        .findOne({ _id: bedId }, { name: 1, categories: 1 })
        .lean()) as any;

    if (!bed) {
        throw new Error("Bed not found");
    }

    const bedVariant = (await bedsVariants
        .findOne({ _id: bedsVariantId })
        .populate({
            path: "accessories.color.name accessories.headboard.name accessories.storage.name accessories.feet.name accessories.mattress.name",
            select: "label value image",
        })
        .lean()) as any;

    if (!bedVariant) {
        throw new Error("Bed variant not found");
    }

    bedVariant.name = bed.name;
    bedVariant.categories = bed.categories;

    return bedVariant;
};

//find accessories locally

interface BedWithVariant extends BedVarient {
    name: string;
    categories: string[];
}

export const findAccessoriesLocallyService = (
    bed: BedWithVariant,
    headboardId: string,
    feetId: string,
    mattressId: string,
    colorId: string,
    storageId: string,
    gasliftId:string,
    firmnessId:string,
) => {
    const variant = {
        price: bed.price.salePrice,
        size: bed.size,
        image: bed.image,
    };

    const headboard = bed.accessories.headboard.find(
        (headboard) => headboard._id == headboardId
    ) as any;

    if (headboard) {
        headboard.name = headboard?.name?.label;
    }

    const size = bed.size;
    const sizePrice = bed.price.salePrice;

    const feet = bed.accessories.feet.find((feet) => feet._id == feetId) as any;

    if (feet) {
        feet.name = feet?.name?.label;
    }

    const mattress = bed.accessories.mattress.find(
        (mattress) => mattress._id == mattressId
    ) as any;

    if (mattress) {
        mattress.name = mattress?.name?.label;
    }

    const color = bed.accessories.color.find(
        (color) => color._id == colorId
    ) as any;

    if (color) {
        color.name = color?.name?.label;
    }

    const storage = bed.accessories.storage.find(
        (storage) => storage._id == storageId
    ) as any;

    if (storage) {
        storage.name = storage?.name?.label;
    }

    const gaslift = bed.accessories.gaslift.find(
        (gaslift) => gaslift._id == gasliftId
    ) as any;
     if(gaslift){
        gaslift.name=gaslift?.name.label;
     }
    
     const firmness = bed.accessories.firmness.find(
        (firmness) => firmness._id == firmnessId
    ) as any;
     if(firmness){
        firmness.name=firmness?.name.label;
     }

    const accessories = {
        headboard,
        feet,
        mattress,
        color,
        storage,
        variant,
        firmness,
        gaslift,
        totalPrice:
            Number(variant?.price || 0) +
            Number(headboard?.price || 0) +
            Number(storage?.price || 0) +
            Number(mattress?.price || 0) +
            Number(feet?.price || 0)+
            Number(firmness?.price ||0)+
            Number(gaslift?.price || 0),

        name: bed?.name,
        categories: bed?.categories,
        size: {
            name: size,
            price: sizePrice,
        },
    };

    return accessories;
};
