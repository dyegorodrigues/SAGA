import React from "react";
import { Cor, Forma, Peca, Tamanho } from "../../curriculum/procedimentos/classificacaoProcedure";

/**
 * A peça da ficha F51: **forma, cor e tamanho, independentes**.
 *
 * ---
 *
 * ### Por que desenhada, e não emoji
 *
 * A §3 diz *"objetos variados — diferem em forma, cor e tamanho"*, e a
 * competência é justamente **agrupar as mesmas peças por atributos
 * diferentes**. Isso exige que os três variem livremente: um círculo vermelho
 * grande e um círculo vermelho pequeno precisam ser a mesma forma e a mesma
 * cor, diferindo só no tamanho.
 *
 * Emoji não faz isso. 🔴 e 🟥 são cores e formas coladas; não existe "🔴
 * pequeno" como glifo distinto, e o tamanho da fonte muda tudo junto. Com
 * emoji, o nível 3 — reclassificar as MESMAS peças por outro critério — não
 * teria como existir.
 *
 * ### O rótulo nomeia os três atributos
 *
 * *"círculo vermelho grande"*. Aqui, ao contrário do relance, **contar não é a
 * pergunta**: a criança precisa dos atributos para decidir, e escondê-los de
 * quem ouve a tela tiraria a única informação que o exercício usa. O que o
 * rótulo nunca diz é **onde a peça deve ir** — isso é a resposta.
 *
 * ### A cor nunca decide sozinha
 *
 * §10: forma e tamanho carregam informação junto com a cor, e o rótulo carrega
 * as três. Uma criança que não distingue vermelho de verde continua com dois
 * canais — e num exercício cujo critério às vezes É a cor, isso não é detalhe.
 */

interface Props {
  peca: Peca;
  /** Marcada como escolhida, esperando o destino. */
  selecionada?: boolean;
  /** §4: a peça brilha ao entrar no laço — e ao ficar corretamente fora. */
  brilhando?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

/** O lado do desenho. Grande e pequeno precisam ser óbvios de longe. */
const LADO: Record<Tamanho, number> = { grande: 42, pequeno: 26 };

/**
 * As cores.
 *
 * Escolhidas com contraste suficiente contra o branco do palco E entre si —
 * `#EAB308` é o amarelo mais escuro que ainda lê como amarelo para uma criança;
 * o amarelo puro sobre branco some (§6.30).
 */
const TINTA: Record<Cor, string> = {
  vermelho: "#DC2626",
  azul: "#2563EB",
  amarelo: "#EAB308",
};

const NOME_DA_FORMA: Record<Forma, string> = {
  circulo: "círculo",
  quadrado: "quadrado",
  triangulo: "triângulo",
};

/** O nome da peça, com a concordância certa: "círculo vermelho grande". */
export function nomeDaPeca(p: Peca): string {
  const cor = p.cor === "azul" ? "azul" : p.cor;
  return `${NOME_DA_FORMA[p.forma]} ${cor} ${p.tamanho}`;
}

export function PecaDeAtributo({ peca, selecionada, brilhando, onClick, disabled }: Props) {
  const lado = LADO[peca.tamanho];
  const cor = TINTA[peca.cor];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={nomeDaPeca(peca)}
      aria-pressed={selecionada}
      // A área de toque é sempre 48px, mesmo para a peça pequena: §8.3-bis
      // manda alvo ≥ 80px onde há arrasto, e aqui não há arrasto — mas dedo de
      // criança de 4 anos não acerta 26px, e errar o alvo viraria erro dela.
      className="flex items-center justify-center rounded-xl transition-all"
      style={{
        width: 52,
        height: 52,
        background: selecionada ? "#EEF2FF" : "transparent",
        outline: selecionada ? "3px solid #4F46E5" : brilhando ? "3px solid #16A34A" : "none",
        outlineOffset: -2,
      }}
    >
      <svg width={lado} height={lado} viewBox="0 0 40 40" aria-hidden>
        {peca.forma === "circulo" && (
          <circle cx={20} cy={20} r={17} fill={cor} stroke="#1E293B" strokeWidth={2.5} />
        )}
        {peca.forma === "quadrado" && (
          <rect x={4} y={4} width={32} height={32} rx={4} fill={cor} stroke="#1E293B" strokeWidth={2.5} />
        )}
        {peca.forma === "triangulo" && (
          <polygon points="20,3 37,36 3,36" fill={cor} stroke="#1E293B" strokeWidth={2.5} strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
