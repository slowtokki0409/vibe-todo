/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xl': '16px',
      }
    },
  },
  plugins: [],
}
