import React, { useState, useEffect } from "react";
import {
  FaBars, FaHome, FaPlus, FaList, FaClipboardList,
  FaEnvelope, FaBed, FaUtensils, FaCalendarAlt
} from "react-icons/fa";

import AdminHeader from "./AdminHeader";
import "./AdminSidebar.css";
import { NavLink } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect screen width
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  };

  return (
    <>
      <AdminHeader />

      {/* ---- MOBILE FLOATING BUTTON ---- */}
      {isMobile && (
        <button className="mobile-toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}

      {/* ---- DARK BACKDROP FOR MOBILE ---- */}
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>
      )}

      <div className="admin-wrapper">

        {/* ---- SIDEBAR ---- */}
        <aside
          className={`
            admin-sidebar
            ${collapsed && !isMobile ? "collapsed" : ""}
            ${mobileOpen && isMobile ? "mobile-open" : ""}
          `}
        >
          {/* Desktop toggle button */}
          {!isMobile && (
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
              <FaBars />
            </button>
          )}

          {/* Title */}
          {!collapsed && !isMobile && <h3 className="sidebar-title">Admin</h3>}

          <ul className="sidebar-menu">
            <li><NavLink to="/admin/dashboard"><FaHome /> {!collapsed && "Dashboard"}</NavLink></li>
            <li><NavLink to="/admin/add-dish"><FaPlus /> {!collapsed && "Add Dish"}</NavLink></li>
            <li><NavLink to="/admin/manage-dishes"><FaList /> {!collapsed && "All Dishes"}</NavLink></li>
            <li><NavLink to="/admin/orders"><FaClipboardList /> {!collapsed && "Orders"}</NavLink></li>
            <li><NavLink to="/admin/messages"><FaEnvelope /> {!collapsed && "Contact Messages"}</NavLink></li>
            <li><NavLink to="/admin/room-bookings"><FaBed /> {!collapsed && "Room Bookings"}</NavLink></li>
            <li><NavLink to="/admin/meal-bookings"><FaUtensils /> {!collapsed && "Meal Bookings"}</NavLink></li>
            <li><NavLink to="/admin/event-bookings"><FaCalendarAlt /> {!collapsed && "Event Bookings"}</NavLink></li>
          </ul>
        </aside>

        {/* ---- MAIN CONTENT ---- */}
        <main className={`admin-content ${collapsed && !isMobile ? "expanded" : ""}`}>
          {children}
        </main>

      </div>
    </>
  );
};

export default AdminLayout;
