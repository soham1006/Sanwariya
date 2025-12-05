import { useState, useEffect } from "react";
import axios from "axios";

export default function OtpModal({ email, onVerified, onClose }) {
  const API = "http://localhost:5000";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setResendDisabled(false);
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Send OTP automatically when modal opens
  useEffect(() => {
    sendOtp();
  }, []);

  // Send OTP
  const sendOtp = async () => {
    setResendDisabled(true);
    setTimer(30);
    console.log("API = ", process.env.REACT_APP_API_BASE_URL);

    await axios.post(`${API}/api/otp/send`, { email });
  };

  // Handle OTP input change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const code = otp.join("");

    const res = await axios.post(`${API}/api/otp/verify`, {
      email,
      otp: code
    });

    if (res.data.success) {
      onVerified();
      onClose();
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="otp-backdrop">
      <div className="otp-box shadow">
        <h4 className="mb-3 text-center">Verify OTP</h4>
        <p className="text-center">OTP sent to <strong>{email}</strong></p>

        {/* OTP INPUT */}
        <div className="d-flex justify-content-center gap-2 my-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              maxLength="1"
              className="otp-input"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
            />
          ))}
        </div>

        {/* TIMER + RESEND */}
        <div className="text-center mb-3">
          {resendDisabled ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button className="btn btn-link" onClick={sendOtp}>
              Resend OTP
            </button>
          )}
        </div>

        <button className="btn btn-dark w-100" onClick={handleVerify}>
          Verify OTP
        </button>

        <button className="btn btn-outline-secondary w-100 mt-2" onClick={onClose}>
          Cancel
        </button>
      </div>

      {/* STYLES */}
      <style>{`
        .otp-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex; justify-content: center; align-items: center;
          z-index: 9999;
        }
        .otp-box {
          background: white;
          padding: 25px;
          border-radius: 10px;
          width: 380px;
        }
        .otp-input {
          width: 45px;
          height: 55px;
          font-size: 24px;
          text-align: center;
          border-radius: 8px;
          border: 2px solid #ddd;
        }
        .otp-input:focus {
          border-color: #000;
          outline: none;
        }
      `}</style>
    </div>
  );
}
