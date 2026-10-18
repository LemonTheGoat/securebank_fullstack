/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eef4ff', 100: '#dae5ff', 500: '#3361f6', 600: '#2742e0', 700: '#1f32b6', 900: '#1e2b72' },
        success: { 500: '#10b981', 600: '#059669' },
        danger: { 500: '#f43f5e', 600: '#e11d48' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['ui-monospace', 'SFMono-Regular', 'monospace'] },
      fontSize: { '2xs': ['0.6875rem', { lineHeight: '1rem' }] },
    },
  },
  plugins: [],
};