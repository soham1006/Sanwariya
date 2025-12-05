import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// ADMIN PAGES
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminOrder from "./components/admin/AdminOrder";
import AdminEventBookings from "./components/admin/AdminEventBookings";
import AdminRoomBookings from "./components/admin/AdminRoomBookings";
import AdminMealBookings from "./components/admin/AdminMealBookings";
import AddDish from "./components/admin/AddDish";
import ManageDishes from "./components/admin/ManageDishes";
import AdminContactMessages from "./components/admin/AdminContactMessages";


// USER PAGES
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";

// SECTIONS
import Bookings from "./sections/Bookings";
import Payment from "./sections/Payment";

import "./App.css";
// ------------ ADMIN PROTECT -------------
const AdminProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin-login" replace />;
};

// ------------ USER PROTECT -------------
const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  return token ? children : <Navigate to="/login" replace />;
};

// ------------ MAIN APP WRAPPER -------------
function AppWrapper() {
  const location = useLocation();

  // Hide navbar & footer on admin pages, but show for admin-login
  const hideLayout =
    location.pathname.startsWith("/admin") &&
    location.pathname !== "/admin-login";

  return (
    <>
      {!hideLayout && <Navbar />}
      <ToastContainer />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER Protected */}
        <Route
          path="/booking"
          element={
            <UserProtectedRoute>
              <Bookings />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/order"
          element={
            <UserProtectedRoute>
              <Payment />
            </UserProtectedRoute>
          }
        />

        {/* ADMIN Protected */}
         <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-dish"
          element={
            <AdminProtectedRoute>
              <AddDish />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-dishes"
          element={
            <AdminProtectedRoute>
              <ManageDishes />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/event-bookings"
          element={
            <AdminProtectedRoute>
              <AdminEventBookings />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/meal-bookings"
          element={
            <AdminProtectedRoute>
              <AdminMealBookings />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/room-bookings"
          element={
            <AdminProtectedRoute>
              <AdminRoomBookings />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminOrder />
            </AdminProtectedRoute>
          }
        />

         <Route
          path="/admin/messages"
          element={
            <AdminProtectedRoute>
              < AdminContactMessages/>
            </AdminProtectedRoute>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
