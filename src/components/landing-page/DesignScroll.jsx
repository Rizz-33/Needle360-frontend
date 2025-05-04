"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

// ScrollContainer Component
const ScrollContainer = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -60]); // Further reduced translate distance for better visibility

  return (
    <div
      className="h-[40rem] sm:h-[50rem] md:h-[60rem] flex items-center justify-center relative px-4 sm:px-8 md:px-16"
      ref={containerRef}
    >
      <div
        className="py-6 sm:py-10 md:py-14 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <ScrollHeader translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} translate={translate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
};

// ScrollHeader Component
const ScrollHeader = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-4xl mx-auto text-center relative z-10"
    >
      {titleComponent}
    </motion.div>
  );
};

// ScrollCard Component
const ScrollCard = ({ rotate, scale, translate, children }) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
        boxShadow:
          "0 0 #0000004d, 0 6px 15px #0000004a, 0 25px 25px #00000042, 0 60px 35px #00000026, 0 100px 40px #0000000a, 0 150px 45px #00000003",
      }}
      className="max-w-4xl -mt-8 mx-auto h-[24rem] sm:h-[28rem] md:h-[32rem] w-full border-2 border-[#6C6C6C] p-2 sm:p-4 md:p-6 bg-[#222222] rounded-[20px] shadow-xl"
    >
      <div className="h-full w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900 sm:rounded-xl md:rounded-2xl md:p-3">
        <div className="h-full w-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

// DesignScroll Component
export function DesignScroll() {
  return (
    <div className="flex flex-col mb-[-80px] overflow-hidden">
      <ScrollContainer
        titleComponent={
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mt-4 sm:mt-2 md:mt-0 dark:text-white">
              Craft Your Own <br />
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold mt-1 leading-none">
                Custom Designs
              </span>
            </h1>
            <p className="mt-3 mb-6 sm:mb-8 text-xs sm:text-sm md:text-base text-secondary dark:text-gray-300">
              Turn your ideas into reality with tailor-made outfits. Personalize
              every stitch, every color, and every fabric choice.
            </p>
          </>
        }
      >
        <img
          src="/designStudio.webp"
          alt="tailor shop hero"
          className="rounded-2xl object-contain h-full w-full"
        />
      </ScrollContainer>
    </div>
  );
}
