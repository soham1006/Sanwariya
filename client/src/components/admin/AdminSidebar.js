import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  };

  return (
    <>
      {/* 🔥 Toggle button always visible */}
      <button
        className="toggle-btn"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div
        className={`
          admin-sidebar
          ${collapsed ? "collapsed" : ""}
          ${mobileOpen ? "mobile-open" : ""}
        `}
      >
        {!collapsed && !isMobile && <h2 className="sidebar-title">Admin</h2>}

        <ul className="sidebar-menu">
          <li>
            <NavLink to="/admin/dashboard">
              <i className="bi bi-speedometer2"></i>
              {!collapsed && "Dashboard"}
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/add-dish">
              <i className="bi bi-plus-circle"></i>
              {!collapsed && "Add Dish"}
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/manage-dishes">
              <i className="bi bi-list-ul"></i>
              {!collapsed && "All Dishes"}
            </NavLink>
          </li>
       <li>
  <NavLink to="/admin/gallery">
    <i className="bi bi-images"></i>
    {!collapsed && "Gallery"}
  </NavLink>
</li>




          <li>
            <NavLink to="/admin/orders">
              <i className="bi bi-basket3"></i>
              {!collapsed && "Orders"}
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/messages">
              <i className="bi bi-chat-left-text"></i>
              {!collapsed && "Contact Messages"}
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/room-bookings">
              <i className="bi bi-door-open"></i>
              {!collapsed && "Room Bookings"}
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/meal-bookings">
              <i className="bi bi-egg-fried"></i>
              {!collapsed && "Meal Bookings"}
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/event-bookings">
              <i className="bi bi-calendar-event"></i>
              {!collapsed && "Event Bookings"}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
