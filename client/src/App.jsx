import React from "react";
import { Route, Routes } from "react-router-dom";
import ManageUser from "./Pages/ManageUser/ManageUser";
import ManageCategory from "./Pages/ManageCategory/ManageCategory";

function App() {
  return (
    <>
      <Routes>
        <Route path="/manage-user" element={<ManageUser />} />
        <Route path="/manage-category" element={<ManageCategory />} />
        
      </Routes>
    </>
  );
}

export default App;
