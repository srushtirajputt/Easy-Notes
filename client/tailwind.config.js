/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind WHERE to look for class names (so unused styles get removed in production)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // All JS/JSX files inside src/
  ],
  // Enable dark mode by adding the "dark" class to the <html> element
  darkMode: "class",
  theme: {
    extend: {
      // Custom font family — Inter is loaded from Google Fonts
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
