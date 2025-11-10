'use client';

import React from 'react';
import './text.css';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

// Title(EN)
export const TitleEN = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <h1
      className={`text-title-en ${className}`}
      style={{
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
      }}
      {...props}
    >
      {children}
    </h1>
  );
};

// Title
export const Title = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <h1 className={`text-title ${className}`} {...props}>
      {children}
    </h1>
  );
};

// Heading2
export const Heading2 = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <h2 className={`text-heading2 ${className}`} {...props}>
      {children}
    </h2>
  );
};

// Heading
export const Heading = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <h2 className={`text-heading ${className}`} {...props}>
      {children}
    </h2>
  );
};

// Body
export const Body = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <p className={`text-body ${className}`} {...props}>
      {children}
    </p>
  );
};

// Body2
export const Body2 = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <p className={`text-body2 ${className}`} {...props}>
      {children}
    </p>
  );
};

// Label2
export const Label2 = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <span className={`text-label2 ${className}`} {...props}>
      {children}
    </span>
  );
};

// Label
export const Label = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <span className={`text-label ${className}`} {...props}>
      {children}
    </span>
  );
};

// Caption
export const Caption = ({
  children,
  className = '',
  ...props
}: TextProps) => {
  return (
    <span className={`text-caption ${className}`} {...props}>
      {children}
    </span>
  );
};
