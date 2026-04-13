import React from "react";
import CardPanel from "./CardPanel";

const PlaceholderPanel = ({ title, message }) => {
  return (
    <CardPanel title={title} className="fade-expand">
      <div className="text-muted text-center py-4">{message}</div>
    </CardPanel>
  );
};

export default PlaceholderPanel;
