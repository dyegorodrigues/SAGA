import React from "react";

/**
 * Arranjo retangular: a multiplicação vista como forma.
 *
 * Vive sozinho porque duas competências o usam com propósitos diferentes — em
 * N4.03 ele mostra a multiplicação inteira; em N4.04 mostra só a âncora do
 * dobro, que depois se duplica. Um componente por responsabilidade, e a
 * responsabilidade aqui é desenhar linhas × colunas.
 *
 * O rótulo descreve a FORMA ("7 fileiras de 2"), nunca o total. Anunciar "14
 * quadradinhos" entregaria a resposta a quem usa leitor de tela — e a criança
 * não-leitora ouve exatamente esse rótulo.
 */

interface Props {
  linhas: number;
  colunas: number;
  descricao: string;
  /** Largura máxima disponível, em px. */
  larguraMax?: number;
}

export function Arranjo({ linhas, colunas, descricao, larguraMax = 280 }: Props) {
  const lado = Math.min(28, Math.floor(larguraMax / Math.max(linhas, colunas)));
  return (
    <div
      className="grid gap-1"
      role="img"
      aria-label={descricao}
      style={{ gridTemplateColumns: `repeat(${colunas}, ${lado}px)` }}
    >
      {Array.from({ length: linhas * colunas }, (_, i) => (
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
