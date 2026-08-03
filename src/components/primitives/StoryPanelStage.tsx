import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { StorySpec } from "../../curriculum/procedimentos/storyBarsContract";
import { StoryPanel } from "./StoryPanel";
import { tokens } from "../../styles/tokens";

interface Props {
  story: StorySpec;
  /** Divulgação progressiva: 1 situação, 2 mudança, 3 pergunta. */
  step?: 1 | 2 | 3;
  onReplay?: () => void;
}

/**
 * Liga o contrato narrativo ao `StoryPanel`, que já existia sem uso.
 *
 * O palco converte as batidas em ilustração e texto; o painel continua sem saber
 * o que é uma competência, e nenhuma barra é desenhada aqui. A representação
 * matemática pertence ao `SingaporeBars` — a separação é o que permite ao
 * diagnóstico distinguir erro de leitura de erro de estrutura.
 */
export function StoryPanelStage({ story, step = 3, onReplay }: Props) {
  const reduzirMovimento = useReducedMotion();
  const [inicial, mudanca] = story.beats;

  const ilustracao = (quantidade: number, animar: boolean) => (
    <Ilustracao
      quantidade={quantidade}
      emoji={story.emoji}
      animar={animar && story.showChangeIllustration && !reduzirMovimento}
    />
  );

  return (
    <div className="w-full flex flex-col items-center">
      <StoryPanel
        step={step}
        p1Illustration={ilustracao(inicial.count ?? 0, false)}
        p1Text={inicial.text}
        p2Illustration={ilustracao(mudanca.count ?? 0, true)}
        p2Text={mudanca.text}
        p3Text={story.question}
      />

      {/* "Ver de novo" pertence ao roteiro da ficha e só existe quando há
          ilustração da mudança para repetir. */}
      {story.showChangeIllustration && onReplay && step >= 2 && (
        <button
          type="button"
          onClick={onReplay}
          aria-label="Ver de novo o que aconteceu"
          className="mt-4 rounded-full font-bold shadow-sm active:scale-95"
          style={{
            minWidth: tokens.tamanho.alvo,
            minHeight: tokens.tamanho.alvo,
            backgroundColor: tokens.cor.superficie.destaque,
            color: tokens.cor.texto.principal,
            borderColor: tokens.cor.elementos.borda,
            borderWidth: 1,
          }}
        >
          🔁
        </button>
      )}
    </div>
  );
}

/**
 * A entrada animada dos objetos é animação pedagógica, não decorativa: é vendo
 * a quantidade chegar que a criança reconhece a estrutura sem precisar ler.
 * Por isso ela some junto com a ilustração no nível 4, e respeita
 * `prefers-reduced-motion` sem deixar de mostrar o resultado final.
 */
function Ilustracao({
  quantidade,
  emoji,
  animar,
}: {
  quantidade: number;
  emoji: string;
  animar: boolean;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-1"
      role="img"
      aria-label={`${quantidade} ${quantidade === 1 ? "objeto" : "objetos"}`}
    >
      {Array.from({ length: quantidade }).map((_, i) => (
        <motion.span
          key={i}
          className="text-4xl"
          aria-hidden="true"
          initial={animar ? { opacity: 0, x: 32 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: animar ? i * 0.12 : 0, duration: 0.3 }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}
