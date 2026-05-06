/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF9F43',
          hover: '#FF8A1D',
          light: '#FFF4E8',
        },
        secondary: {
          DEFAULT: '#1B2850',
          light: '#2C3D7A',
        },
        success: '#28C76F',
        info: '#2167E3',
        background: '#F4F7FB',
        surface: '#FFFFFF',
        text: {
          primary: '#212B36',
          secondary: '#637381',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0px 4px 15px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
