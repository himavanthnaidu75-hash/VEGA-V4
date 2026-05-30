/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        ink: "var(--color-ink)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        kill: "var(--color-kill)",
      }
    },
  },
  plugins: [],
}
