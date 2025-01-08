"use client";

import React from 'react';

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
        src="https://lu.ma/embed/event/evt-mDxdearK1bRbJB4/simple"
        width="600"
        height="450"
        frameBorder="0"
        style={{ border: '1px solid #bfcbda88', borderRadius: '4px', width: '100%', height: '100%' }}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
        title="Virtual Launch Party 🎉"
      ></iframe>
    </>
  );
};