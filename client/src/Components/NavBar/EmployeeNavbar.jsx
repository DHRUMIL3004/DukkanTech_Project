import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";
import { showName } from "../../Service/UserService";
import Logout from "../Logout/Logout";

const EmployeeNavbar = () => {

   const [userName, setUserName] = useState("Employee");
  
    useEffect(() => {
      
        try {const data = showName();
        setUserName(data);
        }
        catch (err) {
          console.error("Error fetching user name:", err);
        }
      
    }, []);

     const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };


  const links = [
    { to: "/billing", label: "Billing"},
    { to: "/order-history", label: "Order History" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top admin-navbar">
      <div className="container">

        <a className="navbar-brand d-flex align-items-center" href="/billing">
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

        <div className="collapse navbar-collapse " id="appNavbarNav">

          <ul className="navbar-nav ms-4">

            {links.map((link) => (
              <li key={link.to} className="nav-item me-3">

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

          <Logout/>

        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;