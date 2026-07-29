import React, { useState, useEffect } from 'react';

export interface FrameData {
  frame: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  pivot: { x: number; y: number };
}

export interface Atlas {
  image: string;
  frames: Record<string, FrameData>;
  meta?: {
    size?: { w: number; h: number };
  };
}

interface SpriteAnimatorProps {
  atlas: Atlas;
  imageUrl: string;
  currentPose: string;
  scale?: number;
  className?: string;
  animationClass?: string;
}

const POSE_MAP: Record<string, string> = {
  'idle_front': 'idle_breathe',
  'walk_front': 'idle_breathe',
  'back': 'idle_breathe',
  'eat': 'idle_eat',
  'sleep': 'idle_sleep_curled',
  'hurt_dizzy': 'combat_dizzy',
  'jump': 'combat_victory',
  'punch_jab': 'combat_punch',
  'kick_high': 'combat_kick',
  'block': 'combat_defense',
  'victory_jump': 'combat_victory',
  'flex_power': 'combat_biceps',
  'sit_idle': 'idle_sit',
  'roar_special': 'combat_biceps'
};

export const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({ 
  atlas, 
  imageUrl, 
  currentPose, 
  scale = 1,
  className = "",
  animationClass = ""
}) => {
  const [frameIdx, setFrameIdx] = useState(0);

  // Discover actual pose name in atlas
  let basePose = currentPose;
  
  // If exact pose not found, and it's not a sequence like "walk_right_0", try mapping
  if (!atlas.frames[basePose] && !atlas.frames[basePose + '_0']) {
    basePose = POSE_MAP[currentPose] || currentPose;
  }
  
  // Fallback to idle if still not found
  if (!atlas.frames[basePose] && !atlas.frames[basePose + '_0']) {
    basePose = atlas.frames['idle_front'] ? 'idle_front' : 'idle_breathe';
  }

  const isSequence = !!atlas.frames[basePose + '_0'];
  const maxFrames = isSequence ? 6 : 1; // Assuming max 6 frames for walk (0 to 5)

  useEffect(() => {
    setFrameIdx(0); // Reset on pose change
    if (!isSequence) return;
    
    const timer = setInterval(() => {
      setFrameIdx(prev => (prev + 1) % maxFrames);
    }, 100); // 100ms per frame
    
    return () => clearInterval(timer);
  }, [basePose, isSequence, maxFrames]);

  let finalAnimationClass = animationClass;
  if (!isSequence && basePose.includes('walk')) {
    finalAnimationClass = `${animationClass} mascot-walk-bob`.trim();
  }
  const activePoseName = isSequence ? `${basePose}_${frameIdx}` : basePose;
  const poseData = atlas.frames[activePoseName] || atlas.frames['idle_front'] || atlas.frames['idle_breathe'];

  if (!poseData) return <div className="text-red-500 font-bold bg-white/80 p-2 rounded shadow text-[10px]">Pose não encontrada: {activePoseName}</div>;

  const { x, y, w, h } = poseData.frame;
  const pivotX = poseData.pivot ? poseData.pivot.x : 0.5;
  const pivotY = poseData.pivot ? poseData.pivot.y : 0.9;
  const marginBottom = - (h * scale * (1 - pivotY));

  const atlasWidth = atlas.meta?.size?.w || 2184;
  const atlasHeight = atlas.meta?.size?.h || 2184;

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: 0,
        height: 0,
      }}
    >
      <div 
        className="absolute"
        style={{
          width: w,
          height: h,
          transform: `scale(${scale}) translate(-${pivotX * 100}%, -${pivotY * 100}%)`,
          transformOrigin: 'top left',
        }}
      >
        <div 
          className={`w-full h-full ${finalAnimationClass}`}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: `-${x}px -${y}px`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${atlasWidth}px ${atlasHeight}px`,
            imageRendering: 'pixelated',
            transformOrigin: `${pivotX * 100}% ${pivotY * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
