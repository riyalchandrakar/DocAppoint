/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
        primary: {
          600: '#2563eb', // blue-600
          700: '#1d4ed8', // blue-700
        }
      },
    },
  },
  plugins: [],
}