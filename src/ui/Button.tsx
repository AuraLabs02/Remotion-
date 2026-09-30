import React from 'react';
import {FONT, YT} from '../theme/tokens';
import {Icon, type IconName} from './Icon';

export type PillVariant = 'white' | 'tonal' | 'cta' | 'ghost' | 'brand';

const VARIANTS: Record<PillVariant, {bg: string; fg: string; hover: string}> = {
  white: {bg: '#f1f1f1', fg: '#0f0f0f', hover: '#d9d9d9'},
  tonal: {bg: YT.tonal, fg: YT.text, hover: YT.tonalHover},
  cta: {bg: YT.cta, fg: YT.ctaText, hover: '#65b8ff'},
  ghost: {bg: 'transparent', fg: YT.cta, hover: 'rgba(62,166,255,0.15)'},
  brand: {
    bg: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #8b5cf6 100%)',
    fg: '#fff',
    hover: 'linear-gradient(135deg, #5ee4f5 0%, #6aa2ff 50%, #a684ff 100%)',
  },
};

type PillProps = {
  label: React.ReactNode;
  variant?: PillVariant;
  icon?: IconName;
  trailingIcon?: IconName;
  height?: number;
  fontSize?: number;
  padX?: number;
  hover?: number;
  press?: number;
  /** 0..1 ripple progress; undefined = none. */
  ripple?: number;
  rippleX?: number;
  width?: number | string;
  style?: React.CSSProperties;
};

/** YouTube's pill button (Subscribe / Join / Buy …) with hover, press and ink ripple. */
export const Pill: React.FC<PillProps> = ({
  label,
  variant = 'tonal',
  icon,
  trailingIcon,
  height = 36,
  fontSize = 14,
  padX = 16,
  hover = 0,
  press = 0,
  ripple,
  rippleX = 0.5,
  width,
  style,
}) => {
  const v = VARIANTS[variant];
  return (
    <div
      style={{
        position: 'relative',
        height,
        width,
        padding: `0 ${padX}px`,
        borderRadius: height / 2,
        background: v.bg,
        color: v.fg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontFamily: FONT.ui,
        fontWeight: 500,
        fontSize,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        transform: `scale(${1 - press * 0.06})`,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: v.hover,
          opacity: hover,
          borderRadius: 'inherit',
        }}
      />
      {ripple !== undefined && ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: `${rippleX * 100}%`,
            top: '50%',
            width: 260,
            height: 260,
            marginLeft: -130,
            marginTop: -130,
            borderRadius: '50%',
            background: variant === 'white' ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.35)',
            transform: `scale(${0.05 + ripple * 1.2})`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      {icon ? <Icon name={icon} size={height * 0.62} style={{position: 'relative', marginLeft: -4}} /> : null}
      <span style={{position: 'relative'}}>{label}</span>
      {trailingIcon ? <Icon name={trailingIcon} size={height * 0.62} style={{position: 'relative', marginRight: -6}} /> : null}
    </div>
  );
};

export const IconButton: React.FC<{
  icon: IconName;
  size?: number;
  bg?: string;
  color?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({icon, size = 40, bg = 'transparent', color = YT.text, style, children}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      flexShrink: 0,
      ...style,
    }}
  >
    <Icon name={icon} size={size * 0.6} color={color} />
    {children}
  </div>
);
