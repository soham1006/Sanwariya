import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();   // <-- important
  const [active, setActive] = useState('hero');

  const isHome = location.pathname === "/";  // <-- detect if we are on Home

  const handleNavClick = (section) => {
    setActive(section);
    setTimeout(() => {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    }, 300);
  };

  const token = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
      <div className="container">

        {/* BRAND LOGO */}
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
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* CENTER NAV */}
          <ul className="navbar-nav gap-3 mx-auto">

            {[ 
              { to: 'hero', label: 'Home' },
              { to: 'about', label: 'About' },
              { to: 'rooms', label: 'Rooms' },
              { to: 'menu', label: 'Menu' },
              { to: 'bookings', label: 'Bookings' },
              { to: 'contact', label: 'Contact' }
            ].map((item, idx) => (
              <li className="nav-item" key={idx}>

                {isHome ? (
                  // ✔ Scroll inside Home
                  <ScrollLink
                    to={item.to}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    spy={true}
                    onSetActive={() => setActive(item.to)}
                    onClick={() => handleNavClick(item.to)}
                    className={`nav-link text-uppercase fw-semibold ${active === item.to ? 'active-link' : ''}`}
                    style={{ cursor: "pointer" }}
                  >
                    {item.label}
                  </ScrollLink>
                ) : (
                  // ❌ If not on Home: route back to Home first
                  <RouterLink
                    to="/"
                    className="nav-link text-uppercase fw-semibold"
                  >
                    {item.label}
                  </RouterLink>
                )}

              </li>
            ))}

          </ul>

          {/* RIGHT SIDE AUTH */}
          <ul className="navbar-nav ms-auto gap-3">

            {!token && (
              <>
                <li className="nav-item">
                  <RouterLink
                    to="/login"
                    onClick={() => handleNavClick("register")}
                    className="nav-link text-uppercase fw-semibold"
                  >
                    Login
                  </RouterLink>
                </li>

                <li className="nav-item">
                  <RouterLink
                    to="/register"
                    onClick={() => handleNavClick("register")}
                    className="nav-link text-uppercase fw-semibold"
                  >
                    Register
                  </RouterLink>
                </li>
              </>
            )}

            {token && (
              <li className="nav-item">
                <RouterLink
                  to="#"
                  onClick={handleLogout}
                  className="nav-link text-uppercase fw-semibold"
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </RouterLink>
              </li>
            )}

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
