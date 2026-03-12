import React from "react";
import { Route, Routes } from "react-router-dom";
import ManageUser from "./Pages/ManageUser/ManageUser";

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
