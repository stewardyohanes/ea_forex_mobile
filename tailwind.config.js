/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#050D1A",
        surface: "#0D1F3C",
        "surface-alt": "#0A1828",
        primary: "#2979FF",
        green: "#00E5A0",
        red: "#FF3D57",
        gold: "#FFB800",
        "text-primary": "#FFFFFF",
        "text-secondary": "#7A88A8",
        bdr: "#1A3358",
      },
    },
  },
  plugins: [],
};
