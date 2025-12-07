import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function MealBooking() {

  const navigate = useNavigate(); // ✅ FIX

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    specialRequests: '',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // 🚨 LOGIN CHECK ON TYPING (SAME AS ROOM BOOKING)
  const handleChange = (e) => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("Please login to fill the form");
      return navigate("/login");
    }

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🚨 LOGIN CHECK ON SENDING OTP
  const sendOtp = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
    }

    if (!formData.email) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoadingOtp(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/otp/send-email-otp`, {
        email: formData.email,
      });
      toast.success('OTP sent to your email');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoadingOtp(false);
    }
  };

  // 🚨 LOGIN CHECK ON VERIFY OTP
  const verifyOtp = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
    }

    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/otp/verify-email-otp`, {
        email: formData.email,
        otp,
      });
      toast.success('Email verified!');
      setEmailVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // 🚨 LOGIN CHECK ON SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to submit reservation");
      return navigate("/login");
    }

    if (!emailVerified) {
      toast.warning('Please verify your email before submitting.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/meal-bookings`, formData);
      toast.success('Meal reservation submitted successfully!');

      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guests: '',
        specialRequests: '',
      });

      setOtp('');
      setOtpSent(false);
      setEmailVerified(false);

    } catch (err) {
      console.error('Error submitting meal booking:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-section container mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {!emailVerified && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-warning me-2"
                    onClick={sendOtp}
                    disabled={loadingOtp}
                  >
                    {loadingOtp ? 'Sending OTP...' : 'Send OTP'}
                  </button>

                  {otpSent && (
                    <div className="mt-2">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={verifyOtp}
                        disabled={verifyingOtp}
                      >
                        {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {emailVerified && (
                <div className="text-success mt-2">✅ Email verified</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Reservation Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Time</label>
              <input
                type="time"
                name="time"
                className="form-control"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Guests</label>
              <input
                type="number"
                name="guests"
                className="form-control"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Special Requests (optional)</label>
              <textarea
                name="specialRequests"
                className="form-control"
                rows="3"
                value={formData.specialRequests}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill"
            >
              Submit Reservation
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default MealBooking;
