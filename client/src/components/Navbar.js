import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import {
  Link as RouterLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("hero");

  const isHome = location.pathname === "/";

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");

  const closeNavbar = () => {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse?.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeNavbar();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
      <div className="container">

        {/* BRAND */}
        <RouterLink to="/" className="navbar-brand fw-bold">
          Shri Sanwariya
        </RouterLink>

        {/* TOGGLER */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* CENTER NAV */}
          <ul className="navbar-nav mx-auto gap-3">

            {/* HOME */}
            <li className="nav-item">
              {isHome ? (
                <ScrollLink
                  to="hero"
                  smooth
                  duration={500}
                  offset={-70}
                  spy
                  onSetActive={() => setActive("hero")}
                  onClick={closeNavbar}
                  className={`nav-link text-uppercase fw-semibold ${
                    active === "hero" ? "active-link" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  Home
                </ScrollLink>
              ) : (
                <RouterLink
                  to="/"
                  onClick={closeNavbar}
                  className="nav-link text-uppercase fw-semibold"
                >
                  Home
                </RouterLink>
              )}
            </li>

            {/* ABOUT */}
            <li className="nav-item">
              {isHome ? (
                <ScrollLink
                  to="about"
                  smooth
                  duration={500}
                  offset={-70}
                  spy
                  onSetActive={() => setActive("about")}
                  onClick={closeNavbar}
                  className={`nav-link text-uppercase fw-semibold ${
                    active === "about" ? "active-link" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  About
                </ScrollLink>
              ) : (
                <RouterLink
                  to="/"
                  onClick={closeNavbar}
                  className="nav-link text-uppercase fw-semibold"
                >
                  About
                </RouterLink>
              )}
            </li>

            {/* ROOMS */}
            <li className="nav-item">
              {isHome ? (
                <ScrollLink
                  to="rooms"
                  smooth
                  duration={500}
                  offset={-70}
                  spy
                  onSetActive={() => setActive("rooms")}
                  onClick={closeNavbar}
                  className={`nav-link text-uppercase fw-semibold ${
                    active === "rooms" ? "active-link" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  Rooms
                </ScrollLink>
              ) : (
                <RouterLink
                  to="/"
                  onClick={closeNavbar}
                  className="nav-link text-uppercase fw-semibold"
                >
                  Rooms
                </RouterLink>
              )}
            </li>

            {/* MENU */}
            <li className="nav-item">
              {isHome ? (
                <ScrollLink
                  to="menu"
                  smooth
                  duration={500}
                  offset={-70}
                  spy
                  onSetActive={() => setActive("menu")}
                  onClick={closeNavbar}
                  className={`nav-link text-uppercase fw-semibold ${
                    active === "menu" ? "active-link" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  Menu
                </ScrollLink>
              ) : (
                <RouterLink
                  to="/"
                  onClick={closeNavbar}
                  className="nav-link text-uppercase fw-semibold"
                >
                  Menu
                </RouterLink>
              )}
            </li>
{/* GALLERY */}
<li className="nav-item">
  {isHome ? (
    <ScrollLink
      to="gallery"
      smooth
      duration={500}
      offset={-70}
      spy
      onSetActive={() => setActive("gallery")}
      onClick={closeNavbar}
      className={`nav-link text-uppercase fw-semibold ${
        active === "gallery" ? "active-link" : ""
      }`}
      style={{ cursor: "pointer" }}
    >
      Gallery
    </ScrollLink>
  ) : (
    <RouterLink
      to="/"
      onClick={closeNavbar}
      className="nav-link text-uppercase fw-semibold"
    >
      Gallery
    </RouterLink>
  )}
</li>


            {/* BOOKINGS */}
            <li className="nav-item">
              {isHome ? (
                <ScrollLink
                  to="bookings"
                  smooth
                  duration={500}
                  offset={-70}
                  spy
                  onSetActive={() => setActive("bookings")}
                  onClick={closeNavbar}
                  className={`nav-link text-uppercase fw-semibold ${
                    active === "bookings" ? "active-link" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  Bookings
                </ScrollLink>
              ) : (
                <RouterLink
                  to="/"
                  onClick={closeNavbar}
                  className="nav-link text-uppercase fw-semibold"
                >
                  Bookings
                </RouterLink>
              )}
            </li>

            {/* CONTACT */}
            <li className="nav-item">
              {isHome ? (
                <ScrollLink
                  to="contact"
                  smooth
                  duration={500}
                  offset={-70}
                  spy
                  onSetActive={() => setActive("contact")}
                  onClick={closeNavbar}
                  className={`nav-link text-uppercase fw-semibold ${
                    active === "contact" ? "active-link" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  Contact
                </ScrollLink>
              ) : (
                <RouterLink
                  to="/"
                  onClick={closeNavbar}
                  className="nav-link text-uppercase fw-semibold"
                >
                  Contact
                </RouterLink>
              )}
            </li>

          </ul>

          {/* RIGHT AUTH */}
          <ul className="navbar-nav ms-auto gap-3">
            {!token ? (
              <>
                <li className="nav-item">
                  <RouterLink to="/login" onClick={closeNavbar} className="nav-link">
                    Login
                  </RouterLink>
                </li>
                <li className="nav-item">
                  <RouterLink to="/register" onClick={closeNavbar} className="nav-link">
                    Register
                  </RouterLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <span
                  onClick={handleLogout}
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </span>
              </li>
            )}
          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
