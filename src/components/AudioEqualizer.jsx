import React from 'react';

export function AudioEqualizer({ isPlaying }) {
  return (
    <div className={`audio-equalizer ${isPlaying ? 'active' : ''}`}>
      <span className="bar bar-1"></span>
      <span className="bar bar-2"></span>
      <span className="bar bar-3"></span>
      <span className="bar bar-4"></span>
      <span className="bar bar-5"></span>
      <span className="bar bar-6"></span>
    </div>
  );
}
