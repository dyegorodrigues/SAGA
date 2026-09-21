import React from "react";
import { Icone } from "../icones/Icone";

/**
 * O botão de ouvir o enunciado de novo.
 *
 * ## Por que ele passou a existir
 *
 * A Jornada começa no 1º ano. **A criança de 1º ano não lê.** O enunciado é
 * falado uma vez quando a questão abre — e se ela se distrair, perder o
 * começo, ou simplesmente precisar de novo, não havia botão nenhum.
 *
 * Havia um caminho, e era invisível: tocar no balão de fala repetia a
 * narração. Mas o balão é uma `div` com `onClick` — sem `role`, sem nome para
 * leitor de tela, sem sombra, sem borda de botão, sem nada que diga "toque
 * aqui". Um adulto que leu o código sabe; uma criança de seis anos, não.
 *
 * O efeito prático: ela lê o que não sabe ler, ou chuta. Erra por
 * analfabetismo, não por matemática — e o app registra o erro como se fosse
 * matemático, sujando o Radar e o diagnóstico.
 *
 * ## O que este botão garante
 *
 * Alvo de 44px (piso WCAG, e o dedo de criança é maior que o de adulto), a
 * arte do alto-falante que ela já vê no resto do app, e um NOME — "Ouvir de
 * novo" — porque quem usa leitor de tela também precisa achar.
 *
 * Fica ao lado do enunciado, visível enquanto a questão está aberta. Some
 * depois de respondida: aí o que a tela mostra é o retorno, não a pergunta.
 */
export function OuvirDeNovo({ onOuvir, mudo }: { onOuvir: () => void; mudo?: boolean }) {
  return (
    <button
      type="button"
      onClick={onOuvir}
      aria-label="Ouvir de novo"
      title="Ouvir de novo"
      className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full border-2 border-slate-200 bg-white shadow-sm active:translate-y-0.5 transition-all"
      style={{ opacity: mudo ? 0.45 : 1 }}
    >
      <Icone nome={mudo ? "som-mudo" : "som"} tamanho={24} />
    </button>
  );
}
