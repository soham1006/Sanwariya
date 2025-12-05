const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const { Resend } = require("resend");

// ---- CONFIG ----
const resend = new Resend(process.env.RESEND_API_KEY);
const RESTAURANT_COORDS = { lat: 23.33880, lng: 76.83752 };

// ---- DISTANCE CALCULATION ----
function toRad(deg) {
  return deg * (Math.PI / 180);
}
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ---- SEND ORDER EMAIL USING RESEND ----
async function sendConfirmationEmail(order) {
  try {
    const emailHtml = `
      <h2>Order Confirmation - Sanwariya Hotel</h2>
      <p>Dear ${order.name},</p>
      <p>Thank you for ordering from Sanwariya Hotel!</p>

      <h3>Items:</h3>
      <ul>
        ${order.items
          .map(item => `<li>${item.name}${item.variant ? ` (${item.variant})` : ""} - ₹${item.price}</li>`)
          .join("")}
      </ul>

      <p><strong>Delivery Address:</strong> ${order.address}</p>
      <p><strong>Delivery Charge:</strong> ₹${order.deliveryCharge}</p>
      <p><strong>Total Amount:</strong> ₹${order.total}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <br/>
      <p>We will contact you shortly.</p>
    `;

    const response = await resend.emails.send({
      from: "Sanwariya Hotel <sanwariyahotel@resend.dev>",   // ✔ FIXED
      to: order.email,
      subject: "Order Confirmation - Sanwariya Hotel",
      html: emailHtml,
    });

    console.log("📩 Order Email Sent:", response);

  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err);
  }
}

// ---- PLACE ORDER ----
router.post("/", async (req, res) => {
  try {
    const order = req.body;
    console.log("📦 Received Order:", order);

    // ---- Required fields ----
    const required = [
      "name",
      "email",
      "phone",
      "address",
      "paymentMethod",
      "items",
      "total",
      "location",
    ];

    for (const field of required) {
      if (!order[field] || (Array.isArray(order[field]) && order[field].length === 0)) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    // ---- Validate coordinates ----
    if (!order.location.lat || !order.location.lng) {
      return res.status(400).json({ message: "Missing location coordinates" });
    }

    // ---- Distance Calculation ----
    const distance = getDistanceKm(
      RESTAURANT_COORDS.lat,
      RESTAURANT_COORDS.lng,
      order.location.lat,
      order.location.lng
    );

    let deliveryCharge = 0;
    if (distance <= 2) deliveryCharge = 0;
    else if (distance <= 5) deliveryCharge = 30;
    else if (distance <= 10) deliveryCharge = 50;
    else {
      return res.status(400).json({
        message: "Delivery not available beyond 10 km from restaurant.",
      });
    }

    // ---- Validate Payment Method ----
    if (!["Cash on Delivery", "UPI"].includes(order.paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // ---- Create Order in DB ----
    const finalOrder = new Order({
      name: order.name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      HouseNo: order.HouseNo,
      items: order.items,
      total: order.total,
      deliveryCharge,
      paymentMethod: order.paymentMethod,
      location: {
        lat: order.location.lat,
        lng: order.location.lng,
      },
      createdAt: new Date(),
      distance,
    });

    await finalOrder.save();

    // ---- Send Confirmation Email ----
    sendConfirmationEmail(finalOrder);

    return res.status(200).json({
      message: "Order placed successfully!",
      order: finalOrder,
    });
  } catch (err) {
    console.error("❌ ORDER ERROR:", err.message || err);
    return res.status(500).json({ message: "Error processing order" });
  }
});

// ---- GET ALL ORDERS ----
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Fetch Orders Error:", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ---- DELETE ORDER ----
router.delete("/:id", async (req, res) => {
  console.log("🗑 Delete Order:", req.params.id);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error.message);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;
