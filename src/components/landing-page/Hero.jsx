import React, { useState } from "react";
import { CustomButton } from "../ui/Button";
import { TypewriterEffect } from "../ui/TypewriterEffect";
import TailorSearchModal from "./TailorSearchModal";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const words = [
    { text: "Design," },
    { text: "Explore," },
    { text: "and" },
    { text: "Order" },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="w-full min-h-max pb-12">
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Side Content */}
        <div className="text-center md:text-left max-w-2xl md:pr-12">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full">
              Custom Tailoring
            </span>
            <CustomButton
              text="Explore Designs"
              color="black"
              variant="text"
              hover_color="hoverAccent"
              width="w-24"
              type="submit"
              onClick={() => (window.location.href = "/design")}
            />
          </div>
          <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            <span className="inline">
              <TypewriterEffect words={words} />
            </span>
            Tailored Just for You
          </h1>
          <p className="mt-4 text-xs md:text-sm text-gray-600">
            Get the perfect fit with our tailor-made clothing platform. Choose
            from professional tailors, upload your designs, and bring your
            fashion ideas to life effortlessly.
          </p>
          <div className="mt-6 flex flex-row flex-wrap gap-4 justify-center md:justify-start">
            <CustomButton
              text="Start Designing"
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-36"
              height="h-9"
              type="submit"
              onClick={() => (window.location.href = "/design-tool")}
            />
            <CustomButton
              text="Find a Tailor"
              color="primary"
              hover_color="hoverAccent"
              variant="outlined"
              width="w-36"
              height="h-9"
              type="button"
              onClick={openModal}
            />
          </div>
        </div>

        {/* Right Side Image - larger than left side */}
        <div className="relative w-full flex-grow">
          <img
            src="/hero.png"
            alt="Hero: A tailor working on a sewing machine and a customer"
            className="h-auto w-full max-h-[420px] object-contain"
          />
        </div>
      </div>

      {/* Tailor Search Modal */}
      <TailorSearchModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}
