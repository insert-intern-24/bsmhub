"use client"
import tw from 'twin.macro';
import styled from 'styled-components';

// Title(EN)
export const TitleEN = styled.h1`
  ${tw`font-bold font-threat`}
  font-size: 1.5rem; // 24px
  line-height: 1.5rem; // 24px
  letter-spacing: -0.023em;
`;

// Title
export const Title = styled.h1`
  ${tw`font-bold`}
  font-size: 1.5rem; // 24px
  line-height: 2rem; // 32px
  letter-spacing: -0.023em;
`;

// Heading2
export const Heading2 = styled.h2`
  ${tw`font-semibold`}
  font-size: 1.25rem; // 20px
  line-height: 2.25rem; // 36px
  letter-spacing: -0.012em;
`;

// Heading
export const Heading = styled.h2`
  ${tw`font-semibold`}
  font-size: 1.25rem; // 20px
  line-height: 1.5rem; // 24px
  letter-spacing: -0.012em;
`;

// Body
export const Body = styled.p`
  ${tw`font-normal`}
  font-size: 1rem; // 16px
  line-height: 1.375rem; // 22px
  letter-spacing: 0.0057em;
`;

// Label2
export const Label2 = styled.span`
  ${tw`font-medium`}
  font-size: 0.875rem; // 14px
  line-height: 1.25rem; // 20px
  letter-spacing: 0.0145em;
`;

// Label
export const Label = styled.span`
  ${tw`font-medium`}
  font-size: 0.875rem; // 14px
  line-height: 1.25rem; // 20px
  letter-spacing: 0.0145em;
`;

// Caption
export const Caption = styled.span`
  ${tw`font-normal`}
  font-size: 0.75rem; // 12px
  line-height: 1rem; // 16px
  letter-spacing: 0.0252em;
`;
