/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d6064',
      },
      fontFamily: {
        'abril-fatface': ['"Abril Fatface"', 'cursive'],
        'red-hat-display': ['"Red Hat Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
