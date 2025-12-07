const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const RESTAURANT_COORDS = { lat: 23.33880, lng: 76.83752 };

function toRad(deg) {
  return deg * Math.PI / 180;
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone, address, paymentMethod, items, location, utr } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Location required" });
    }

    const itemTotal = items.reduce((sum, i) => sum + Number(i.price || 0), 0);

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
    else return res.status(400).json({ message: "Delivery 10km only." });

    let paymentStatus = "COD_PENDING";
    if (paymentMethod === "UPI") {
      if (!utr || utr.length < 6) {
        return res.status(400).json({ message: "UTR required for UPI" });
      }
      paymentStatus = "UPI_PENDING_VERIFICATION";
    }

    const finalTotal = itemTotal + deliveryCharge;

    const order = await Order.create({
      userId: req.user.id,
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

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      total: finalTotal,
    });

  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    res.status(500).json({ message: "Server error creating order" });
  }
});

module.exports = router;  
