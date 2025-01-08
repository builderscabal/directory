"use client";

import React from 'react';
import Script from 'next/script';

declare const Tally: any;

export default function Home() {
  return (
    <>
      <style jsx global>{`
        html, body, div#__next {
          margin: 0;
          height: 100%;
          overflow: hidden;
        }
        iframe {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
      `}</style>

      <iframe 
        data-tally-src="https://tally.so/r/3NLGMO" 
        frameBorder="0" 
        marginHeight={0} 
        marginWidth={0} 
        title="Join the Community | BuildersCabal"
      ></iframe>

      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          Tally.loadEmbeds();
        }}
      />
    </>
  );
};