import React from "react";
import SideMenu from "../Components/SideMenu";
import Layout from "../Components/Layout";


const HomePage = () => {
  return (
    <div style={{display:"flex", gap:"20px"}}>
      <SideMenu />
      <Layout />
    </div>
  );
};

export default HomePage;
