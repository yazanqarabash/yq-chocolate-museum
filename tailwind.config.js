/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,hbs}"],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 115s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 1rem))" },
        },
      },
      colors: {
        cocoa: "#3E2723", // Primary color for backgrounds and major elements.
        beige: "#FFEBB2", // Accent color for text backgrounds and light areas.
        caramel: "#D4A373", // Used for buttons, highlights, and CTAs.
        mocha: "#2A1506", // For headings, icons, and emphasis.
        wine: "#5A2A27", // An accent color for subtle highlights and buttons.
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"], // Headings – Playfair Display
        sans: ["Roboto", "sans-serif"], // Body Text – Roboto
        pacifico: ["Pacifico", "cursive"], // Decorative Text – Pacifico
      },
    },
  },
  plugins: [],
};
