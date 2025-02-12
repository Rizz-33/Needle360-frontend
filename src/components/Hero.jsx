import { CustomButton } from "./Button";

export default function HeroSection() {
  return (
    <section className="w-full h-[90vh] flex items-center justify-center bg-transparent">
      <div className="max-w-7xl w-full px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="text-center md:text-left max-w-lg">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-secondary text-primary text-sm font-semibold rounded-full">
              design
            </span>
            <a
              href="#"
              className="text-gray-600 text-sm font-medium hover:underline"
            >
              see others design →
            </a>
          </div>
          <h1 className="mt-6 text-5xl font-bold text-gray-900 leading-tight">
            A better way to ship <br /> your projects
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <CustomButton
              text="Get Started"
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-36"
              height="h-9"
              type="submit"
            />
            <CustomButton
              text="  Learn More"
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
            src="/mobile-mockup.png"
            alt="Mobile UI"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
