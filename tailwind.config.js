

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGray: '#e5e7eb',
        black: '#000000',
        blue: '#00008B',
        lime: '#ecfccb',
        lightred: '#f86c6b ',
        customGray: '#2d2d2d',
        ashGray: "#899499",
        darkgray: "#404040",
        whiteGray: "#d7dede",
        white: '#FFFFFF',
        amber: '#f59e0b',
        LightGreen: '#4d7c0f',
        darkGreen: '#365314',
        NavyBlue: '#1b186e',
        bluehover: '#d1ddef',
        lightblue: '#38bdf8',
        EgyptianBlue:"#1434A4",
        cream: '#fffbeb',
        success: '#4CAF50', // Custom success color
        error: '#F44336', // Custom error color
        info: '#2196F3', // Custom info color
        theme1: '#a4dc60',
        theme2: '#4f9f21',
        theme3: '#315195',
        theme4: '#14213d',
        theme5: '#72bbef',
        theme6: '#faa9ba',
        theme7: '#14213d',

      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(#a4dc60 0%, #4f9f21 100%)',
        'gradient-green-hover': 'linear-gradient(#4f9f21 0%, #a4dc60 100%)',
        'gradient-blue': 'linear-gradient(-180deg, #315195 0%, #14213d 100%)',
        'gradient-blue-hover': 'linear-gradient(#14213d 0%, #315195 100%)',
        'gradient-seablue': 'linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%) ',
        'gradient-green2': 'linear-gradient(180deg,#0a92a5 15%,#076875 100%)',
        'gradient-black': 'linear-gradient(#535353 0%, #000000 80%)',
      },
      spacing: {
        'top-4': '1rem',
        'right-4': '1rem', 
      },
      boxShadow: {
        toast: '0 4px 6px rgba(0, 0, 0, 0.1)', 
      },
      fontWeight: {
        light: '300',
        medium: '500',
        semibold: '600',
        bold: '700',
        black: '900',
      },
      fontFamily: {
        custom: ['Tahoma', 'Helvetica', 'sans-serif'],
      },
      keyframes: {
        crossing1: {
          '0%': { right: '100%', top: '30%' ,left : '0%'},
          '50%': { right: '0%', top: '30%' ,left : '100%'},
          '100%': { right: '100%', top: '30%' ,left : '0%'},
        },
        crossing2: {
          '0%': { left: '100%', top: '30%' ,right : '0%'},
          '50%': { left: '0%', top: '30%', right : '100%'},
          '100%': { left: '100%', top: '30%', right : '100%' },
        },
      },
      animation: {
        crossing1: 'crossing1 1s ease-in-out infinite',
        crossing2: 'crossing2 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

