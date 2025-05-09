/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "delv-400": "rgb(128, 52, 158)",
        "delv-500": "rgb(128, 52, 158)",
      },
    },
  },
  plugins: [],
}

