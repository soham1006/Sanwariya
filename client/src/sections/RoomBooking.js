import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function RoomBooking() {

  const navigate = useNavigate();  // ✅ FIXED
  
  const handleChange = (e) => {
    const token = localStorage.getItem("userToken"); // ✅ FIXED

    // 🔒 Redirect to login if user tries to fill without login
    if (!token) {
      toast.error("Please login to fill the form");
      return navigate("/login");
    }

    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    guests: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
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

  const verifyOtp = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
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
      toast.error('Invalid OTP');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to submit booking");
      return navigate("/login");
    }

    if (!emailVerified) {
      return alert("Please verify your email before booking.");
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bookings`, formData);
      toast.success('Booking request submitted! We will contact you shortly.');

      setFormData({
        name: '',
        phone: '',
        email: '',
        roomType: '',
        checkIn: '',
        checkOut: '',
        guests: ''
      });

      setOtp('');
      setOtpSent(false);
      setEmailVerified(false);

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while submitting the booking.');
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
              <input type="text" name="name" className="form-control"
                value={formData.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-control"
                value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control"
                value={formData.email} onChange={handleChange} required />

              {!emailVerified && (
                <>
                  <button className="btn btn-sm btn-warning mt-2"
                    onClick={sendOtp} disabled={loadingOtp}>
                    {loadingOtp ? 'Sending OTP...' : 'Send OTP'}
                  </button>

                  {otpSent && (
                    <>
                      <input className="form-control mt-2"
                        type="text" placeholder="Enter OTP"
                        value={otp} onChange={(e) => setOtp(e.target.value)} />

                      <button className="btn btn-sm btn-success mt-2"
                        onClick={verifyOtp} disabled={verifyingOtp}>
                        {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </>
                  )}
                </>
              )}

              {emailVerified && <span className="text-success small">Email verified ✅</span>}
            </div>

            <div className="mb-3">
              <label className="form-label">Room Type</label>
              <select name="roomType" className="form-select"
                value={formData.roomType} onChange={handleChange} required>
                <option value="">-- Select Room Type --</option>
                <option value="AC">AC Room</option>
                <option value="Non-AC">Non-AC Room</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Guests</label>
              <input type="number" name="guests" className="form-control"
                value={formData.guests} onChange={handleChange} min="1" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Check-In Date</label>
              <input type="date" name="checkIn" className="form-control"
                value={formData.checkIn} onChange={handleChange}
                min={today} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Check-Out Date</label>
              <input type="date" name="checkOut" className="form-control"
                value={formData.checkOut} onChange={handleChange}
                min={formData.checkIn || today} required />
            </div>

            <button type="submit"
              className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill">
              Submit Booking
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default RoomBooking;
