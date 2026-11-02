export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"] },
      colors: { brand: { DEFAULT: "#b44cf5", dark: "#4200b0", light: "#f6ecfe" }, surface: "#f1f2fb", ink: "#14151f" },
    },
  },
  plugins: [],
};
