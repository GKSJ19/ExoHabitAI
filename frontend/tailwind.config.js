/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New project color palette
        clean: '#F8FAFC',        // Clean White Background
        deepNavy: '#0F172A',     // Deep Navy
        scientific: '#2563EB',   // Scientific Blue
        teal: '#14B8A6',         // Teal Accent
        softGray: '#475569',     // Soft Gray Text
        white: '#ffffff',
        black: '#000000',
        transparent: 'transparent',
        current: 'currentColor',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(168, 85, 247, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
