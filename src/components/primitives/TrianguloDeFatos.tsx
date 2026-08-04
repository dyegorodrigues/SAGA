import React from "react";
import { INVERSA, OPERACAO, Operacao } from "../../styles/coresDeOperacao";

/**
 * O triângulo da família de fatos — usado pela família ADITIVA (F16, N3.05) e
 * pela MULTIPLICATIVA (F96, N4.06).
 *
 * ---
 *
 * **Por que a mesma figura, e por que ela precisa dizer a operação.**
 *
 * O cânone reusa o triângulo de propósito: a mesma forma gera quatro contas, e
 * reconhecê-la do "amigos do dez" é justamente a transferência que se quer.
 *
 * Só que transferência sem sinal vira interferência. Uma criança que passou um
 * ano somando as duas bolinhas de baixo olha a figura e **soma** — porque é isso
 * que a forma significou para ela até ontem. A mesma figura com semântica
 * diferente e nenhuma marca não é analogia: é ambiguidade.
 *
 * A solução é fazer a figura **declarar a própria operação**: o sinal grande
 * entre as duas bases diz como elas se combinam, e o sinal nas pernas diz o que
 * acontece ao descer do topo. Aí a criança reconhece a forma E vê o que mudou —
 * *"é igual ao dos amigos do dez, mas aqui é vezes"* — que é exatamente o
 * pensamento que se quer provocar.
 */

export type TipoDeFamilia = "aditiva" | "multiplicativa";

/**
 * A operação que combina as bases, por família. A que desce pelas pernas é a
 * inversa dela — e as cores vêm do padrão do aplicativo, não de escolha local:
 * a criança encontra o mesmo verde de somar e o mesmo roxo de multiplicar em
 * toda tela do SAGA.
 */
const COMBINA: Record<TipoDeFamilia, Operacao> = {
  aditiva: "adicao",
  multiplicativa: "multiplicacao",
};

interface Props {
  topo: number | "?";
  esquerda: number | "?";
  direita: number | "?";
  tipo: TipoDeFamilia;
}

function Circulo({ valor, cor, tamanho }: { valor: number | "?"; cor: string; tamanho: number }) {
  const vazio = valor === "?";
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center rounded-full font-black"
      style={{
        width: tamanho, height: tamanho,
        fontSize: tamanho * 0.42,
        border: `4px solid ${cor}`,
        background: vazio ? "#f8fafc" : "#fff",
        color: vazio ? "#94a3b8" : "#1e293b",
        borderStyle: vazio ? "dashed" : "solid",
      }}
    >
      {valor}
    </div>
  );
}

export function TrianguloDeFatos({ topo, esquerda, direita, tipo }: Props) {
  const operacao = COMBINA[tipo];
  const { simbolo: combina, cor, verbo: nome } = OPERACAO[operacao];
  const { simbolo: desce } = OPERACAO[INVERSA[operacao]];
  return (
    <div
      role="img"
      aria-label={`Triângulo da família: os dois de baixo ${nome} dão o de cima`}
      className="flex flex-col items-center"
      style={{ width: 240 }}
    >
      <Circulo valor={topo} cor={cor} tamanho={72} />

      {/* As pernas, com o sinal da operação inversa: descer do topo é desfazer. */}
      <div className="relative flex w-full items-center justify-center" style={{ height: 44 }}>
        <svg width="240" height="44" aria-hidden="true" style={{ position: "absolute" }}>
          <line x1="104" y1="2" x2="46" y2="42" stroke={cor} strokeWidth="4" strokeLinecap="round" />
          <line x1="136" y1="2" x2="194" y2="42" stroke={cor} strokeWidth="4" strokeLinecap="round" />
        </svg>
        <span aria-hidden="true" className="absolute font-black" style={{ left: 44, fontSize: 20, color: cor }}>{desce}</span>
        <span aria-hidden="true" className="absolute font-black" style={{ right: 44, fontSize: 20, color: cor }}>{desce}</span>
      </div>

      {/* A base, com o sinal GRANDE que diz como as duas se combinam. */}
      <div className="flex w-full items-center justify-center" style={{ gap: 8 }}>
        <Circulo valor={esquerda} cor={cor} tamanho={64} />
        <span aria-hidden="true" className="font-black" style={{ fontSize: 34, color: cor }}>{combina}</span>
        <Circulo valor={direita} cor={cor} tamanho={64} />
      </div>
    </div>
  );
}
