import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const [hasChecked, setHasChecked] = useState(false); // Add this guard

  useEffect(() => {
    if (hasChecked) return; // Prevent double execution in StrictMode

    const checkUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
        setHasChecked(true);
      }
    };
    checkUser();
  }, [hasChecked]);

  const updateUser = (userData) => {
    console.log("🔄 [UserProvider] User state updated (Login/Profile Update)");
    setUser(userData);
  };

  const clearUser = () => {
    console.log("🚪 [UserProvider] Clearing user state (Logout)");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
      {/* Pro Tip: You might want to prevent rendering children 
         until loading is false to avoid "flickering" 
      */}
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
