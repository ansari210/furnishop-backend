import { Document, model, Schema } from "mongoose";

export interface Collection extends Document{
    name:string;
    image: string;
}
const collectionSchema=new Schema<Collection>(
    {
        name:{
            type:String,
            required:true,
        },
        image:{
            type:String,
            required:true,
        }
    },
    {
        timestamps: true,
    }
)
export default model<Collection>("collection", collectionSchema);