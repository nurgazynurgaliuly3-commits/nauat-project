import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#120f0b",
        espresso: "#2a1a11",
        cedar: "#5a3823",
        gold: "#c59b56",
        sage: "#173d31",
        porcelain: "#f7f1e7",
        linen: "#efe3d0"
      },
      boxShadow: {
        glow: "0 18px 60px rgba(197, 155, 86, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
