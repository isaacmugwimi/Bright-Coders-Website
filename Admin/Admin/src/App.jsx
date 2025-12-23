import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import SignIn from "./Pages/SignIn";
import UserProvider from "./Components/Context/UserProvider";
import AuthLayout from "./Pages/AuthLayout/AuthLayout";
import ProgramManagement from "./Components/ProgramManagement";
import AdminDashBoard from "./Components/AdminDashBoard";
import DashBoardLayout from "./Layouts/DashBoardLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/authentication" element={<AuthLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signIn" element={<SignIn />} />

      {/* DASHBOARD GROUP */}
      <Route element={<DashBoardLayout />}>
        {/* When path is /home, it renders AdminDashBoard inside the Layout */}
        <Route path="/home" element={<AdminDashBoard />} />

        {/* When path is /programs, it replaces the content with ProgramManagement */}
        <Route path="/programs" element={<ProgramManagement />} />

        {/* You can add more here later */}
        <Route path="/testimonials" element={<div>Testimonials Page</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

const Root = () => {
  // Check if token exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");
  // Redirect  to dashboard if authenticated, otherwise to login

  return isAuthenticated ? (
    <Navigate to={"/home"} />
  ) : (
    <Navigate to={"/authentication"} />
  );
};

export default App;
