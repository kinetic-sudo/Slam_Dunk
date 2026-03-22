/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all your React files
  ],
  theme: {
    extend: {
      colors: {
        brand: '#FF4C00',
        grayText: '#7A7A7A',
      },
      fontFamily: {
        heading: ['Anton', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}