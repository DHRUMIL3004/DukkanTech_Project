import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {

  const links = [
    { to: "/", label: "Dashboard", disabled: true },
    { to: "/billing", label: "Billing", disabled: true },
    { to: "/manage-item", label: "Manage Item", disabled: true },
    { to: "/manage-category", label: "Manage Category" },
    { to: "/manage-user", label: "Manage User" },
    { to: "/order-history", label: "Order History", disabled: true },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top admin-navbar">
      <div className="container">

        <a className="navbar-brand d-flex align-items-center" href="/">
          <img className="logo me-2" src="/Logo.png" alt="logo" />
         
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#appNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="appNavbarNav">

          <ul className="navbar-nav ms-4">

            {links.map((link) => (
              <li key={link.to} className="nav-item">

                {link.disabled ? (
                  <span className="nav-link disabled-link">
                    {link.label}
                  </span>
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `nav-link nav-hover ${isActive ? "active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}

              </li>
            ))}

          </ul>

          <div className="ms-auto d-flex align-items-center">

            <div className="user-pill">
              <i className="bi bi-person-circle me-2"></i>
              Admin
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;