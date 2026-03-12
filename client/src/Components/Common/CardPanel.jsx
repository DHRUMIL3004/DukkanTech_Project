import React from "react";
import "../NavBar/NavBar.css";

const CardPanel = ({ title, children, className = "" }) => {
  return (
    <div className={`card card-panel shadow-sm ${className}`}>
      {title && (
        <div className="card-header border-0 bg-transparent py-3">
          <h5 className="mb-0">{title}</h5>
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default CardPanel;
