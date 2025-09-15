// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1D4ED8',
        'primary-hover': '#1E40AF',
        'surface-ground': '#F8FAFC',
        'surface-card': '#FFFFFF',
        'surface-border': '#E5E7EB',
        'text-color': '#4B5563',
        'text-color-secondary': '#6B7180',
        'green-500': '#22C55E',
        'yellow-500': '#EAB308',
        'red-500': '#EF4444'
      },
      fontFamily: {
        sans: ['"Inter", sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
      }
    },
  },
  plugins: [],
}