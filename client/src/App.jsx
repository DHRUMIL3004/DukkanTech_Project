import React from 'react'
import LandingPage from './Pages/LandingPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/LoginPage/Login'
import AdminDashboard from './Components/AdminDashboard';
import EmployeeDashboard from './Components/EmployeeDashboard';
import ManageCategory from './Pages/ManageCategory/ManageCategory';
import ManageUser from './Pages/ManageUser/ManageUser';
import ManageItemPage from './Pages/ManageItem/ManageItemPage';
import BillingPage from './Pages/BillingPage/BillingPage';
import CartPage from './Pages/BillingPage/CartPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderHistory from './Pages/OrderHistory/OrderHistory';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {

  const token = localStorage.getItem("token");

  return (
    <>

      <Routes>
        <Route
          path="/dashboard"
          element={
            token ? <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
          <AdminDashboard />
        </ProtectedRoute>  : <Navigate to="/" replace />
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            token ? <EmployeeDashboard /> : <Navigate to="/" replace />
          }
        />
        <Route path='/' element={<LandingPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path="/manage-user" element={<ProtectedRoute allowedRoles={["ADMIN"]}>
          <ManageUser />
        </ProtectedRoute>} />
        <Route path="/manage-category" element={<ProtectedRoute allowedRoles={["ADMIN"]}>
          <ManageCategory />
        </ProtectedRoute>} />
        <Route
          path="/manage-item"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageItemPage />
          </ProtectedRoute>}
        />

        <Route path="/billing" element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
          <BillingPage />
        </ProtectedRoute>} />

        <Route path="/billing/cart" element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
          <CartPage />
        </ProtectedRoute>} />

        <Route path="/order-history" element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
          <OrderHistory />
        </ProtectedRoute>} />

        {/* <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
          <AdminDashboard />
        </ProtectedRoute>} /> */}

      </Routes>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />


    </>
  )
}

export default App
