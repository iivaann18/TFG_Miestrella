/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#2d2638',
          brown: '#875b3b',
          light: '#f4dcd5',
          gold: '#a88453',
          rose: '#b9858d',
          beige: '#ccb186',
          pink: '#d8a3ad',
          teal: '#92b9c0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}