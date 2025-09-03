'use client';

import { Player } from '@lottiefiles/react-lottie-player';
import React, { useState, useEffect } from 'react';

const thoughts = [
  "Thinking like a threat actor...",
  "🧠 Parsing raw logs...",
  "Following the breadcrumbs...",
  "Is this C2 traffic? Hmmm...",
  "Sniffing packet trails 🐾",
  "💾 Hashing uploaded files...",
  "Pixel knows what you did last port scan.",
];

export default function Pixel() {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % thoughts.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col items-start space-y-2">
      <div className="w-24 h-24">
        <Player
          autoplay
          loop
          src="/pixel-cat.json"   // served from /web/public
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white/20">
        <p className="text-xs text-white italic">{thoughts[thoughtIndex]}</p>
      </div>
    </div>
  );
}
