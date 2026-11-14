/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // DNA base palette
        'dna-A': '#F4A5A5',
        'dna-C': '#A5D4F4',
        'dna-G': '#A5F4B8',
        'dna-T': '#D4A5F4',
        // Theme colors
        primary: '#6B7FD4',
        secondary: '#A5D4F4',
        accent: '#F4A5A5',
        background: '#F8F7FF',
        surface: '#FFFFFF',
        'text-main': '#1E293B',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
