"use client";

import React from "react";
import HeroSection from "../components/design/Hero";
import Services from "../components/Services";
import DesignGallery from "../components/ui/DesignGallery";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";

const Design = () => {
  return (
    <div className="h-screen overflow-y-auto w-full">
      <div className="min-h-screen w-full bg-gradient-to-bl from-white to-blue-50">
        <div className="w-full min-h-screen bg-grid-gray-200/[0.2] pt-24">
          <NavbarMenu />
          <div className="w-full">
            <HeroSection />
            <Services />
            <DesignGallery />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design;
