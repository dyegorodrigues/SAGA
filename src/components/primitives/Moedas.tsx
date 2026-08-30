import React from "react";

/**
 * Primitiva `Moedas` — o dinheiro brasileiro como valor simbólico atribuído.
 *
 * ## Por que ela precisou existir
 *
 * Nenhuma primitiva do repositório servia: o dinheiro não é quantidade contínua
 * (`NumberLine`), nem agrupamento posicional (`MaterialDourado`), nem coleção
 * homogênea (`ScatteredItems`). É a primeira vez no currículo em que **o valor
 * não se lê no objeto** — é atribuído a ele.
 *
 * ## O tamanho não diz o valor, e a tela precisa provar isso
 *
 * O erro específico do dinheiro, que a F53 chama `VALOR_PELO_TAMANHO`, é julgar
 * a moeda pelo diâmetro. No dinheiro real a de 50 centavos é maior que a de 1
 * real em alguns anos de cunhagem, e a de 25 é maior que a de 10.
 *
 * Se desenhássemos todas do mesmo tamanho, o erro sumiria da tela — e com ele a
 * chance de diagnosticá-lo. Se desenhássemos com o tamanho proporcional ao
 * valor, a tela ENSINARIA o erro. Por isso os diâmetros aqui seguem a ordem do
 * dinheiro de verdade, que não é a ordem dos valores: a criança tem que ler o
 * número gravado.
 */
export interface MoedaDesenhada {
  /** Valor em centavos: 5, 10, 25, 50 ou 100. */
  centavos: number;
}

/**
 * Diâmetros relativos, na ordem do dinheiro real — que NÃO é a ordem dos
 * valores. A de 25 é maior que a de 50, e é justamente esse o ponto.
 */
const DIAMETRO: Record<number, number> = { 5: 56, 10: 48, 25: 62, 50: 58, 100: 66 };
const COR: Record<number, string> = {
  5: "bg-amber-600 border-amber-800 text-amber-50",
  10: "bg-amber-500 border-amber-700 text-amber-50",
  25: "bg-slate-300 border-slate-500 text-slate-900",
  50: "bg-slate-200 border-slate-400 text-slate-900",
  100: "bg-amber-300 border-slate-500 text-slate-900",
};

export const rotuloDaMoeda = (centavos: number): string =>
  centavos === 100 ? "1 real" : `${centavos} centavos`;

interface MoedaProps {
  centavos: number;
  destacada?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function Moeda({ centavos, destacada = false, onClick, disabled }: MoedaProps) {
  const tamanho = DIAMETRO[centavos] ?? 56;
  const conteudo = <span className="text-sm font-black leading-none">{centavos === 100 ? "R$1" : centavos}</span>;
  const classe = `flex items-center justify-center rounded-full border-4 ${COR[centavos] ?? COR[25]} ${destacada ? "ring-4 ring-sky-400" : ""}`;

  if (!onClick) {
    return <span role="img" aria-label={rotuloDaMoeda(centavos)} data-moeda={centavos}
      className={classe} style={{ width: tamanho, height: tamanho }}>{conteudo}</span>;
  }

  return <button type="button" aria-label={rotuloDaMoeda(centavos)} data-moeda={centavos}
    onClick={onClick} disabled={disabled}
    className={`${classe} disabled:opacity-40`} style={{ width: tamanho, height: tamanho }}>{conteudo}</button>;
}

interface MoedasProps {
  moedas: number[];
  /** Índices já contados, para o acúmulo por toque. */
  contadas?: number[];
  onTocar?: (indice: number) => void;
  disabled?: boolean;
}

export function Moedas({ moedas, contadas = [], onTocar, disabled }: MoedasProps) {
  return <div className="flex flex-wrap items-center justify-center gap-3" data-moedas={moedas.length}>
    {moedas.map((centavos, indice) => (
      <Moeda
        key={`${centavos}-${indice}`}
        centavos={centavos}
        destacada={contadas.includes(indice)}
        {...(onTocar ? { onClick: () => onTocar(indice), disabled } : {})}
      />
    ))}
  </div>;
}
