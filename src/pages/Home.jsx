"use client";

import React from "react";
import NavbarMenu from "../components/Navbar-menu";

const Home = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-gradient-to-tr from-white to-blue-50">
      <div className="w-full h-screen">
        <NavbarMenu />
      </div>
    </div>
  );
};

export default Home;
