/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGray:'#e5e7eb',
        black: '#000000',
        blue: '#00008B',
        customGray: '#2d2d2d',
        darkgray: "#404040",
        whiteGray: "#d7dede",
        white: '#FFFFFF',
        amber:'#f59e0b',
        LightGreen: '#4d7c0f',
        darkGreen: '#365314',
        NavyBlue: '#1b186e',
        lightblue: '#38bdf8',
        cream:'#fffbeb',
        success: '#4CAF50', // Custom success color
        error: '#F44336', // Custom error color
        info: '#2196F3', // Custom info color
        theme1 : '#a4dc60',
        theme2 : '#4f9f21',
        theme3 : '#315195',
        theme4 : '#14213d',
        theme5 : '#72bbef',
        theme6 : '#faa9ba'
      },
      backgroundImage : {
        'gradient-green' : 'linear-gradient(#a4dc60 0%, #4f9f21 100%)',
        'gradient-green-hover': 'linear-gradient(#4f9f21 0%, #a4dc60 100%)',
        'gradient-blue' : 'linear-gradient(-180deg, #315195 0%, #14213d 100%)',
        'gradient-blue-hover' : 'linear-gradient(#14213d 0%, #315195 100%)',
        'gradient-seablue':'linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%) ',
        'gradient-green2' : 'linear-gradient(180deg,#0a92a5 15%,#076875 100%)',
      },
      // Custom spacing for positioning toasts
      spacing: {
        'top-4': '1rem', // Position from top
        'right-4': '1rem', // Position from right
      },
      boxShadow: {
        toast: '0 4px 6px rgba(0, 0, 0, 0.1)', // Toast shadow
      },
      fontWeight: {
        // thin: '100',
        // hairline: '100',
        // extralight: '200',
        light: '300',
        // normal: '400',
        medium: '500',
        // semibold: '600',
        bold: '700',
        // extrabold: '800',
        // 'extra-bold': '800',
        black: '900',
      }
    },
  },
  plugins: [],
}

// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         black: '#000000',
//         blue:'#00008B',
//         customGray: '#2d2d2d',
//         darkgray:"#404040",
//         whiteGray:"#d7dede",
//         white: '#FFFFFF',
//         LightGreen: '#4d7c0f',
//         darkGreen: '#365314',
//         NavyBlue:'#1b186e',
//         lightblue:'#38bdf8',
//       },
//     },
//   },
//   plugins: [],
// }


// colors : {
//   theme1 : '#a4dc60',
//   theme2 : '#4f9f21',
//   theme3 : '#315195',
//   theme4 : '#14213d',
//   theme5 : '#72bbef',
//   theme6 : '#faa9ba'
// },
// backgroundImage : {
//   'gradient-green' : 'linear-gradient(#a4dc60 0%, #4f9f21 100%)',
//   'gradient-green-hover': 'linear-gradient(#4f9f21 0%, #a4dc60 100%)',
//   'gradient-blue' : 'linear-gradient(-180deg, #315195 0%, #14213d 100%)',
//   'gradient-blue-hover' : 'linear-gradient(#14213d 0%, #315195 100%)',
//   'gradient-green2' : 'linear-gradient(180deg,#0a92a5 15%,#076875 100%)',
// }