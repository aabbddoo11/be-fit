
import mongoose, { Schema } from "mongoose";
const cartSchema= new Schema({
    user:{
        type : Schema.Types.ObjectId,
        ref : 'User',
        unique : true,    required: true

    },
    products: [
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",    required: true

        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,    required: true

        }
    }
]
} , {timestamps :true});
const Cart = mongoose.model("cart",cartSchema);
export default Cart;