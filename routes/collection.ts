import { Router } from "express";
import { collectionDelete, createCollection, getAllCollection, getCollectionByID, updateCollection } from "../controllers/collection";
import upload from "../config/multer";

const router = Router({ mergeParams: true, strict: true, caseSensitive: true });

router.get("/", getAllCollection);
router.get("/:id", getCollectionByID,);
router.post("/", upload.single("image"), createCollection,);
router.put("/:id",upload.single("image"), updateCollection);
router.delete("/:id", collectionDelete);
export default router;



// import router from "./beds";
// import upload from "../config/multer";
// import collection from "../models/collection";
// import { resiSizeBanner } from "../services/image-service";
// import { isValidObjectId } from "mongoose";
// import { rm } from "fs/promises";
// import { existsSync } from "fs";
// import path from "path";


// //Create Collection
// router.post("/collection",upload.single("image"),async(req,res)=>{
//     try{
//         let{name}=req.body
//         if(!req.file){
//             return res.status(400).send({
//                 success: false,
//                 message: "IMAGE is required",
//               });
//         }
//         if (!name) {
//             return res.status(400).send({
//               success: false,
//               message: "Collection Name and Banner  required",
//             });
//           }
//      const findDuplicateCollection = await collection.findOne({
//             name:name,
//           });
     
    
//      if(findDuplicateCollection) {
//         return res.status(400).send({
//           success: false,
//           message: "Collection already exists & must be unique",
//         });
//       }
//       const getUrl = await resiSizeBanner(req.file, "banner");

//       const collectionCategory = new collection({
//         name:name,
//         image: getUrl,
//       });
//       collectionCategory.save((err, data) => {
//         if (err) throw err;
//         res.send(data);
//       });

//     }catch (error) {
//         res.status(500).send(error);
//       }
// }
// );

// //Get Collection
// router.get("/collection", (req, res) => {
//     const getcollection = collection.find({});
//     getcollection.exec((err, data) => {
//       if (err) throw err;
//       res.send(data);
//     });
//   });

// //Update Collection by Id
// router.patch("/update/:id", upload.single("image"), async (req, res) => {
//     const { id } = req.params;
//     const file = req.file ? req.file : undefined;
//     const { name, value } = req.body;
  
//     if (!id || !isValidObjectId(id)) {
//       if (file) {
//         await rm(file.path);
//       }
  
//       return res.status(400).send({
//         success: false,
//         message: "valid id is required",
//       });
//     }
  
//     try {
//       const imageUrl = await resiSizeBanner(req.file, value);
//       await collection
//         .findOneAndUpdate(
//           { _id: id },
//           {
//             $set: {
//               name: name,
//               value: value,
//               image: file ? imageUrl : undefined,
//             },
//           },
//           { multi: false, omitUndefined: true, new: false }
//         )
//         .then((data) => {
//           if (file) {
//             // Delete old Banner
//             const pathname = path.join(
//               __dirname,
//               `../banner/icons/${data?.image.split("/").pop()}`
//             );
//             if (existsSync(pathname)) {
//               rm(pathname);
//             }
//           }
  
//           res.send(data);
//         })
//         .catch(async (err) => {
//           if (file) {
//             await rm(file.path);
//           }
//           res.status(500).send(err);
//         });
//     } catch (error) {
//       if (file) {
//         await rm(file.path);
//       }
//       res.status(500).send(error);
//     }
//   });

//   //Delete Banner
//   router.delete("/banner/:id", (req, res) => {
//     try {
//       const id = req.params.id;
//       if (!isValidObjectId(id)) {
//         return res.status(400).send({
//           success: false,
//           message: "Invalid id",
//         });
//       }
//       const deleteBanner = collection.findByIdAndDelete(id);
//       deleteBanner.exec((err, data) => {
//         if (err) throw err;
//         res.send(data);
//       });
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });
  
//   export default router;