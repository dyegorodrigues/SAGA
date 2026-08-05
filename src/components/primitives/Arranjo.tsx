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
  /**
   * Colunas marcadas como "a que sai", contadas a partir do fim.
   *
   * Serve o ×9 da ficha F44: mostra-se o arranjo do fato fácil (7×10) com a
   * última coluna destacada — é ela que será removida para virar 7×9. Sem o
   * destaque, exibir um arranjo de 70 quadradinhos numa pergunta de 7×9 confunde
   * em vez de ajudar.
   */
  colunasQueSaem?: number;
  /**
   * Lado do quadradinho, imposto de fora.
   *
   * Existe por causa do modelo de área (N4.09): lá, quatro arranjos vizinhos
   * formam **um** retângulo partido. Cada um calculando o próprio lado a partir
   * da largura disponível fazia as regiões saírem com células de tamanhos
   * diferentes — as bordas não encostavam, e o desenho deixava de ser um
   * retângulo para virar quatro grades soltas. Ver Padrão Ouro §6.33.
   *
   * Quem usa um arranjo sozinho continua sem passar nada.
   */
  lado?: number;
}

export function Arranjo({ linhas, colunas, descricao, larguraMax = 280, colunasQueSaem = 0, lado: ladoImposto }: Props) {
  const lado = ladoImposto ?? Math.min(28, Math.floor(larguraMax / Math.max(linhas, colunas)));
  return (
    <div
      className="grid gap-1"
      role="img"
      aria-label={descricao}
      style={{ gridTemplateColumns: `repeat(${colunas}, ${lado}px)` }}
    >
      {Array.from({ length: linhas * colunas }, (_, i) => {
        const sai = colunasQueSaem > 0 && (i % colunas) >= colunas - colunasQueSaem;
        return (
          <div
            key={i}
            aria-hidden="true"
            className={sai ? "rounded bg-rose-300 opacity-60" : "rounded bg-indigo-400"}
            style={{ width: lado, height: lado }}
          />
        );
      })}
    </div>
  );
}
