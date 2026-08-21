import mongoose, { Schema } from "mongoose";

const ordersSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
          required: true,
        },

        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

     

      

      address: {
        type: String,
        required: true,
        trim: true,
      }

      
    },

    orderNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "Cash On Deliverey",
        "Visa",
        "Vodafone Cash",
      ],
      default: "Cash On Deliverey",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Canceled",
        "Processing",
        "Out for Delivery",
        "Delivered",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("order", ordersSchema);

export default Orders;
