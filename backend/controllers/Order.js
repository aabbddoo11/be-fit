import Order from "../models/Orders.js";
import mongoose from "mongoose";

export const getOrders = async (req, res) => {
    try {
        const id = req.user.id;

        const orders = await Order.find({ user: id })
            .populate("products.product")
            .sort({ _id: -1 });

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

        // ⭐ لا يمكن إلغاء الطلب إلا إذا كان Pending
        if (order.status !== "Pending") {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Order can not be canceled"
            });
        }

        // ⭐ إعادة الكمية إلى Stock
        for (const item of order.products) {
            item.product.stock += item.quantity;

            await item.product.save({ session });
        }

        // ⭐ تغيير حالة الطلب
        order.status = "Canceled";

        await order.save({ session });

        // ⭐ تثبيت جميع التغييرات
        await session.commitTransaction();

        return res.status(200).json({
            message: "Your order has been canceled",
            order
        });

    } catch (error) {
        await session.abortTransaction();

        console.error("Cancel order error:", error);

        return res.status(500).json({
            message: "Server error, please try again later"
        });

    } finally {
        session.endSession();
    }
};