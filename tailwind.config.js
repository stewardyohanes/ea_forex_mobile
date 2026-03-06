/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0A1628",
        surface: "#112240",
        "surface-alt": "#0D1F35",
        primary: "#1A6FDB",
        green: "#00E676",
        red: "#FF4757",
        "text-primary": "#FFFFFF",
        "text-secondary": "#8892B0",
        bdr: "#1E3A5F",
      },
    },
  },
  plugins: [],
};
