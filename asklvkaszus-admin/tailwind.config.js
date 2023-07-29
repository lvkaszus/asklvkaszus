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
        'bgPrimary': '#A300CC',
        'bgSecondary': '#520066',
        'stPrimary': '#D633FF',
        'stSecondary': '#660080'
      },
      width: {
        '450px': '450px',
        '350px': '350px',
        '95%': '95%',
      },
      colors: {
        'bgPrimary': '#A300CC',
        'bgSecondary': '#520066',
        'subtitleText': '#ff99ff',
        'btnBlue': '#00BFFF',
        'btnBlueHover': '#33CCFF',
        'bgStickerBot': '#FFFFFF',
      }
    },
  },
  plugins: [

  ],
}