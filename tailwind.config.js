/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.html", // Scans your HTML file
    "./src/index.js", // Scans your JavaScript file
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
