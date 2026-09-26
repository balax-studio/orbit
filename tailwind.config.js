/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          black: '#171717',
          paper: '#F4F0E6',
          yellow: '#FFE156',
          cyan: '#35D9E6',
          green: '#A7EB52',
          red: '#FF5733'
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(23, 23, 23, 1)',
        'neo-lg': '8px 8px 0px 0px rgba(23, 23, 23, 1)',
      }
    },
  },
  plugins: [],
}
