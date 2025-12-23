import React from "react";
import SideMenu from "../Components/SideMenu";
import Layout from "../Components/Layout";
import DashBoardLayout from "../Layouts/DashBoardLayout.jsx";
import ProgramManagement from "../Components/ProgramManagement.jsx";
import AdminDashBoard from "../Components/AdminDashBoard.jsx";

const HomePage = () => {
  return (
    // <div style={{display:"flex", gap:"20px"}}>
    //   <SideMenu />
    //   <Layout />
    // </div>

    <DashBoardLayout>
      <AdminDashBoard />
      <ProgramManagement />
    </DashBoardLayout>
  );
};

export default HomePage;
