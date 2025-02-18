"use client";

import React from "react";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";

const Design = () => {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="min-h-screen w-full bg-gradient-to-bl from-white to-blue-50 bg-grid-gray-300/[0.2]">
        <div className="w-full min-h-screen bg-gradient-to-tr from-transparent to-white pt-24">
          <NavbarMenu />
          <div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design;
