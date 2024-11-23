/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,handlebars,hbs}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["lofi", "wireframe", "emerald"],
  },
  plugins: [require("daisyui")],
};
