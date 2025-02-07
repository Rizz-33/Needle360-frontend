/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2825DA",
        accent: "#181683",
        background: "#FFFFFF",
        secondary: "#D4D3F8",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      backdropBlur: ({ theme }) => theme("blur"),
      backdropBrightness: ({ theme }) => theme("brightness"),
      backdropContrast: ({ theme }) => theme("contrast"),
      backdropGrayscale: ({ theme }) => theme("grayscale"),
      backdropHueRotate: ({ theme }) => theme("hueRotate"),
      backdropInvert: ({ theme }) => theme("invert"),
      backdropOpacity: ({ theme }) => theme("opacity"),
      backdropSaturate: ({ theme }) => theme("saturate"),
      backdropSepia: ({ theme }) => theme("sepia"),
      backgroundColor: ({ theme }) => theme("colors"),
      backgroundImage: {
        none: "none",
        "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
        "gradient-to-tr":
          "linear-gradient(to top right, var(--tw-gradient-stops))",
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-to-br":
          "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
        "gradient-to-bl":
          "linear-gradient(to bottom left, var(--tw-gradient-stops))",
        "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
        "gradient-to-tl":
          "linear-gradient(to top left, var(--tw-gradient-stops))",
      },
      backgroundOpacity: ({ theme }) => theme("opacity"),
      backgroundPosition: {
        bottom: "bottom",
        center: "center",
        left: "left",
        "left-bottom": "left bottom",
        "left-top": "left top",
        right: "right",
        "right-bottom": "right bottom",
        "right-top": "right top",
        top: "top",
      },
      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain",
      },
      blur: {
        0: "0",
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
      brightness: {
        0: "0",
        50: ".5",
        75: ".75",
        90: ".9",
        95: ".95",
        100: "1",
        105: "1.05",
        110: "1.1",
        125: "1.25",
        150: "1.5",
        200: "2",
      },
    },
  },
  plugins: [],
};
