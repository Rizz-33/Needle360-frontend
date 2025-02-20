"use client";

import React from "react";
import Categories from "../components/Categories";
import HeroSection from "../components/design/Hero";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";

const Design = () => {
  return (
    <div className="h-screen overflow-y-auto w-full">
      <div className="min-h-screen w-full bg-gradient-to-bl from-white to-blue-50 bg-grid-gray-300/[0.2]">
        <div className="w-full min-h-screen bg-gradient-to-tr from-transparent to-white pt-24">
          <NavbarMenu />
          <div className="w-full">
            {/* <DesignerCanvas /> */}
            <HeroSection />
            <Categories />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design;
