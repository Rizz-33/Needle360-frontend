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
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
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
      className="max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

// ScrollCard Component
const ScrollCard = ({ rotate, scale, children }) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};

// DesignScroll Component
export function DesignScroll() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ScrollContainer
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Craft Your Own <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Custom Designs
              </span>
            </h1>
            <p className="mt-4 mb-6 text-xs text-secondary dark:text-gray-300">
              Turn your ideas into reality with tailor-made outfits. Personalize
              every stitch, every color, and every fabric choice.
            </p>
          </>
        }
      >
        <img
          src="/custom-design.webp"
          alt="tailor shop hero"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
        />
      </ScrollContainer>
    </div>
  );
}
