import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const links = [
    { to: "/", label: "Dashboard", disabled: true },
    { to: "/billing", label: "Billing", disabled: true },
    { to: "/manage-item", label: "Manage Item", disabled: true },
    { to: "/manage-category", label: "Manage Category"},
    { to: "/manage-user", label: "Manage User" },
    { to: "/order-history", label: "Order History", disabled: true },
  ];

  return (
    <nav className="app-navbar navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          DukaanTech
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#appNavbarNav"
          aria-controls="appNavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="appNavbarNav">
          <ul className="navbar-nav ms-3">
            {links.map((link) => (
              <li key={link.to} className="nav-item">
                {link.disabled ? (
                  <span className="nav-link disabled" title="Coming soon">
                    {link.label}
                  </span>
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          <div className="ms-auto d-flex align-items-center">
            <div className="user-pill px-3 py-2 rounded-pill bg-white text-primary shadow-sm">
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
