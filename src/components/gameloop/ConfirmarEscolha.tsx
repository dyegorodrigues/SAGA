import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { tokens } from "../../styles/tokens";

/**
 * O botão de confirmar — o segundo toque que a criança consegue VER.
 *
 * ## Por que existe
 *
 * A regra "toque para ouvir, toque de novo para escolher" estava certa e era
 * invisível: nada na tela dizia que o segundo toque era o que valia. A criança
 * ouvia "dois", ficava satisfeita, e a resposta nunca era enviada — ou ela
 * tocava de novo sem saber que estava decidindo. O pai desenhou o conserto:
 *
 * > *"quando tu aperta a primeira vez, não tinha que sair o som, ela ouviu o
 * > som, deu certinho, deu não sei o que, e embaixo ou do lado (...) o botão
 * > de confirmar, sei lá, piscando, piscando para a criança entender, ela
 * > ouvir a resposta do botão que ela está clicando."*
 *
 * Então: primeiro toque fala e ARMA; o confirmar aparece, pulsando, repetindo
 * a escolha por extenso, com o 🔊 para ouvir de novo quantas vezes quiser. Só
 * ele responde.
 *
 * ## O que ele carrega junto
 *
 * O rótulo escolhido vai DENTRO do botão. Não é enfeite: é o que permite à
 * criança conferir o que ela armou sem voltar a tela inteira com o olho — e
 * ao adulto ao lado entender o que ela escolheu sem perguntar.
 */
interface Props {
  /** O que a criança armou, escrito como ela vê na alternativa. */
  rotulo: string;
  /** Diz de novo. O mesmo texto do primeiro toque. */
  onOuvirDeNovo: () => void;
  /** Responde. É o único caminho para `handlePick`. */
  onConfirmar: () => void;
  /** Desfaz sem responder — a criança mudou de ideia. */
  onCancelar: () => void;
}

export function ConfirmarEscolha({ rotulo, onOuvirDeNovo, onConfirmar, onCancelar }: Props) {
  const reduzido = useReducedMotion();
  return (
    <div className="mt-3 flex items-stretch justify-center gap-2 px-2">
      <button
        type="button"
        onClick={onOuvirDeNovo}
        aria-label={`Ouvir de novo: ${rotulo}`}
        className="flex min-h-[56px] w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-2xl"
        style={{ borderColor: tokens.cor.elementos.borda, background: tokens.cor.superficie.fundo }}
      >
        <span aria-hidden>🔊</span>
      </button>

      {/*
        ⚠️ O ALVO NÃO SE MEXE. Quem pulsa é o halo atrás dele.

        Aqui o botão inteiro pulsava com `scale`, porque o pulso é o que o pai
        pediu e é o que a tela precisava. Só que um alvo que nunca para de se
        mexer não assenta: o toque não vira `click`, e a criança ficava com
        "É esta: 2" na tela para sempre, sem conseguir avançar. Ele descreveu
        exatamente isso — *"nem confirma (...) fica com a resposta 2 marcada
        (...) não vai para o próximo exercício, bugou"*.

        Medido no navegador: clicar dava `element is not stable` em 4s; com
        `force: true` a questão avançava na hora.

        O pulso continua, e continua visível. Ele só não é mais o botão.
      */}
      <span className="relative flex flex-1">
        {!reduzido && (
          <motion.span
            aria-hidden="true"
            data-halo-confirmar
            className="pointer-events-none absolute inset-[-6px] rounded-[20px]"
            style={{ background: tokens.cor.feedback.acerto }}
            animate={{ opacity: [0.45, 0, 0.45], scale: [0.98, 1.06, 0.98] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
        )}
        <button
          type="button"
          onClick={onConfirmar}
          aria-label={`Confirmar: ${rotulo}`}
          className="relative flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl border-none px-4 text-lg font-black"
          style={{
            background: tokens.cor.feedback.acerto,
            color: tokens.cor.texto.inverso,
            boxShadow: `0 5px 0 color-mix(in srgb, ${tokens.cor.feedback.acerto} 70%, black)`,
          }}
        >
          <span aria-hidden>✓</span>
          <span className="truncate">É esta: {rotulo}</span>
        </button>
      </span>

      <button
        type="button"
        onClick={onCancelar}
        aria-label="Escolher outra"
        className="flex min-h-[56px] w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-xl font-black"
        style={{ borderColor: tokens.cor.elementos.borda, background: tokens.cor.superficie.fundo, color: tokens.cor.texto.secundario }}
      >
        <span aria-hidden>↺</span>
      </button>
    </div>
  );
}
