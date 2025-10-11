import type { Config } from 'tailwindcss';
import type { CSSProperties } from 'react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      mobile: {
        max: '900px',
      },
      sm: {
        min: '640px',
      },
      md: {
        min: '768px',
      },
      lg: {
        min: '1024px',
      },
      xl: {
        min: '1280px',
      },
      '2xl': {
        min: '1536px',
      },
    },
    extend: {
      gridTemplateColumns: {
        'auto-fit-card': 'repeat(auto-fit, minmax(24rem, 1fr))'
      },
      lineClamp: {
        7: '7',
        8: '8',
      },
      padding: {
        '14px': '0.875rem',
        'white-space-margin': '0 211px',
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
        'light-gray-input': '#F5F5F7',
        'light-gray-outline': '#F5F5F7',
        'light-gray-footer-bg': '#EDEDED',
        'light-gray': '#EAEAEC',
        'gray-footer': '#7E7E8C',
        'placeholder-gray': '#858587',
        'gray-base': '#5E5E5E',
        black: '#131313',
        'blue-primary': '#1462FF',
        'red-primary': '#FD462D',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/container-queries'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/line-clamp'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwind-scrollbar'),
    // flex-row, flex-col 시 display: flex 자동 적용
    function ({
      addUtilities,
    }: {
      addUtilities: (utils: Record<string, CSSProperties>) => void;
    }) {
      addUtilities({
        '.flex-row': {
          display: 'flex',
          flexDirection: 'row',
        },
        '.flex-col': {
          display: 'flex',
          flexDirection: 'column',
        },
        '.flex-center': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        '.flex-x-center': {
          display: 'flex',
          justifyContent: 'space-between',
        },
        '.flex-y-center': {
          display: 'flex',
          alignItems: 'center',
        },
        '.inline-flex-center': {
          display: 'inline-flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config;
