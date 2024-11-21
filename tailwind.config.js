/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{html,js,handlebars,hbs}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
};
