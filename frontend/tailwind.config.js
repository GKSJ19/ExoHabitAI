/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0C15', 
          800: '#151725', 
          400: '#38BDF8', 
          accent: '#8B5CF6' 
        }
      }
    },
  },
  plugins: [],
}