/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        blue: '#00008B',
        customGray: '#2d2d2d',
        darkgray: "#404040",
        whiteGray: "#d7dede",
        white: '#FFFFFF',
        LightGreen: '#4d7c0f',
        darkGreen: '#365314',
        NavyBlue: '#1b186e',
        lightblue: '#38bdf8',
        success: '#4CAF50', // Custom success color
        error: '#F44336', // Custom error color
        info: '#2196F3', // Custom info color
      },
      // Custom spacing for positioning toasts
      spacing: {
        'top-4': '1rem', // Position from top
        'right-4': '1rem', // Position from right
      },
      boxShadow: {
        toast: '0 4px 6px rgba(0, 0, 0, 0.1)', // Toast shadow
      },
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