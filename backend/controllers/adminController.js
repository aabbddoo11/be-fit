import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Orders.js";
import mongoose from "mongoose";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Canceled",
];

const PRODUCT_FIELDS = [
  "name",
  "description",
  "price",
  "oldPrice",
  "category",
  "brand",
  "flavor",
  "weight",
  "servings",
  "image",
  "gallery",
  "stock",
  "featured",
  "rating",
  "badge",
  "benefits",
  "ingredients",
];

const buildProductData = (body) => {
  const data = {};

  for (const field of PRODUCT_FIELDS) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  return data;
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      deliveredSalesResult,
      recentOrders,
      salesOverview,
      statusCountsResult,
    ] = await Promise.all([
      Order.countDocuments(),

      User.countDocuments({
        role: "user",
      }),

      Product.countDocuments(),

      // Sales are counted ONLY from delivered orders.
      Order.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: "$totalPrice",
            },
          },
        },
      ]),

      Order.find()
        .populate("user", "name email phone")
        .sort({ _id: -1 })
        .limit(5)
        .lean(),

      // Sales overview is also based ONLY on delivered orders.
      Order.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },
        {
          $project: {
            totalPrice: 1,
            orderDate: {
              $toDate: "$_id",
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$orderDate" },
              month: { $month: "$orderDate" },
            },
            sales: {
              $sum: "$totalPrice",
            },
            orders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),

      // Count orders by their current status.
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const totalSales =
      deliveredSalesResult.length > 0
        ? deliveredSalesResult[0].totalSales
        : 0;

    const orderStatusStats = {
      Pending: 0,
      Processing: 0,
      "Out for Delivery": 0,
      Delivered: 0,
      Canceled: 0,
    };

    statusCountsResult.forEach((item) => {
      if (
        Object.prototype.hasOwnProperty.call(
          orderStatusStats,
          item._id
        )
      ) {
        orderStatusStats[item._id] = item.count;
      }
    });

    const formattedSalesOverview = salesOverview.map(
      (item) => ({
        year: item._id.year,
        month: item._id.month,
        sales: item.sales,
        orders: item.orders,
      })
    );

    return res.status(200).json({
      totalSales,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
      salesOverview: formattedSalesOverview,
      orderStatusStats,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      message: "Server Error, please try again later",
    });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Get admin products error:", error);

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};

export const getAdminProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  try {
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get admin product error:", error);

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};

export const createAdminProduct = async (req, res) => {
  try {
    const productData = buildProductData(req.body);

    if (!productData.name) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (
      productData.price === undefined ||
      productData.price === null ||
      productData.price === ""
    ) {
      return res.status(400).json({
        message: "Product price is required",
      });
    }

    const product = await Product.create(productData);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create admin product error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};

export const updateAdminProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  try {
    const productData = buildProductData(req.body);

    if (Object.keys(productData).length === 0) {
      return res.status(400).json({
        message: "No product data provided",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: productData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update admin product error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};

export const deleteAdminProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete admin product error:", error);

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("products.product", "name image")
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get admin orders error:", error);

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};

export const updateAdminOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id: orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("products.product", "name image stock")
      .session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Order not found",
      });
    }

    /*
    =========================
    Prevent reopening canceled orders
    =========================
    */

    if (
      order.status === "Canceled" &&
      status !== "Canceled"
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Canceled orders cannot be reopened",
      });
    }

    /*
    =========================
    Same status
    =========================
    */

    if (order.status === status) {
      await session.abortTransaction();

      return res.status(200).json({
        message: "Order status is already up to date",
        order,
      });
    }

    /*
    =========================
    Restore stock when canceled
    =========================
    */

    if (status === "Canceled") {
      for (const item of order.products) {
        if (!item.product) {
          continue;
        }

        item.product.stock += Number(item.quantity || 0);

        await item.product.save({
          session,
          validateBeforeSave: true,
        });
      }
    }

    /*
    =========================
    Update order status
    =========================
    */

    order.status = status;

    /*
    IMPORTANT:
    Some old orders may not contain subtotal.
    We don't want status update to fail
    because of old missing fields.
    */

    await order.save({
      session,
      validateBeforeSave: false,
    });

    /*
    =========================
    Get fresh updated order
    =========================
    */

    const updatedOrder = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("products.product", "name image stock")
      .session(session)
      .lean();

    await session.commitTransaction();

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error(
      "Update admin order status error:",
      error
    );

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  } finally {
    session.endSession();
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email phone role")
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(
      "Get admin users error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error, please try again later",
    });
  }
};