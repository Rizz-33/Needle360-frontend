"use client";

import React from "react";
import Categories from "../components/Categories";
import HeroSection from "../components/design/Hero";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";
import ProductCard from "../components/ui/ProductCard";

const Design = () => {
  return (
    <div className="h-screen overflow-y-auto w-full">
      <div className="min-h-screen w-full bg-gradient-to-bl from-white to-blue-50">
        <div className="w-full min-h-screen bg-grid-gray-200/[0.2] pt-24">
          <NavbarMenu />
          <div className="w-full">
            {/* <DesignerCanvas /> */}
            <HeroSection />
            <Categories />
            <ProductCard />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design;
