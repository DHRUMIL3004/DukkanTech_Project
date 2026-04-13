import { FaCheckCircle } from "react-icons/fa";
import "./Billing.css";

const Popup = ({ type = "success", title, message, onClose, buttonText = "OK" }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className={`popup-icon ${type}`}>
          {type === "success" ? <FaCheckCircle /> : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>
        <h3 className="popup-title">{title}</h3>
        <p className="popup-message">{message}</p>
        <button className="popup-btn" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Popup;
