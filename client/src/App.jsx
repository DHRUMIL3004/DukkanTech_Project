import React from 'react'
import LandingPage from './Pages/LandingPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/LoginPage/Login'
import AdminDashboard from './Components/AdminDashboard';
import EmployeeDashboard from './Components/EmployeeDashboard';
import ManageCategory from './Pages/ManageCategory/ManageCategory';
import ManageUser from './Pages/ManageUser/ManageUser';


function App() {
 
 const token = localStorage.getItem("token");
 console.log(token);
  return (
    <>
    
     <Routes>
        <Route 
          path="/admin-dashboard" 
          element={
            token ? <AdminDashboard /> : <Navigate to="/" replace />
          } 
        />
      <Route 
          path="/employee-dashboard" 
          element={
            token ? <EmployeeDashboard /> : <Navigate to="/" replace />
          } 
        />
      <Route path='/' element={<LandingPage/>} />
      <Route path='/Login' element={<Login/>} />
       <Route path="/manage-user" element={<ManageUser />} />
        <Route path="/manage-category" element={<ManageCategory />} />
     </Routes>
  
    
    </>
  )
}

export default App
