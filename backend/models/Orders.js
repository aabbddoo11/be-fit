import mongoose, { Schema } from "mongoose";
const ordersSchema = new Schema({
    user :{
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    products : [{
        product : {
 type : Schema.Types.ObjectId,
        ref : 'Product',
        required : true
        },
         quantity: {
            type: Number,
            default: 1,
            min: 1,    required: true

        },
         priceAtPurchase: {
            type: Number,
            required: true

        }
    
    
    }
    ],
    totalPrice :{
         type: Number,
            required: true

    }
,
shippingAddress : {
    type: String,
            required: true
},
orderNumber: {
    type: Number,
    required: true,
    unique: true
},
paymentMethod: {
    type: String,
    required: true,
    enum: ["Cash On Deliverey", "Visa", "Vodafone Cash"],
        default : "Cash On Deliverey"

},
status: {
    type: String,
    enum: ["Pending", "Canceled","Processing", "Out for Delivery", "Delivered"],
    default : "Pending"
}

})

const Orders = mongoose.model('Order',ordersSchema)
export default Orders;