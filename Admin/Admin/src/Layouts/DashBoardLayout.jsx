import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom"; // Add this
import NavBar from "./NavBar.jsx";
import UserContext from "../Components/Context/UserContext.jsx";
import SideMenu from "../Components/SideMenu.jsx";
import "../Css/DashboardLayout.css";

const DashBoardLayout = () => {
  const { user } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  if (user === undefined) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <NavBar openSideMenu={openSideMenu} setOpenSideMenu={setOpenSideMenu} />

      <div className="dashboard-main-container" style={{ display: "flex" }}>
        {/* SIDEBAR stays constant */}
        {openSideMenu && (
          <div className="side-menu-overlay">
            <SideMenu />
          </div>
        )}

        <div className={`dashboard-right-section ${openSideMenu ? "with-sidebar" : "full-width"}`}>
          {/* OUTLET renders the specific page based on the URL */}
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayout;