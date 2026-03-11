import { NavLink } from "react-router-dom";
import "./NavBar.css";

const LandingNavbar = () => {
  return (
    <nav className="landing-navbar navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          DukaanTech
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#landingNavbarNav"
          aria-controls="landingNavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="landingNavbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/manage-user">
                Manage User
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
