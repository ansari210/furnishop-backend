import { model, Schema } from "mongoose"

const reviewSchema = new Schema(
    {

        name: {
            type: String,
            required: true
        },
        review: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        }
    }
)

export default model('reviews', reviewSchema)
