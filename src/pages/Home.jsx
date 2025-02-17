"use client";

import React from "react";
import HeroSection from "../components/Hero";
import LongMarquee from "../components/LongMarquee";
import NavbarMenu from "../components/Navbar-menu";

const Home = () => {
  return (
    <div className="flex w-full justify-center items-center bg-gradient-to-bl from-white to-blue-50 bg-grid-gray-300/[0.2] overflow-y-auto h-screen">
      <div className="w-full bg-gradient-to-tr from-transparent to-white overflow-y-auto">
        <NavbarMenu />
        <HeroSection />
        <LongMarquee />
      </div>
    </div>
  );
};

export default Home;
