import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ManageUser from "./Pages/ManageUser/ManageUser";import AdminDashboard from './Components/AdminDashboard';
import EmployeeDashboard from './Components/EmployeeDashboard';


function App() {
  return (
    <>
      <Routes>
        <Route path="/manage-user" element={<ManageUser />} />
      </Routes>
    </>
  );
}

export default App;
