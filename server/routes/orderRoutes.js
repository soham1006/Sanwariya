const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Restaurant fixed location
const RESTAURANT_COORDS = { lat: 23.33880, lng: 76.83752 };

// ============================
// HELPERS
// ============================
function toRad(deg) {
  return (deg * Math.PI) / 180;
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

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ============================
// GET ALL ORDERS (ADMIN)
// ============================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ FETCH ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ============================
// PLACE ORDER (PUBLIC)
// ============================
router.post("/", async (req, res) => {
  console.log("🚀 ORDER ROUTE HIT");
  console.log("📦 ORDER BODY:", req.body);

  try {
    const {
      name,
      email,
      phone,
      address,
      paymentMethod,
      items,
      location,
      utr,
    } = req.body;

    // -------- VALIDATIONS --------
    if (!name || !phone || !address || !email) {
      return res.status(400).json({ message: "Name, phone, email required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Location required" });
    }

    if (!["COD", "UPI"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // -------- TOTAL CALCULATION --------
    const itemTotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    const distance = getDistanceKm(
      RESTAURANT_COORDS.lat,
      RESTAURANT_COORDS.lng,
      location.lat,
      location.lng
    );

    let deliveryCharge;
    if (distance <= 2) deliveryCharge = 0;
    else if (distance <= 5) deliveryCharge = 30;
    else if (distance <= 10) deliveryCharge = 50;
    else {
      return res
        .status(400)
        .json({ message: "Delivery available up to 10km only" });
    }

    const paymentStatus =
      paymentMethod === "UPI"
        ? "UPI_PENDING_VERIFICATION"
        : "COD_PENDING";

    const finalTotal = itemTotal + deliveryCharge;

    // -------- SAVE ORDER --------
    const order = await Order.create({
      name,
      email,
      phone,
      address,
      items,
      paymentMethod,
      deliveryCharge,
      total: finalTotal,
      location,
      distance,
      utr: paymentMethod === "UPI" ? utr : null,
      paymentStatus,
      createdAt: new Date(),
    });

    // -------- CUSTOMER EMAIL (NON-BLOCKING) --------
    console.log("📧 Sending order email to:", email);

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: "Order Confirmed – Shri Sanwariya Palace & Restaurant",
        text: `
Thank you for your order, ${name}

Payment Method: ${paymentMethod}
Payment Status: ${paymentStatus}

Total Amount: Rs ${finalTotal}

Delivery Address:
${address}

Shri Sanwariya Palace & Restaurant
        `,
        html: `
<!DOCTYPE html>
<html>
  <body>
    <h2>Thank you for your order, ${name}!</h2>

    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
    <p><strong>Payment Status:</strong> ${paymentStatus}</p>

    <h3>Order Items:</h3>
    <ul>
      ${(items || [])
        .map(
          (item) =>
            `<li>${item?.name || "Item"} - Rs ${item?.price || 0}</li>`
        )
        .join("")}
    </ul>

    <p><strong>Delivery Charge:</strong> Rs ${deliveryCharge}</p>
    <p><strong>Total Amount:</strong> Rs ${finalTotal}</p>

    <p><strong>Delivery Address:</strong><br/>${address}</p>

    <p>
      We will contact you shortly for delivery confirmation.<br/>
      <strong>Shri Sanwariya Palace & Restaurant</strong>
    </p>
  </body>
</html>
        `,
      });

      console.log("✅ Order email sent successfully");
    } catch (emailErr) {
      console.error(
        "❌ ORDER EMAIL FAILED:",
        emailErr?.response?.body || emailErr?.message || emailErr
      );
    }

    // -------- RESPONSE --------
    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      total: finalTotal,
    });
  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    return res.status(500).json({ message: "Server error creating order" });
  }
});

// ============================
// DELETE ORDER (ADMIN)
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;
