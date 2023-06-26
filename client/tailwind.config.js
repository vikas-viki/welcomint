/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        burno: ['Bruno Ace SC', 'cursive'],
        cherry: ['Cherry Bomb One', 'cursive'],
        marker: ['Permanent Marker', 'cursive'],
        monom: ['Monomaniac One', 'sans-serif'],
        script: ['Kaushan Script', 'cursive']
      }
    },
  },
  plugins: [],
}