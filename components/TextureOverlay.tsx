import React from 'react';

export const TextureOverlay: React.FC = () => {
  return (
    <>
      <svg className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-40 mix-blend-multiply">
        <filter id='noiseFilter'>
          <feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width='100%' height='100%' filter='url(#noiseFilter)'/>
      </svg>
    </>
  );
};