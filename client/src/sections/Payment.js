import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const RESTAURANT_COORDS = { lat: 23.3388, lng: 76.83752 };

const toRad = (deg) => deg * (Math.PI / 180);
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ---------------- DRAGGABLE MARKER ----------------
function DraggableMarker({ coordinates, setCoordinates }) {
  const [position, setPosition] = useState(coordinates);

  useEffect(() => {
    setCoordinates(position);
  }, [position, setCoordinates]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition(latlng);
        },
      }}
    />
  );
}

// ---------------- PAYMENT COMPONENT ----------------
function Payment({ cart, setCart, total }) {
  const navigate = useNavigate();

  const UPI_ID = process.env.REACT_APP_UPI_ID;
  const UPI_NAME = process.env.REACT_APP_UPI_NAME;

  // Login protection
  const requireLogin = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return false;
    }
    return true;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    HouseNo: "",
    paymentMethod: "Cash on Delivery",
    utr: "",
  });

  const [coordinates, setCoordinates] = useState({
    lat: 23.2599,
    lng: 77.4126,
  });

  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [finalTotal, setFinalTotal] = useState(total);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [upiPaid, setUpiPaid] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [calculating, setCalculating] = useState(false);

  // Delivery Charge Calculator
  const calculateDeliveryCharge = useCallback(async () => {
    setCalculating(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json`
      );

      if (!res.data?.address) {
        toast.error("Unable to determine location. Move the pin.");
        return { charge: null };
      }

      setFormData((prev) => ({ ...prev, address: res.data.display_name }));

      const distance = getDistanceKm(
        RESTAURANT_COORDS.lat,
        RESTAURANT_COORDS.lng,
        coordinates.lat,
        coordinates.lng
      );

      let charge = 0;
      if (distance <= 2) charge = 0;
      else if (distance <= 5) charge = 30;
      else if (distance <= 10) charge = 50;
      else charge = null;

      setDeliveryCharge(charge);
      return { charge };
    } catch (err) {
      toast.error("Location fetch failed");
      return { charge: null };
    } finally {
      setCalculating(false);
    }
  }, [coordinates]);

  useEffect(() => {
    calculateDeliveryCharge();
  }, [coordinates, calculateDeliveryCharge]);

  useEffect(() => {
    setFinalTotal(deliveryCharge !== null ? total + deliveryCharge : total);
  }, [total, deliveryCharge]);

  // Debounce
  const debounceRef = useRef(null);
  const debounceGeocode = (address) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      geocodeAddress(address);
    }, 800);
  };

  const geocodeAddress = async (address) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      if (res.data?.length > 0) {
        const { lat, lon } = res.data[0];
        setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch {
      toast.error("Address search failed");
    }
  };

  // Change Handler (with login check)
  const handleChange = (e) => {
    if (!requireLogin()) return;
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "address") debounceGeocode(value);
  };

  // OTP SEND
  const sendOtp = async () => {
    if (!requireLogin()) return;
    if (!formData.email) return toast.error("Enter email first");

    setSendingOtp(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/otp/send-email-otp`,
        { email: formData.email }
      );
      toast.success("OTP sent");
      setOtpSent(true);
    } catch {
      toast.error("OTP send failed");
    }
    setSendingOtp(false);
  };

  // OTP VERIFY
  const verifyOtp = async () => {
    if (!requireLogin()) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/otp/verify-email-otp`,
        { email: formData.email, otp }
      );
      toast.success("Email verified");
      setEmailVerified(true);
    } catch {
      toast.error("Invalid OTP");
    }
  };

  // PLACE ORDER
  const handlePlaceOrder = async () => {
    if (!requireLogin()) return;

    if (!formData.name || !formData.email || !formData.phone) {
      return toast.error("Fill all fields");
    }
    if (!emailVerified) return toast.error("Verify email first");

    if (formData.paymentMethod === "UPI") {
      if (!upiPaid) return toast.error("Confirm UPI payment");
      if (!formData.utr || formData.utr.length < 6)
        return toast.error("Invalid UTR");
    }

    const { charge } = await calculateDeliveryCharge();
    if (charge === null) return toast.error("Outside 10km delivery zone");

    const orderDetails = {
      ...formData,
      items: cart,
      total: finalTotal,
      deliveryCharge: charge,
      location: coordinates,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderDetails),
        }
      );

      if (res.ok) {
        setOrderPlaced(true);
        setCart([]);
        localStorage.removeItem("cart");
      }
    } catch {
      toast.error("Order failed");
    }
  };

 if (orderPlaced) {
  return (
    <div
      className="bg-cream"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div
        className="p-5 bg-white rounded shadow-sm text-center"
        style={{ maxWidth: "550px", width: "100%" }}
      >
        <div
          className="mx-auto mb-4"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#28a74522",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "48px", color: "#28a745" }}>✓</span>
        </div>

        <h2 className="text-success fw-bold">Order Placed Successfully!</h2>

        <p className="mt-3 mb-4" style={{ fontSize: "17px", color: "#444" }}>
          Thank you for your order! You will receive confirmation shortly.
        </p>

        <button
          className="btn btn-outline-warning rounded-pill px-4 py-2"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="bg-cream py-5">
      <div className="container mb-5 bg-cream">
        <h2 className="text-golden mb-4">Checkout</h2>

        <div className="row">
          {/* LEFT SIDE */}
          <div className="col-md-6">
            <h5 className="mb-3">Delivery Details</h5>

            {/* Name */}
            <input
              type="text"
              name="name"
              className="form-control mb-3"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Email + OTP */}
            <input
              type="email"
              name="email"
              className="form-control mb-2"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {!emailVerified && (
              <>
                <button
                  className="btn btn-warning mb-2"
                  onClick={sendOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? "Sending..." : "Send OTP"}
                </button>

                {otpSent && (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      className="btn btn-success btn-sm mb-2"
                      onClick={verifyOtp}
                    >
                      Verify OTP
                    </button>
                  </>
                )}
              </>
            )}

            {emailVerified && (
              <div className="text-success small mb-3">Email verified ✅</div>
            )}

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              className="form-control mb-3"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
            />

            {/* House No */}
            <input
              type="text"
              name="HouseNo"
              className="form-control mb-3"
              placeholder="House No & Landmark"
              value={formData.HouseNo}
              onChange={handleChange}
              required
            />

            {/* Address */}
            <textarea
              name="address"
              className="form-control mb-3"
              rows="3"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            {/* Map */}
            <label className="form-label">Pin Location</label>
            <MapContainer
              center={[coordinates.lat, coordinates.lng]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <DraggableMarker
                coordinates={coordinates}
                setCoordinates={setCoordinates}
              />
            </MapContainer>

            {/* Payment Method */}
            <select
              className="form-select mt-3"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="UPI">UPI</option>
            </select>

            {/* UPI SECTION */}
            {formData.paymentMethod === "UPI" && (
              <div className="mt-3 p-3 border rounded bg-light">
                <h6>Scan to Pay ₹{finalTotal}</h6>

                <QRCodeSVG
                  value={`upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${finalTotal}&cu=INR`}
                  size={150}
                />

                <p className="small mt-2">
                  UPI ID: <strong>{UPI_ID}</strong>
                </p>

                {/* UTR */}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter UTR"
                  value={formData.utr}
                  onChange={(e) =>
                    setFormData({ ...formData, utr: e.target.value })
                  }
                  required
                />

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={upiPaid}
                    onChange={(e) => setUpiPaid(e.target.checked)}
                  />
                  <label className="form-check-label">
                    I have completed UPI payment
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-6">
            <h5 className="mb-3">Order Summary</h5>

            <ul className="list-group mb-3">
              {cart.map((item, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between">
                  {item.name} {item.variant ? `(${item.variant})` : ""} - ₹{item.price}
                </li>
              ))}
            </ul>

            <p className="fw-bold">Items Total: ₹{total}</p>

            {deliveryCharge !== null && (
              <p className="fw-bold">Delivery Charge: ₹{deliveryCharge}</p>
            )}

            <p className="fw-bold">Final Total: ₹{finalTotal}</p>

            {/* DELIVERY NOT AVAILABLE MESSAGE */}
            {deliveryCharge === null && !calculating && (
              <div className="alert alert-danger fw-bold mt-3">
                ❌ Delivery not available at this location.<br />
                Please move the map pin within <strong>10 km</strong> of the restaurant.
              </div>
            )}

            <button
              className="btn btn-success mt-3"
              onClick={handlePlaceOrder}
              disabled={calculating || deliveryCharge === null}
            >
              Place Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Payment;
