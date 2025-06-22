/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#F5F7FA',
          dark: '#1A202C',
        },
        text: {
          light: '#1A202C',
          dark: '#E2E8F0',
        },
        primary: {
          light: '#4C51BF',
          dark: '#667EEA',
        },
      },
      backdropFilter: {
        'blur': 'blur(8px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
  darkMode: 'class',
};