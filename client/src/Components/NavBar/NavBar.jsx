import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";
import { showName } from "../../Service/UserService";
import Logout from "../Logout/Logout";

const NavBar = () => {
  const [userName, setUserName] = useState("admin");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const data = await showName();
        setUserName(data || "admin");
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/billing", label: "Billing" },
    { to: "/manage-item", label: "Manage Item" },
    { to: "/manage-category", label: "Manage Category" },
    { to: "/manage-user", label: "Manage User" },
    { to: "/order-history", label: "Order History" },
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
          <ul className="navbar-nav ms-5">
            {links.map((link) => (
              <li key={link.to} className="nav-item me-2">
                {link.disabled ? (
                  <span className="nav-link disabled-link">{link.label}</span>
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
          <Logout />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
