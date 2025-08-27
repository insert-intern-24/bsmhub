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
        white: '#FFFFFF',
        'light-gray-outline': '#F5F5F7',
        'light-gray-footer-bg': '#EDEDED',
        'light-gray': '#EAEAEC',
        'gray-footer': '#1462FF', // 이미지 컬러값 기준
        'gray-base': '#5E5E5E',
        black: '#131313',
        'blue-primary': '#1462FF',
        'red-primary': '#FD462D',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/line-clamp'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwind-scrollbar'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config;
