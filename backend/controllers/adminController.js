import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Orders.js";

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalOrders,
            totalUsers,
            totalProducts,
            salesResult,
            recentOrders,
            salesOverview
        ] = await Promise.all([
            Order.countDocuments(),

            User.countDocuments({
                role: "user"
            }),

            Product.countDocuments(),

            Order.aggregate([
                {
                    $match: {
                        status: { $ne: "Canceled" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSales: {
                            $sum: "$totalPrice"
                        }
                    }
                }
            ]),

            Order.find()
                .populate("user", "name email")
                .sort({ _id: -1 })
                .limit(5)
                .lean(),

            Order.aggregate([
                {
                    $match: {
                        status: { $ne: "Canceled" }
                    }
                },
                {
                    $project: {
                        totalPrice: 1,
                        orderDate: {
                            $toDate: "$_id"
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$orderDate" },
                            month: { $month: "$orderDate" }
                        },
                        sales: {
                            $sum: "$totalPrice"
                        },
                        orders: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
                }
            ])
        ]);

        const totalSales = salesResult.length > 0
            ? salesResult[0].totalSales
            : 0;

        const formattedSalesOverview = salesOverview.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            sales: item.sales,
            orders: item.orders
        }));

        return res.status(200).json({
            totalSales,
            totalOrders,
            totalUsers,
            totalProducts,
            recentOrders,
            salesOverview: formattedSalesOverview
        });

    } catch (error) {
        console.error("Admin dashboard error:", error);

        return res.status(500).json({
            message: "Server Error, please try again later"
        });
    }
};