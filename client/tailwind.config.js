/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hianime-dark': '#0b0c2a',   // Deep Blue Background
        'hianime-sidebar': '#201f31',// Lighter Sidebar
        'hianime-accent': '#ffbade', // Pink Accent
        'hianime-text': '#d1d5db',   // Light Gray Text
      }
    },
  },
  plugins: [],
}