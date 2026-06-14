/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#b44dff',
          orange: '#ff6b4a',
          green: '#3dfcb4',
        },
        desk: {
          wood: '#8B6914',
          dark: '#2a1f0a',
          light: '#c4a44a',
        }
      },
      fontFamily: {
        display: ['"DM Sans"', '"Noto Sans SC"', 'sans-serif'],
        body: ['"Inter"', '"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'diamond-rotate': 'diamond-rotate 3s linear infinite',
      },
      keyframes: {
        'diamond-rotate': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shiny-sweep': {
          '0%':   { backgroundPosition: '150% center' },
          '100%': { backgroundPosition: '-50% center' },
        },
      },
    },
  },
  plugins: [],
}
