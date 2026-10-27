/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind que busque clases en App.jsx
  ],
  theme: {
    extend: {
      colors: {
        crema: {
          claro: "#faf4e8",
          DEFAULT: "#f5e7cd",
          oscuro: "#e0c99f",
        },
        vinotinto: {
          claro: "#a33b3b",
          DEFAULT: "#7a1c1c",
          oscuro: "#5c0f0f",
        },
      },
    },
  },
  plugins: [],
};
