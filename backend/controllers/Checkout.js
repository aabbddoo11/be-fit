import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Orders.js";

export const checkout = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const id = req.user.id;
    const { paymentMethod, shippingAddress } = req.body;

    if (
      !paymentMethod ||
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.email ||
      !shippingAddress.address ||
      !shippingAddress.address.country ||
      !shippingAddress.address.city ||
      !shippingAddress.address.street ||
      !shippingAddress.address.zip
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "All shipping information and payment method are required",
      });
    }

    const [firstName, ...lastNameParts] = shippingAddress.name.trim().split(" ");
    const lastName = lastNameParts.join(" ") || firstName;

    const cart = await Cart.findOne({ user: id })
      .populate("products.product")
      .session(session);

    if (!cart || cart.products.length === 0) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Your Cart is empty",
      });
    }

    for (const item of cart.products) {
      if (!item.product) {
        await session.abortTransaction();

        return res.status(400).json({
          message: "One of the products in your cart no longer exists",
        });
      }

      if (item.quantity > item.product.stock) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `Not enough stock for ${item.product.name}. Available units are ${item.product.stock}`,
        });
      }
    }

    const totalPrice = cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const orderProducts = cart.products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
    }));

    let orderNumber;
    let orderNumberExists = true;

    while (orderNumberExists) {
      orderNumber = Math.floor(100000 + Math.random() * 900000);

      const existingOrder = await Order.findOne({
        orderNumber,
      }).session(session);

      orderNumberExists = !!existingOrder;
    }

    const [newOrder] = await Order.create(
      [
        {
          user: id,
          orderNumber,
          products: orderProducts,
          totalPrice,
          shippingAddress: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: shippingAddress.phone.trim(),
            email: shippingAddress.email.trim(),
            country: shippingAddress.address.country.trim(),
            city: shippingAddress.address.city.trim(),
            address: shippingAddress.address.street.trim(),
            zip: shippingAddress.address.zip.trim(),
          },
          paymentMethod,
          status: "Pending",
        },
      ],
      { session }
    );

    for (const item of cart.products) {
      item.product.stock -= item.quantity;

      await item.product.save({
        session,
      });
    }

    cart.products = [];

    await cart.save({
      session,
    });

    await session.commitTransaction();

    return res.status(201).json({
      message: "Order has been placed",
      newOrder,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Checkout transaction error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  } finally {
    session.endSession();
  }
};
