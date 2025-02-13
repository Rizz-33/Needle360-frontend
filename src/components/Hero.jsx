import { CustomButton } from "./Button";

export default function HeroSection() {
  return (
    <section className="w-full h-[90vh] flex items-center justify-center bg-transparent">
      <div className="max-w-7xl w-full px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="text-center md:text-left max-w-lg">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full">
              Custom Tailoring
            </span>
            <a
              href="#"
              className="text-gray-600 text-xs font-medium hover:underline"
            >
              Explore Designs →
            </a>
          </div>
          <h1 className="mt-6 text-5xl font-bold text-gray-900 leading-tight">
            Design, Customize, and Order <br /> Tailored Just for You
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Get the perfect fit with our tailor-made clothing platform. Choose
            from professional tailors, upload your designs, and bring your
            fashion ideas to life effortlessly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <CustomButton
              text="Start Designing"
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-36"
              height="h-9"
              type="submit"
            />
            <CustomButton
              text="Find a Tailor"
              color="primary"
              hover_color="hoverAccent"
              variant="outlined"
              width="w-36"
              height="h-9"
              type="submit"
            />
          </div>
        </div>

        {/* Right Side Mobile Mockup */}
        <div className="relative w-full max-w-md">
          <img
            src="/tailor-mockup.png"
            alt="Hero: A tailor working on a sewing machine and a customer"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
