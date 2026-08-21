import React from 'react';
import { ThinkingOrb as AntalikThinkingOrb } from 'thinking-orbs';

/**
 * ThinkingOrb
 * 
 * Official Thinking Orb component from Jakub Antalík (thinking-orbs package).
 * Supports automatic dark/light theme resolution and interactive state animations.
 */
export const ThinkingOrb = ({ size = 20, state = 'composing', theme = 'auto', speed = 1 }) => {
  // Normalize size to official supported sizes (20 or 64)
  const orbSize = size > 40 ? 64 : 20;

  return (
    <AntalikThinkingOrb
      size={orbSize}
      state={state}
      theme={theme}
      speed={speed}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
};

export default ThinkingOrb;
