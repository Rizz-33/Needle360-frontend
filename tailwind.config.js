/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8E0D3C", // Deep Red
        accent: "#EF3B33", // Vibrant Orange
        background: "#F7B195", // Peach
        secondary: "#1D1842", // Blackcurrant
      },
    },
  },
  plugins: [],
};
