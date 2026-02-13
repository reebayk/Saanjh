/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class
  theme: {
    extend: {
      colors: {
        // Your custom palette
        burgundy: {
          DEFAULT: '#471323',
          dark: '#2d0b16',
        },
        plum: {
          DEFAULT: '#5B2E48',
          light: '#7a4060',
        },
        slate: {
          DEFAULT: '#585563',
          light: '#757281',
        },
        sage: {
          DEFAULT: '#73937E',
          light: '#8fa89a',
          dark: '#5a7465',
        },
        beige: {
          DEFAULT: '#CEB992',
          light: '#e0d1b3',
          dark: '#b8a076',
        },
      },
    },
  },
  plugins: [],
}