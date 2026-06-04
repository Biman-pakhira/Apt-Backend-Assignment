const Order = require("../models/Order");

// Validation helper
const validateOrderInput = (data) => {
  const errors = [];

  if (!data.customer_name || typeof data.customer_name !== "string" || data.customer_name.trim() === "") {
    errors.push("customer_name is required and must be a non-empty string");
  }

  if (!data.product_name || typeof data.product_name !== "string" || data.product_name.trim() === "") {
    errors.push("product_name is required and must be a non-empty string");
  }

  if (data.status && !["pending", "shipped", "delivered"].includes(data.status)) {
    errors.push("status must be one of: pending, shipped, delivered");
  }

  return errors;
};

exports.createOrder = async (req, res) => {
  try {
    // Validate input
    const validationErrors = validateOrderInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const order = await Order.create(req.body);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    // Validate input (only validate fields that are being updated)
    if (req.body.customer_name !== undefined) {
      if (typeof req.body.customer_name !== "string" || req.body.customer_name.trim() === "") {
        return res.status(400).json({
          message: "Validation failed",
          errors: ["customer_name must be a non-empty string"],
        });
      }
    }

    if (req.body.product_name !== undefined) {
      if (typeof req.body.product_name !== "string" || req.body.product_name.trim() === "") {
        return res.status(400).json({
          message: "Validation failed",
          errors: ["product_name must be a non-empty string"],
        });
      }
    }

    if (req.body.status !== undefined) {
      if (!["pending", "shipped", "delivered"].includes(req.body.status)) {
        return res.status(400).json({
          message: "Validation failed",
          errors: ["status must be one of: pending, shipped, delivered"],
        });
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted",
      deletedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};