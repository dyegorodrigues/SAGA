import React from "react";
import { Quadrado100 } from "./Quadrado100";
import { Arranjo } from "./Arranjo";
import { NumberLine } from "./NumberLine";
import { PalcoEscalado } from "./PalcoEscalado";
import { QuadroSpec, SaltosSpec, TabuadaSpec } from "../../curriculum/procedimentos/tabuadaContract";

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

/**
 * Largura útil para a reta, em px.
 *
 * Não é simplesmente 390 menos margens: os rótulos dos números são posicionados
 * de forma absoluta sobre traços de 4px e **transbordam para os lados**. O
 * primeiro e o último rótulo avançam meia largura para fora da reta, cerca de
 * 26px no total. Medido no navegador, não estimado.
 */
export const LARGURA_UTIL = 300;

/** Cores dos saltos, alternadas para que a criança conte HOPS, não um trecho. */
export const COR_DO_SALTO_PAR = "#f59e0b";
export const COR_DO_SALTO_IMPAR = "#6366f1";

/**
 * Quanto cada ponto da reta pode ocupar para a reta inteira caber.
 *
 * Exportada para ser testável: jsdom não calcula layout, então a única forma de
 * travar "não rola na horizontal" num teste unitário é verificar a conta que
 * decide a largura.
 */
export function larguraPorPontoDaReta(quantidadeDeSaltos: number): number {
  // O piso é 24: abaixo disso nem o rótulo encolhido cabe. A reta desta ficha
  // nunca chega lá — o pior caso são 11 pontos, que dão 27px.
  return Math.max(24, Math.floor(LARGURA_UTIL / (quantidadeDeSaltos + 1)));
}

interface Props {
  spec: TabuadaSpec;
  onReplay?: () => void;
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
    // `role="group"`: `aria-label` em div sem papel é atributo ARIA proibido. Aqui
    // o axe não acusa porque há conteúdo acessível dentro, mas a construção é a
    // mesma que falhou em DecomposicaoStage — não vale depender desse detalhe.
    <div role="group" aria-label={`Quadro de cem com os múltiplos de ${quadro.tabuada} pintados`}>
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
  // A reta precisa CABER: rolando na horizontal, ela esconde o fim da contagem,
  // que é exatamente a estratégia do nível 1. Ver Padrão Ouro §6.16.
  const larguraPorPonto = larguraPorPontoDaReta(saltos.saltos.length);
  return (
    <div role="group" className="w-full" aria-label={saltos.descricao}>
      <NumberLine
        min={0}
        max={saltos.ate}
        step={saltos.passo}
        larguraPorPonto={larguraPorPonto}
        // Cores alternadas porque os saltos são adjacentes: pintados de uma cor
        // só, os cinco saltos de dez viram UMA barra contínua de 0 a 50 — e a
        // estratégia que o nível existe para ensinar fica invisível. Ver Padrão
        // Ouro §6.17.
        highlightedRanges={saltos.saltos.map((s, i) => ({
          start: s.de,
          end: s.para,
          color: i % 2 === 0 ? COR_DO_SALTO_PAR : COR_DO_SALTO_IMPAR,
        }))}
      />
    </div>
  );
}

export function TabuadaStage({ spec, onReplay }: Props) {
  return (
    <PalcoEscalado>
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

      {spec.arranjo && <Arranjo {...spec.arranjo} />}
      {spec.saltos && <Saltos saltos={spec.saltos} />}
      {spec.quadro && <Quadro quadro={spec.quadro} />}
    </div>
    </PalcoEscalado>
  );
}
