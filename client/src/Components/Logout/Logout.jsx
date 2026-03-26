import { useEffect, useState } from "react";
import { showName } from "../../Service/UserService";

import "./logout.css";

function Logout() {
    const [userName, setUserName] = useState("User");

    const role = localStorage.getItem("role");

    useEffect(() => {
        try {
            const data = showName();
            setUserName(data);
        } catch (err) {
            console.error("Error fetching user name:", err);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return ( 
        <div className="dropdown user-menu ms-auto">
  <button className="user-btn" data-bs-toggle="dropdown">
    <i className="bi bi-person-circle"></i>
    <span>{userName}</span>
  </button>
<ul className="dropdown-menu dropdown-menu-end custom-menu">
      <li className="dropdown-header">
        Signed in as <br />
        <strong>{role}</strong>
      </li>

      <li><hr className="dropdown-divider" /></li>

      {/* Role-based example */}
      

      <li>
        <button className="dropdown-item logout-item" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </li>
    </ul>
</div>
     );
}

export default Logout;