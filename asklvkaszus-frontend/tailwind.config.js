/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fira: ['"Fira Code"', 'monospace'],
        roboto: ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        light: 400,
        normal: 500,
        bold: 600,
      },
      gradientColorStops: {
        'bgPrimary': '#00FFFF',
        'bgSecondary': '#006BB3',
        'stPrimary': '#00ACE6',
        'stSecondary': '#80DFFF'
      },
      width: {
        '450px': '450px',
        '350px': '350px',
        '95%': '95%',
      },
      colors: {
        'btnBlue': '#00BFFF',
        'btnBlueHover': '#33CCFF',
        'bgStickerTop': '#00BFFF',
        'bgStickerBot': '#FFFFFF',
      }
    },
  },
  plugins: [

  ],
}