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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/authentication" element={<AuthLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signIn" element={<SignIn />} />{" "}
      {/* Fixed 'exact' to 'element' */}
      <Route path="/home" element={<HomePage />} />
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
    <Navigate to={"/login"} />
  );
};

export default App;
