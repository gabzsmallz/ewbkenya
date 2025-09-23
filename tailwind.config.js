/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          accent:  "var(--brand-accent)",
          muted:   "var(--brand-muted)",
          bg:      "var(--brand-bg)",
          tint:    "var(--brand-tint)",
          text:    "var(--brand-text)",
        },
      },
      boxShadow: {
        brand: "0 10px 30px -10px color-mix(in srgb, var(--brand-primary) 28%, transparent)",
      },
    },
  },
  plugins: [],
};
