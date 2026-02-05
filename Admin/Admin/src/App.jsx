import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Pages/Login";
import SignIn from "./Pages/SignIn";
import UserProvider from "./Components/Context/UserProvider";
import AuthLayout from "./Pages/AuthLayout/AuthLayout";
import ProgramManagement from "./Components/ProgramManagement";
import AdminDashBoard from "./Components/AdminDashBoard";
import DashBoardLayout from "./Layouts/DashBoardLayout";
import AdminBlogManager from "./Components/AdminBlogManager/AdminBlogManager";
import AdminTestimonialManager from "./Components/AdminTestimonialManager/AdminTestimonialManager";
import AdminRegistrationManager from "./Components/AdminRegistrationManager/AdminRegistrationManager";
import ProtectedRoute from "./Pages/ProtectedRoute";

import UserContext from "./Components/Context/UserContext";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import AccountSettings from "./Components/AccountSettings/AccountSettings";
import SignupSuccess from "./Pages/SignupSuccess/SignupSuccess";
import { useEffect } from "react";
import { fetchCsrfToken } from "./utils/csrf";

// =====================
// ROOT COMPONENT
// =====================

/* Root redirect */
const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/authentication" replace />
  );
};

// =====================
// ROUTES COMPONENT
// =====================

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Root />} />
      <Route path="/authentication" element={<AuthLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/signup-success" element={<SignupSuccess />} />
      <Route path="/signIn" element={<SignIn />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashBoardLayout />}>
          <Route path="/home" element={<AdminDashBoard />} />
          <Route path="/programs" element={<ProgramManagement />} />
          <Route path="/blogs" element={<AdminBlogManager />} />
          <Route path="/testimonials" element={<AdminTestimonialManager />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route
            path="/studentRegistration"
            element={<AdminRegistrationManager />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

// =====================
// APP COMPONENT
// =====================
function App() {

  // 🔑 CALL IT HERE
  useEffect(() => {
    fetchCsrfToken();
  }, []);
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
