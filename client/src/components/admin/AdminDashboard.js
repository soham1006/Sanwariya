import React from "react";
import { Link } from "react-router-dom";
import {
  FaList,
  FaPlus,
  FaClipboardList,
  FaEnvelope,
  FaBed,
  FaUtensils,
  FaCalendarAlt,
} from "react-icons/fa";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admindash-container">

      <h1 className="admindash-title">Welcome, Arjun Singh Mewada </h1>
      <p className="admindash-subtitle">Manage everything from one place</p>

      <div className="admindash-grid">

        <Link to="/admin/add-dish" className="admindash-card">
          <FaPlus className="icon" />
          <h3>Add Dish</h3>
        </Link>

        <Link to="/admin/manage-dishes" className="admindash-card">
          <FaList className="icon" />
          <h3>All Dishes</h3>
        </Link>

        <Link to="/admin/orders" className="admindash-card">
          <FaClipboardList className="icon" />
          <h3>Orders</h3>
        </Link>

        <Link to="/admin/messages" className="admindash-card">
          <FaEnvelope className="icon" />
          <h3>Contact Messages</h3>
        </Link>

        <Link to="/admin/room-bookings" className="admindash-card">
          <FaBed className="icon" />
          <h3>Room Bookings</h3>
        </Link>

        <Link to="/admin/meal-bookings" className="admindash-card">
          <FaUtensils className="icon" />
          <h3>Meal Bookings</h3>
        </Link>

        <Link to="/admin/event-bookings" className="admindash-card">
          <FaCalendarAlt className="icon" />
          <h3>Event Bookings</h3>
        </Link>

      </div>
    </div>
  );
};

export default AdminDashboard;
