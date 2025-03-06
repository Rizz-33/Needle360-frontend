"use client";

import React from "react";
import FeaturedTailorsCarousel from "../components/FeaturedTailors";
import HowItWorks from "../components/HowItWorks";
import BentoGrid from "../components/landing-page/BentoGrid";
import { DesignScroll } from "../components/landing-page/DesignScroll";
import HeroSection from "../components/landing-page/Hero";
import LogoMarquee from "../components/landing-page/LogoMarquee";
import RequestSection from "../components/RequestSection";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";

const Home = () => {
  return (
    <div className="h-screen overflow-y-auto w-full">
      <div className="min-h-screen w-full bg-gradient-to-bl from-white to-blue-50">
        <div className="w-full min-h-screen pt-24 bg-grid-gray-200/[0.2]">
          <NavbarMenu />
          <div>
            <HeroSection />
            <LogoMarquee />
            <BentoGrid />
            <FeaturedTailorsCarousel />
            <HowItWorks />
            <DesignScroll />
            <RequestSection />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
