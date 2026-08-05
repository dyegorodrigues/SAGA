import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A micro-aula do deslocamento — ficha F67, coreografia `promoverOrdens`.
 *
 * ---
 *
 * **O problema que ela resolve.** Mostrar o material parado e dizer "cada peça
 * sobe uma casa" pede que a criança IMAGINE a promoção. Quem está aprendendo
 * multiplicação agora não tem essa imagem ainda — ela olha os cubinhos, conta,
 * e a frase passa por cima. O material vira decoração.
 *
 * **Por que UMA peça, e não o material inteiro.** Promover as vinte e nove
 * peças na tela mostraria o resultado — ou seja, entregaria a resposta com
 * aparência de aula. Demonstrar em **uma peça** ensina a regra e deixa a
 * aplicação para a criança, que é exatamente o que se quer treinar.
 *
 * Cubinho vira barra. Barra vira placa. Nada é acrescentado: tudo é PROMOVIDO —
 * e é essa diferença que separa entender de decorar "acrescenta zero".
 */

interface Props {
  /** Quantas ordens sobem: uma para ×10, duas para ×100. */
  ordens: number;
}

const Cubinho = () => (
  <div className="h-5 w-5 rounded-sm border border-amber-600 bg-amber-400 shadow-sm" />
);

const Barra = () => (
  <div className="flex flex-col gap-[1px] rounded-sm bg-amber-600 p-[1px] shadow-md">
    {Array.from({ length: 10 }, (_, i) => <div key={i} className="h-[9px] w-5 bg-amber-400" />)}
  </div>
);

const Placa = () => (
  <div className="grid grid-cols-10 gap-[1px] rounded-sm bg-amber-600 p-[2px] shadow-md">
    {Array.from({ length: 100 }, (_, i) => <div key={i} className="h-[5px] w-[5px] bg-amber-400" />)}
  </div>
);

function Passo({ de, para, atraso, reduzido }: {
  de: React.ReactNode; para: React.ReactNode; atraso: number; reduzido: boolean;
}) {
  const transicao = reduzido
    ? { duration: 0 }
    : { duration: 0.45, delay: atraso, ease: "easeOut" as const };
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end" style={{ minHeight: 46 }}>{de}</div>
      <motion.span
        aria-hidden="true"
        className="text-2xl font-black text-amber-700"
        initial={reduzido ? false : { opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={transicao}
      >
        ↑
      </motion.span>
      <motion.div
        className="flex items-end"
        style={{ minHeight: 46 }}
        initial={reduzido ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...transicao, delay: atraso + 0.15 }}
      >
        {para}
      </motion.div>
    </div>
  );
}

export function PromocaoDeOrdem({ ordens }: Props) {
  const reduzido = Boolean(useReducedMotion());
  return (
    <div
      role="img"
      aria-label={ordens >= 2
        ? "Demonstração: um cubinho sobe duas casas e vira uma placa"
        : "Demonstração: um cubinho vira uma barra, e uma barra vira uma placa"}
      className="flex flex-wrap items-end justify-center gap-5 rounded-xl bg-amber-50 px-4 py-3"
    >
      <Passo de={<Cubinho />} para={<Barra />} atraso={0} reduzido={reduzido} />
      <Passo
        de={<Barra />}
        para={<Placa />}
        atraso={reduzido ? 0 : 0.5}
        reduzido={reduzido}
      />
    </div>
  );
}
