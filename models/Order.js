const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: true,
    },

    product_name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);