import Order from "../models/Orders.js";
import Product from "../models/Product.js";
export const getOrders = async (req, res) => {

    try {
        const id = req.user.id;
        const orders = await Order.find({ user: id });
        if (orders.length === 0) {
            return res.status(404).json({ message: 'There is no Orders' })
        } else { return res.status(200).json({ orders }) }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error, please try again later' })
    }
}
export const getOrderById = async (req, res) => {
    try {
        const id = req.user.id;
        const orderId = req.params.id
        const order = await Order.findOne({ user: id, _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'There is no Orders for this user' })

        }
        return res.status(200).json({ order })

    }
    catch (error) {
        return res.status(500).json({ message: 'Server Error, please try again later' })

    }



}
export const cancelOrder = async (req,res) => {
    try {
        const id = req.user.id;
        const orderId = req.params.id;
        const order = await Order.findOne({
            user : id,
            _id : orderId

        }).populate("products.product")
        if (!order) {
            return res.status(404).json({message  : 'order has not been found'})
        }
        if (order.status === 'Pending') {
             for (const item of order.products) {
                item.product.stock += item.quantity;
                await item.product.save();
            }
            order.status = 'Canceled'
           
           await order.save()
            return res.status(200).json({message : 'Your order has been canceled'})
        }else{
return res.status(400).json({message : 'Order can not be Canceled'})
        }
    } catch (error) {
                return res.status(500).json({ message: 'Server Error, please try again later' })

    }
}