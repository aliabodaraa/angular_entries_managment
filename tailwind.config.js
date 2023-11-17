/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{html,ts}"],
  theme: {
    extend: {
      screens:{},
      keyframes: {

        'open-menu':{
          '0%' : { transform:'opacity-0 scale-95' },
          '100%' : { transform:'opacity-100 scale-100' },
          animation: {
            'open-menu':'open-menu 0.5s ease-in-out forwards'
          }
        },
        'open-menu2':{
          form : { transform:'opacity-0 scale-95' },
          to : { transform:'opacity-100 scale-100' },
          animation: {
            'open-menu':'open-menu 0.5s ease-in-out forwards'
          }
        },
        'spin':{
          form : { transform:'rotate(0deg)' },
          to : { transform:'rotate(360deg)' },
        },
      }
    },
  },
  plugins: [],
}