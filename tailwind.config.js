// tailwind.config.js
const daisyui = require('daisyui')

module.exports = {
  content: ['./views/**/*.{html,js,handlebars,hbs}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Times New Roman'", 'serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['lofi', 'wireframe', 'emerald'],
  },
}
