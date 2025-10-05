import type { CSSProperties } from 'react';

export const PLAY_BUTTON_BORDER_STYLE: CSSProperties = {
  background: 'linear-gradient(180deg, #282A2B 0%, white 100%)',
  padding: '0.9px',
};

export const PLAY_BUTTON_FILL_STYLE: CSSProperties = {
  background:
    'linear-gradient(170deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0.5) 100%), black',
};

export const PLAY_BUTTON_SHEEN_STYLE: CSSProperties = {
  background:
    'linear-gradient(110deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.05) 100%)',
  pointerEvents: 'none',
};

export const PLAY_BUTTON_TOP_GLOW_STYLE: CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)',
  pointerEvents: 'none',
};

export const PLAY_BUTTON_BOTTOM_GLOW_STYLE: CSSProperties = {
  background:
    'linear-gradient(0deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%)',
  pointerEvents: 'none',
};

export const PLAY_BUTTON_DEPTH_STYLE: CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
  zIndex: -1,
};

export const FALLBACK_ICON = '/card/dummy-project-icon.png';
export const FALLBACK_PROFILE = '/card/dummy-profile.png';
