import { CustomButton } from "../ui/Button";
import { TypewriterEffect } from "../ui/TypewriterEffect";

export default function HeroSection() {
  const words = [
    { text: "Inspire," },
    { text: "Create," },
    { text: "Show," },
    { text: "Share," },
    { text: "Connect" },
  ];

  return (
    <section className="w-full min-h-max py-16">
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col items-center gap-12">
        <div className="text-center max-w-2xl">
          <div className="flex items-center justify-center gap-4">
            <span className="px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full">
              Design Community
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
            Your Fashion Ideas
          </h1>
          <p className="mt-4 text-xs md:text-sm text-gray-600">
            Join our community to browse designs, create your own, showcase your
            work, and give feedback. Connect with fellow fashion enthusiasts and
            bring your ideas to life.
          </p>
          <div className="mt-6 flex flex-row flex-wrap gap-4 justify-center">
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
              text="Browse Designs"
              color="primary"
              hover_color="hoverAccent"
              variant="outlined"
              width="w-36"
              height="h-9"
              type="submit"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
