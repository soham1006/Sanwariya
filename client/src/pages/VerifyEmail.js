import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/verify-user", {
      email: state.email,
      otp
    });

    if (res.data.success) {
      alert("Email verified successfully!");
      navigate("/login");
    } else {
      alert(res.data.error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Verify Email</h3>
        <p className="text-center">OTP sent to {state.email}</p>
        
        <input 
          type="text"
          className="form-control mb-3"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="btn btn-dark w-100" onClick={handleVerify}>
          Verify OTP
        </button>
      </div>
    </div>
  );
}
