import React from 'react';
import { Question } from '../types';

export function VerticalAlgorithm({ q, tutShow }: { q: Question; tutShow: any }) {
  const top = q.vTop ?? 0;
  const bot = q.vBot ?? 0;
  const op = q.vOp ?? "+";
  
  const topStr = String(top).split('');
  const botStr = String(bot).split('');
  
  // Pad left with empty strings
  const maxLen = Math.max(topStr.length, botStr.length);
  while (topStr.length < maxLen) topStr.unshift(' ');
  while (botStr.length < maxLen) botStr.unshift(' ');

  return (
    <div className="flex flex-col items-end font-mono text-4xl font-black tracking-[0.5em] text-slate-700 bg-white p-6 rounded-2xl shadow-inner select-none relative">
      
      <div className="flex">
        {topStr.map((c, i) => (
          <span key={`t${i}`} className="w-8 text-center">{c}</span>
        ))}
      </div>
      
      <div className="flex relative border-b-4 border-slate-700 pb-2 mb-2">
        <span className="absolute -left-10 text-indigo-500">{op}</span>
        {botStr.map((c, i) => (
          <span key={`b${i}`} className="w-8 text-center">{c}</span>
        ))}
      </div>
      
      {/* Answer Area */}
      <div className="flex h-10">
        {tutShow != null && String(tutShow).split('').map((c, i) => (
          <span key={`a${i}`} className="w-8 text-center text-indigo-600">{c}</span>
        ))}
      </div>
    </div>
  );
}
