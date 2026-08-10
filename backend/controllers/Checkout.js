import Cart from "../models/Cart.js";
import Order from "../models/Orders.js";
export const checkout = async (req, res) => {
    try {
        const id = req.user.id;
        const { paymentMethod, shippingAddress } = req.body;

        if (!paymentMethod || !shippingAddress) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const cart = await Cart.findOne({ user: id })
            .populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(404).json({
                message: "Your Cart is empty"
            });
        }

        for (const item of cart.products) {
            if (item.quantity > item.product.stock) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.product.name}. Available units are ${item.product.stock}`
                });
            }
        }

        const totalPrice = cart.products.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        const orderProducts = cart.products.map((item) => {
            return {
                product: item.product._id,
                quantity: item.quantity,
                priceAtPurchase: item.product.price
            };
        });

        const newOrder = await Order.create({
            user: id,
            products: orderProducts,
            totalPrice,
            shippingAddress,
            paymentMethod
        });

        for (const item of cart.products) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        cart.products = [];
        await cart.save();

        return res.status(201).json({
            message: "Order has been placed",
            newOrder
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};