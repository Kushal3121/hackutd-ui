import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Toyota color palette
        toyotaRed: {
          DEFAULT: '#EB0A1E', // main red (logo)
          dark: '#C70015', // for hover states or emphasis
          light: '#FF4C4C', // optional accent tone
        },
        toyotaGray: {
          DEFAULT: '#1A1A1A', // text / dark bg
          light: '#F7F7F7', // section bg
          mid: '#D1D5DB', // border / subtle divider
        },
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        sans: ['Montserrat', 'Roboto', 'sans-serif'], // Toyota-like font style
      },
    },
  },
  plugins: [forms, typography],
};
