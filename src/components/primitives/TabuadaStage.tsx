import React from "react";
import { Quadrado100 } from "./Quadrado100";
import { NumberLine } from "./NumberLine";
import { ArranjoSpec, QuadroSpec, SaltosSpec, TabuadaSpec } from "../../curriculum/procedimentos/tabuadaContract";

/**
 * A tela de N4.03 — ficha F42.
 *
 * Compõe três partes que existem separadas de propósito: o enunciado simbólico,
 * o arranjo (a multiplicação como forma) e o quadro de 100 (o padrão como
 * regularidade). Cada nível liga e desliga as duas últimas de forma
 * independente, e é isso que faz o nível 4 ser realmente mais difícil que o 3.
 *
 * Nada aqui decide o que mostrar: a decisão veio do procedimento, pelo contrato.
 * O componente só apresenta.
 */

interface Props {
  spec: TabuadaSpec;
  onReplay?: () => void;
}

/** O arranjo retangular. Contar os quadradinhos é estratégia legítima no nível 1. */
function Arranjo({ arranjo }: { arranjo: ArranjoSpec }) {
  const lado = Math.min(28, Math.floor(280 / Math.max(arranjo.linhas, arranjo.colunas)));
  return (
    <div
      className="grid gap-1"
      role="img"
      aria-label={arranjo.descricao}
      style={{ gridTemplateColumns: `repeat(${arranjo.colunas}, ${lado}px)` }}
    >
      {Array.from({ length: arranjo.linhas * arranjo.colunas }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded bg-indigo-400"
          style={{ width: lado, height: lado }}
        />
      ))}
    </div>
  );
}

/**
 * O quadro com o padrão pintado.
 *
 * Recebe TODOS os múltiplos, nunca um só: vinte múltiplos de cinco mostram a
 * regularidade sem dizer qual deles é 5×4. O texto do padrão fica em
 * `aria-label` e não como legenda — a criança precisa perceber, não ler a
 * resposta pronta.
 */
function Quadro({ quadro }: { quadro: QuadroSpec }) {
  return (
    <div aria-label={`Quadro de cem com os múltiplos de ${quadro.tabuada} pintados`}>
      <Quadrado100 highlightedNumbers={quadro.multiplosPintados} />
    </div>
  );
}

/**
 * Os saltos na reta: a estratégia de contagem saltada do nível 1.
 *
 * Mostrar onde a contagem chega é o objetivo, não um vazamento: com andaime
 * alto, a criança aprende A ESTRATÉGIA, e é ela que sobrevive quando o apoio
 * sair no nível 2.
 */
function Saltos({ saltos }: { saltos: SaltosSpec }) {
  return (
    <div className="w-full" aria-label={saltos.descricao}>
      <NumberLine
        min={0}
        max={saltos.ate}
        step={saltos.passo}
        highlightedRanges={saltos.saltos.map(s => ({ start: s.de, end: s.para }))}
      />
    </div>
  );
}

export function TabuadaStage({ spec, onReplay }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <p className="text-4xl font-black text-slate-800" aria-label={spec.falado}>
          {spec.pergunta}
        </p>
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            aria-label="Ouvir a conta de novo"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-300 bg-indigo-50 text-2xl"
          >
            🔊
          </button>
        )}
      </div>

      {spec.arranjo && <Arranjo arranjo={spec.arranjo} />}
      {spec.saltos && <Saltos saltos={spec.saltos} />}
      {spec.quadro && <Quadro quadro={spec.quadro} />}
    </div>
  );
}
