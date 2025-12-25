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
          DEFAULT: '#1a5f4a',
          light: '#2d8a6b',
          dark: '#0d3d2f',
        },
        accent: {
          DEFAULT: '#d4a853',
          light: '#e8c17a',
        },
        background: '#0f1419',
        surface: {
          DEFAULT: '#1a2027',
          light: '#252d36',
        },
      },
    },
  },
  plugins: [],
}
