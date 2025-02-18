"use client";

import React from "react";
import BentoGrid from "../components/BentoGrid";
import BlogSection from "../components/Blogs";
import { DesignScroll } from "../components/DesignScroll";
import FeaturedTailorsCarousel from "../components/FeaturedTailors";
import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import LongMarquee from "../components/LongMarquee";
import NavbarMenu from "../components/Navbar-menu";

const Home = () => {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="min-h-screen w-full bg-gradient-to-bl from-white to-blue-50 bg-grid-gray-300/[0.2]">
        <div className="w-full min-h-screen bg-gradient-to-tr from-transparent to-white pt-24">
          <NavbarMenu />
          <div>
            <HeroSection />
            <LongMarquee />
            <BentoGrid />
            <FeaturedTailorsCarousel />
            <HowItWorks />
            <DesignScroll />
            <BlogSection />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
