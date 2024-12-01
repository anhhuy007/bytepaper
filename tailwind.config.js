/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export const content = ['./views/**/*.{html,js,handlebars,hbs}']
export const theme = {
  extend: {
    fontFamily: {
      sans: ["'Times New Roman'", 'serif'],
    },
  },
}
export const plugins = [
  [
    daisyui,
    {
      themes: ['lofi', 'wireframe', 'emerald'],
    },
  ],
]
