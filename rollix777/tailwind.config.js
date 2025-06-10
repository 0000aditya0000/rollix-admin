/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideInDown: {
          "0%": { transform: "translateY(-100%) translateX(-50%)" },
          "100%": { transform: "translateY(0) translateX(-50%)" }
        }
      },
      animation: {
        slideInDown: "slideInDown 0.3s ease-out"
      }
    }
  },
  plugins: []
};
