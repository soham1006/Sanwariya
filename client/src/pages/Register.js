import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- SEND OTP ----------------
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) return toast.error("Email required");

    setLoadingOtp(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/otp/send-email-otp`,
        { email: form.email.trim() }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("OTP sent!");
      setOtpSent(true);
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  // ---------------- VERIFY OTP ----------------
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error("OTP required");

    setVerifyingOtp(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/otp/verify-email-otp`,
        { email: form.email.trim(), otp: otp.trim() }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Wrong OTP");
        return;
      }

      toast.success("Email verified!");
      setEmailVerified(true);
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ---------------- REGISTER USER ----------------
  const createAccount = async (e) => {
    e.preventDefault();

    if (!emailVerified)
      return toast.error("Verify email before registering");

    if (!form.password.trim())
      return toast.error("Password required");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
        {
          name: form.name,
          email: form.email.trim(),
          password: form.password.trim(),
        }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Account created!");
      navigate("/login"); 

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="container mt-5" style={{ maxWidth: 400 }}>
        <form className="shadow p-4 bg-light rounded" onSubmit={createAccount}>

          <h3 className="text-center text-golden elegant-title mb-4">Register</h3>

          <input
            name="name"
            className="form-control my-2"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            className="form-control my-2"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* SEND OTP BUTTON */}
          {!emailVerified && (
            <>
              <button
                className="btn btn-warning w-100"
                onClick={sendOtp}
                disabled={loadingOtp}
              >
                {loadingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* OTP INPUT + VERIFY */}
          {otpSent && !emailVerified && (
            <>
              <input
                className="form-control my-2"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                className="btn btn-success w-100"
                onClick={verifyOtp}
                disabled={verifyingOtp}
              >
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {emailVerified && (
            <span className="text-success small">Email Verified ✔</span>
          )}

          {/* PASSWORD + CREATE ACCOUNT */}
          {emailVerified && (
            <>
              <input
                name="password"
                type="password"
                className="form-control my-3"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="btn btn-outline-warning btn-lg w-100 rounded-pill"
              >
                Create Account
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
