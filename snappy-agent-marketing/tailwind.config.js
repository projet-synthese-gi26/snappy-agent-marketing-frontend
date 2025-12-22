/** @type {import('tailwindcss').Config} */
module.exports = {
  // On active le mode sombre via une classe CSS
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tes couleurs personnalisées
        brand: {
          orange: '#FF8C00',
          blue: '#3498DB',
        },
      },
    },
  },
  plugins: [],
}