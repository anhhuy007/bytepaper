/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,handlebars,hbs}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Times New Roman'", "serif"],
      },
    },
  },
  daisyui: {
    themes: ["lofi", "wireframe", "emerald"],
  },
  plugins: [require("daisyui")],
};
