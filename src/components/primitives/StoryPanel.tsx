import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tokens } from '../../styles/tokens';

export interface StoryPanelProps {
  step: 1 | 2 | 3;
  p1Illustration: React.ReactNode;
  p1Text: string;
  p2Illustration: React.ReactNode;
  p2Text: string;
  p3Text: string;
}

export function StoryPanel({ step, p1Illustration, p1Text, p2Illustration, p2Text, p3Text }: StoryPanelProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto py-1">
      {/* Painel 1 */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col rounded-2xl overflow-hidden shadow-sm"
            style={{ border: `2px solid ${tokens.cor.elementos.borda}` }}
          >
            <div className="px-3 py-2 min-h-[64px] flex items-center justify-center" style={{ backgroundColor: tokens.cor.superficie.cartao }}>
              {p1Illustration}
            </div>
            <div className="px-3 py-2 text-center font-bold text-base" style={{ backgroundColor: tokens.cor.superficie.fundo, color: tokens.cor.texto.principal }}>
              {p1Text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel 2 */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col rounded-2xl overflow-hidden shadow-sm"
            style={{ border: `2px solid ${tokens.cor.elementos.borda}` }}
          >
            <div className="px-3 py-2 min-h-[64px] flex items-center justify-center" style={{ backgroundColor: tokens.cor.superficie.cartao }}>
              {p2Illustration}
            </div>
            <div className="px-3 py-2 text-center font-bold text-base" style={{ backgroundColor: tokens.cor.superficie.fundo, color: tokens.cor.texto.principal }}>
              {p2Text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel 3 - Pergunta */}
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-4 py-3 rounded-3xl text-center font-black text-xl shadow-sm"
            style={{ backgroundColor: tokens.cor.elementos.marcador, color: tokens.cor.texto.inverso, border: `2px solid ${tokens.cor.elementos.borda}` }}
          >
            {p3Text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
