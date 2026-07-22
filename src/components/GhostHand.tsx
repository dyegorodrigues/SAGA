import React from 'react';
import { motion } from 'motion/react';

interface GhostHandProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

export function GhostHand({ startX, startY, endX, endY, duration = 1.5, delay = 0, onComplete }: GhostHandProps) {
  return (
    <motion.div
      initial={{ x: startX, y: startY, opacity: 0, scale: 1.2 }}
      animate={{ 
        x: [startX, startX, endX, endX], 
        y: [startY, startY, endY, endY],
        opacity: [0, 0.8, 0.8, 0],
        scale: [1.2, 1, 1, 1.2]
      }}
      transition={{ 
        duration, 
        delay, 
        times: [0, 0.2, 0.8, 1],
        ease: "easeInOut" 
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        pointerEvents: 'none',
        fontSize: '40px',
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
      }}
    >
      👆
    </motion.div>
  );
}
