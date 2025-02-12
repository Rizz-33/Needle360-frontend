"use client";

import React from "react";
import HeroSection from "../components/Hero";
import NavbarMenu from "../components/Navbar-menu";

const Home = () => {
  return (
    <div className="flex w-full justify-center items-center bg-gradient-to-bl from-white to-blue-50 bg-grid-gray-300/[0.2] overflow-y-auto">
      <div className="w-full bg-gradient-to-tr from-transparent to-white">
        <NavbarMenu />
        <HeroSection />
      </div>
    </div>
  );
};

export default Home;
