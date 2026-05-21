/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          DEFAULT: '#2C1A0A',
          deep:    '#1F1208',
          light:   '#3B1E08',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light:   '#E8C84A',
          dark:    '#B8960C',
        },
        linen:    '#F5EDE0',
        surface:  '#E8D4BA',
        cream:    '#FDF6E3',
        ink:      '#2E1810',
        'on-dark': '#F5EDD4',
        maroon:   '#4A0000',
        choco:    '#3B1E08',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      screens: { xs: '390px' },
    },
  },
  plugins: [],
}
