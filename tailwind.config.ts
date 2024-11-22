import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        threat: ['Threat', 'sans-serif'],
      },
      maxWidth: {
        outer: '92.5rem', 
        inner: '86.625rem',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        titleColor: "#171719",
        descriptionColor : "#5E5E5E",
        detailColor : "#858587",
        strokeColor : "#F1F1F1",
        footerTextColor : "#7E7E8C",
        footerBgColor : "#EDEDED",
      },
    },
  },
  plugins: [],
};
export default config;

