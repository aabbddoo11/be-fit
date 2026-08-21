
import Order from "../models/Orders.js";
import mongoose from "mongoose";

export const getOrders = async (req, res) => {
    try {
        const id = req.user.id;

        const orders = await Order.find({
            user: id
        })
            .populate("products.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            orders
        });

    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(500).json({
            message: "Server Error, please try again later"
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const id = req.user.id;
        const orderId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            user: id,
            _id: orderId
        }).populate("products.product");

        if (!order) {
            return res.status(404).json({
                message: "There is no Order for this user"
            });
        }

        return res.status(200).json({
            order
        });

    } catch (error) {
        console.error("Get order by id error:", error);

        return res.status(500).json({
            message: "Server Error, please try again later"
        });
    }
};

export const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const id = req.user.id;
        const orderId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        session.startTransaction();

        const order = await Order.findOne({
            user: id,
            _id: orderId
        })
            .populate("products.product")
            .session(session);

        if (!order) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Order has not been found"
            });
        }

        if (order.status !== "Pending") {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Order can not be canceled"
            });
        }

        for (const item of order.products) {
            if (!item.product) {
                continue;
            }

            item.product.stock += item.quantity;

            await item.product.save({
                session
            });
        }

        order.status = "Canceled";

        await order.save({
            session
        });

        await session.commitTransaction();

        return res.status(200).json({
            message: "Your order has been canceled",
            order
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error("Cancel order error:", error);

        return res.status(500).json({
            message: "Server error, please try again later"
        });

    } finally {
        await session.endSession();
    }
};

export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user.id;

        const {
            products,
            totalPrice,
            shippingAddress,
            orderNumber,
            paymentMethod
        } = req.body;

        if (
            !shippingAddress ||
            typeof shippingAddress !== "object"
        ) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        const requiredAddressFields = [
            "firstName",
            "lastName",
            "phone",
            "email",
            "country",
            "address",
            "zip"
        ];

        for (const field of requiredAddressFields) {
            if (
                !shippingAddress[field] ||
                String(shippingAddress[field]).trim() === ""
            ) {
                return res.status(400).json({
                    message: `${field} is required`
                });
            }
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "Order products are required"
            });
        }

        if (
            !Number.isFinite(Number(totalPrice)) ||
            Number(totalPrice) < 0
        ) {
            return res.status(400).json({
                message: "Invalid total price"
            });
        }

        session.startTransaction();

        const order = new Order({
            user: userId,
            products,
            totalPrice: Number(totalPrice),
            shippingAddress: {
                firstName: shippingAddress.firstName.trim(),
                lastName: shippingAddress.lastName.trim(),
                phone: shippingAddress.phone.trim(),
                email: shippingAddress.email.trim(),
                country: shippingAddress.country.trim(),
                address: shippingAddress.address.trim(),
                zip: shippingAddress.zip.trim()
            },
            orderNumber,
            paymentMethod
        });

        await order.save({
            session
        });

        await session.commitTransaction();

        const populatedOrder = await Order.findById(order._id)
            .populate("products.product");

        return res.status(201).json({
            message: "Order created successfully",
            order: populatedOrder
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error("Create order error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Order number already exists"
            });
        }

        return res.status(500).json({
            message: "Server error, please try again later"
        });

    } finally {
        await session.endSession();
    }
};

