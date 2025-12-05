import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  const login = async () => {
    if (!data.email.trim() || !data.password.trim()) {
      return toast.error("Email & Password required");
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        {
          email: data.email.trim(),
          password: data.password.trim(),
        }
      );

      if (!res.data.success) {
        return toast.error(res.data.error || "Login failed");
      }

      // Save token
      localStorage.setItem("userToken", res.data.token);

      toast.success("Login Successful!");

      // Redirect to home page
      navigate("/");

    } catch (err) {
      toast.error(err.response?.data?.error || "Login request failed");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="shadow p-4 bg-light rounded">
        <div className="container" style={{ maxWidth: 400 }}>
          
          <h3 className="text-center text-golden elegant-title mb-4">
            Login
          </h3>

          <input
            className="form-control my-2"
            placeholder="Email"
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
          />

          <input
            className="form-control my-2"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
          />

          <button
            type="button"
            className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill w-100"
            onClick={login}
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}
