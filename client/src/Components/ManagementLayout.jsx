import React from "react";

import "./NavBar/NavBar.css";

import { FaRegUser } from "react-icons/fa";

const ManagementLayout = ({
  title,
  left,
  right,
  Icon = FaRegUser,
  fullWidth = false,
}) => {
  return (
    <>
      <div
        className="management-page py-4"
        style={{ minHeight: "calc(100vh - 70px)", background: "#f7f9fc" }}
      >
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="mb-0 d-flex align-items-center">
              {title}
              <Icon className="ms-2" />
            </h2>
          </div>

          
          <div className="row gx-4 gy-4 management-content-row">
            {fullWidth ? (
              <div className="col-12 left_column">{left}</div>
            ) : (
              <>
                <div className="col-xl-5 col-lg-6 left_column">
                  <div className="left_inner">
                    {left}
                  </div>
                </div>

                <div className="col-xl-7 col-lg-6 right_column">
                  <div className="right_inner">
                    {right}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagementLayout;