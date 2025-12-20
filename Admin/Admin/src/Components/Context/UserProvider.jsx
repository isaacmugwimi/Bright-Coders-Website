import React, { Children, useEffect, useState } from "react";
import UserContext from "./UserContext";

const UserProvider = ({ children }) => {
  // state management
  const [user, setUser] = useState(null);
  // Stores your user data (like name, email, or token).
  // initially it is null ... "no user logged in"

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data:", e);
        localStorage.removeItem("user"); // Clear it if it's broken
      }
    }
  }, []);

  // Function to update user data
  const updateUser = (userData) => {
if (userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
