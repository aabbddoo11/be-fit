import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Orders.js";
import createNotification from "../utils/createNotification.js";

export const checkout = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const id = req.user.id;

    const {
      paymentMethod,
      shippingAddress,
      couponCode,
    } = req.body;

    if (
      !paymentMethod ||
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.email ||
      !shippingAddress.address ||
      !shippingAddress.address.street
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message:
          "All shipping information and payment method are required",
      });
    }

    const [firstName, ...lastNameParts] =
      shippingAddress.name.trim().split(" ");

    const lastName =
      lastNameParts.join(" ") || firstName;

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
          message:
            "One of the products in your cart no longer exists",
        });
      }

      if (item.quantity > item.product.stock) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `Not enough stock for ${item.product.name}. Available units are ${item.product.stock}`,
        });
      }
    }

    const subtotal = cart.products.reduce(
      (total, item) => {
        return (
          total +
          item.product.price * item.quantity
        );
      },
      0
    );

    const shipping = subtotal >= 2000 ? 0 : 100;

    let discount = 0;
    let appliedCouponCode = null;

    if (couponCode && couponCode.trim()) {
      const code = couponCode.trim().toUpperCase();

      if (code === "WELCOME10") {
        discount = subtotal * 0.1;
        appliedCouponCode = "WELCOME10";
      } else {
        await session.abortTransaction();

        return res.status(400).json({
          message: "Invalid discount code",
        });
      }
    }

    const totalPrice =
      subtotal + shipping - discount;

    const orderProducts = cart.products.map(
      (item) => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      })
    );

    let orderNumber;
    let orderNumberExists = true;

    while (orderNumberExists) {
      orderNumber = Math.floor(
        100000 + Math.random() * 900000
      );

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

          subtotal,
          shipping,
          discount,
          couponCode: appliedCouponCode,

          totalPrice,

          shippingAddress: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: shippingAddress.phone.trim(),
            email: shippingAddress.email.trim(),
            address:
              shippingAddress.address.street.trim(),
          },

          paymentMethod,
          status: "Pending",
        },
      ],
      {
        session,
      }
    );

    const outOfStockProducts = [];

    for (const item of cart.products) {
      const previousStock = Number(
        item.product.stock || 0
      );

      item.product.stock -= item.quantity;

      await item.product.save({
        session,
      });

      if (
        previousStock > 0 &&
        Number(item.product.stock) <= 0
      ) {
        outOfStockProducts.push({
          id: item.product._id,
          name: item.product.name,
        });
      }
    }

    cart.products = [];

    await cart.save({
      session,
    });

    await session.commitTransaction();

    for (const product of outOfStockProducts) {
      await createNotification({
        type: "low_stock",
        title: "Product Out of Stock",
        message: `${product.name} is now out of stock.`,
        product: product.id,
      });
    }

    await createNotification({
      type: "new_order",
      title: "New Order Received",
      message: `New order #${newOrder.orderNumber} has been placed.`,
      order: newOrder._id,
      user: id,
    });

    return res.status(201).json({
      message: "Order has been placed",

      newOrder,

      pricing: {
        subtotal,
        shipping,
        discount,
        couponCode: appliedCouponCode,
        total: totalPrice,
      },
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error(
      "Checkout transaction error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  } finally {
    session.endSession();
  }
};