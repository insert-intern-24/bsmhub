import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      lineClamp: {
        7: '7',
        8: '8',
      },
      padding: {
        '14px': '0.875rem',
      },
      text: {
        '14px': '0.875rem',
      },
      fontFamily: {
        threat: ['Threat', 'sans-serif'],
      },
      maxWidth: {
        outer: '92.5rem',
        inner: '86.625rem',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        titleColor: '#171719',
        descriptionColor: '#5E5E5E',
        detailColor: '#858587',
        strokeColor: '#F1F1F1',
        footerTextColor: '#7E7E8C',
        footerBgColor: '#EDEDED',
        customGray: '#F5F5F7',
        customGray2: '#F2F2F2',
        followBlue: '#216BFF',
        moreGray: '#8E8E8E',
      },
      backgroundImage: {
        'contest-gradient': 'linear-gradient(180deg, rgba(47, 66, 205, 0.07) 0%, rgba(255, 255, 255, 0.07) 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
export default config;
