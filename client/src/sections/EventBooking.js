import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function EventBooking() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    occasion: '',
    guests: '',
    date: '',
    time: '',
    specialRequests: '',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // 🔐 LOGIN CHECK ON FORM INPUT
  const handleChange = (e) => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("Please login to fill the form");
      return navigate("/login");
    }

    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔐 LOGIN CHECK ON SEND OTP
  const sendOtp = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
    }

    if (!formData.email) {
      return toast.warning('Please enter a valid email first.');
    }

    setLoadingOtp(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/otp/send-email-otp`, {
        email: formData.email,
      });

      toast.success('OTP sent to your email.');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoadingOtp(false);
    }
  };

  // 🔐 LOGIN CHECK ON VERIFY OTP
  const verifyOtp = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
    }

    if (!otp) {
      return toast.warning('Enter the OTP to verify.');
    }

    setVerifyingOtp(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/otp/verify-email-otp`, {
        email: formData.email,
        otp,
      });

      toast.success('Email verified successfully!');
      setEmailVerified(true);

    } catch (err) {
      toast.error('Invalid OTP. Try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // 🔐 LOGIN CHECK ON SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to submit booking");
      return navigate("/login");
    }

    if (!emailVerified) {
      return toast.warning('Please verify your email before submitting.');
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/event-bookings`, formData);

      toast.success('Event booking submitted successfully!');

      setFormData({
        name: '',
        phone: '',
        email: '',
        occasion: '',
        guests: '',
        date: '',
        time: '',
        specialRequests: '',
      });

      setOtp('');
      setOtpSent(false);
      setEmailVerified(false);

    } catch (err) {
      toast.error('Something went wrong. Try again.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-section container mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form className="shadow p-4 bg-light rounded" onSubmit={handleSubmit}>

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
                    {loadingOtp ? 'Sending...' : 'Send OTP'}
                  </button>

                  {otpSent && (
                    <>
                      <input
                        className="form-control mt-2"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />

                      <button
                        type="button"
                        className="btn btn-sm btn-success mt-2"
                        onClick={verifyOtp}
                        disabled={verifyingOtp}
                      >
                        {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {emailVerified && (
                <div className="text-success small mt-2">Email verified ✅</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Occasion</label>
              <select
                name="occasion"
                className="form-select"
                value={formData.occasion}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Occasion --</option>
                <option value="Birthday">Birthday</option>
                <option value="Kitty Party">Kitty Party</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Other">Other</option>
              </select>
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
              <label className="form-label">Date</label>
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
              <label className="form-label">Special Requests</label>
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
              Submit Booking
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EventBooking;
