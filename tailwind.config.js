/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff0066",
        background: "#282C33",
        glow: "#C778DD",
        secondary: "#ABB2BF",
      },
      translate: {
        "10/12": "83.333333%",
      },
    },
  },
  plugins: [],
  future: {
    useOkLchColors: false,
  },
};
