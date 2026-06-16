import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"; // ✅ make sure this file exists

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyLands from "./pages/MyLands";
import Marketplace from "./pages/Marketplace";
import RegisterLand from "./pages/RegisterLand";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";

// Admin Pages
import Admin_Dashboard from "./pages/Admin_Dashboard";
import Admin_LandApproval from "./pages/Admin_LandApproval";
import Admin_AllLands from "./pages/Admin_AllLands";
import Admin_Profile from "./pages/Admin_Profile";


// 🔥 Layout wrapper
function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-cover bg-center text-white">

      {/* Navbar Switch */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}

      <div className="px-6 md:px-12 py-6">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* USER ROUTES (PROTECTED) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/my-lands" element={
            <ProtectedRoute>
              <MyLands />
            </ProtectedRoute>
          } />

          <Route path="/marketplace" element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } />

          <Route path="/register" element={
            <ProtectedRoute>
              <RegisterLand />
            </ProtectedRoute>
          } />

          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* ADMIN ROUTES (STRICT 🔥) */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <Admin_Dashboard />
            </AdminRoute>
          } />

          <Route path="/admin/approvals" element={
            <AdminRoute>
              <Admin_LandApproval />
            </AdminRoute>
          } />

          <Route path="/admin/lands" element={
            <AdminRoute>
              <Admin_AllLands />
            </AdminRoute>
          } />

          <Route path="/admin/profile" element={
            <AdminRoute>
              <Admin_Profile />
            </AdminRoute>
          } />

        </Routes>
      </div>
    </div>
  );
}


// 🔥 MAIN APP
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;