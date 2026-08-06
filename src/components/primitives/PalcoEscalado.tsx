import React from "react";

/**
 * `PalcoEscalado` — o desenho de tamanho fixo, em qualquer tela.
 *
 * ---
 *
 * ### O problema, e por que ele passou por baixo de tudo
 *
 * Vários palcos são desenhados em **pixels fixos** — 326 de largura —, e isso
 * não é preguiça: a geometria deles É a resposta. No `TouchPlace` a colisão
 * entre vagas tem de ser resolvida por construção (§6.29); na cena da F47 um
 * objeto 4px acima da linha errada não é feiura, é a questão trocada. Percentual
 * sobre campo não-quadrado distorce o eixo vertical, e foi assim que o arranjo
 * disperso da F01 saiu errado.
 *
 * Só que o app roda em qualquer tela. A tela de jogo é `max-w-3xl` (768px) com
 * `px-4`, e o cartão do exercício tem mais 14px de cada lado:
 *
 * | aparelho | largura útil do palco | desenho de 326 |
 * |---|---|---|
 * | celular pequeno (320) | 260px | **vaza 66px** — rolagem horizontal (§6.16) |
 * | aparelho do projeto (390) | 330px | cabe |
 * | tablet / desktop | até 708px | ilha de 326 no meio de 708 |
 *
 * E a sonda media **um único viewport, 390** — exatamente a largura em que o
 * defeito não existe. O instrumento tinha o mesmo furo que o código.
 *
 * ### A solução, e por que ela não mexe em geometria nenhuma
 *
 * Escala **uniforme**. Uma semelhança preserva toda razão entre medidas: o que
 * estava acima continua acima, o que não colidia continua sem colidir, o raio de
 * encaixe continua proporcional ao objeto. Nenhum contrato muda.
 *
 * E a conta de ponteiro dos palcos já é por razão —
 * `(clientX - r.left) / r.width * LARGURA` —, onde `r.width` é a largura
 * **renderizada**. Ela atravessa a escala sem uma linha de ajuste.
 *
 * ### O teto tem duas fontes, e a altura é a que morde
 *
 * Crescer só pela largura quebraria o celular deitado: a tela de jogo é
 * `h-[100dvh] overflow-hidden`, então um palco alto demais empurra a bandeja
 * para fora sem barulho nenhum. O fator é o **menor** entre o que a largura
 * permite e o que a altura permite.
 *
 * Não há piso: numa tela estreitíssima o desenho encolhe até caber. Encolher é
 * ruim; vazar é pior — vazar esconde metade da cena atrás da borda.
 */

/** Quanto da altura da janela um palco pode ocupar. O resto é enunciado, barra, mascote. */
const FATIA_DA_ALTURA = 0.62;

/**
 * O teto de ampliação.
 *
 * Num tablet o palco poderia crescer 2,17×. Não cresce: 1,5 já dobra a área de
 * toque e mantém o desenho com a mesma proporção de tela que a criança do
 * aparelho do projeto vê. Acima disso o emoji vira pôster e a cena perde a
 * unidade que a §6.33 pede.
 */
const TETO = 1.5;

export function PalcoEscalado({ children }: { children: React.ReactNode }) {
  const fora = React.useRef<HTMLDivElement>(null);
  const dentro = React.useRef<HTMLDivElement>(null);
  const [k, setK] = React.useState(1);
  const [altura, setAltura] = React.useState<number | undefined>(undefined);
  /** A margem que centraliza o desenho JÁ escalado. Ver o comentário do render. */
  const [recuo, setRecuo] = React.useState(0);

  React.useLayoutEffect(() => {
    function medir() {
      const caixa = fora.current;
      const desenho = dentro.current;
      if (!caixa || !desenho) return;

      // `offsetWidth` é a medida de LAYOUT: não muda com `transform`. É o que
      // permite medir o desenho no tamanho natural enquanto ele já está escalado.
      const natural = desenho.offsetWidth;
      const naturalAltura = desenho.offsetHeight;
      const disponivel = caixa.clientWidth;

      // Sem layout — jsdom, ou o primeiro quadro — não há o que decidir.
      // Chutar aqui produziria uma escala errada que ninguém veria.
      if (!natural || !disponivel) return;

      const janela = typeof window !== "undefined" ? window.innerHeight : 0;
      const porLargura = disponivel / natural;
      const porAltura = janela && naturalAltura
        ? (janela * FATIA_DA_ALTURA) / naturalAltura
        : Infinity;

      const fator = Math.min(porLargura, porAltura, TETO);
      setK(fator);
      setRecuo(Math.max(0, (disponivel - natural * fator) / 2));
      // A caixa de fora reserva o espaço JÁ escalado. Sem isso o `transform`
      // não afeta o fluxo e o que vem depois do palco sobe por cima dele.
      setAltura(naturalAltura ? naturalAltura * fator : undefined);
    }

    medir();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", medir);
      return () => window.removeEventListener("resize", medir);
    }
    const observador = new ResizeObserver(medir);
    if (fora.current) observador.observe(fora.current);
    if (dentro.current) observador.observe(dentro.current);
    window.addEventListener("resize", medir);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);

  return (
    <div ref={fora} className="w-full" style={{ height: altura }}>
      <div
        ref={dentro}
        style={{
          transform: k === 1 ? undefined : `scale(${k})`,
          /**
           * ⚠️ `top left`, e a margem centraliza — não `top center` com
           * `mx-auto`.
           *
           * `transform` não muda a caixa de LAYOUT: ela continua com a largura
           * de projeto. Com um desenho de 390 dentro de uma caixa de 288, as
           * margens `auto` viram zero (elas não ficam negativas), a caixa
           * começa na borda e o centro dela cai 51px à direita do centro real.
           * Escalando em torno desse centro, o desenho saía de 67 a 355 numa
           * tela de 320 — encolhido e ainda assim vazando. Foi a sonda a 320px
           * que mostrou, no primeiro dia em que ela mediu mais de uma largura.
           *
           * Com origem no canto, o desenho ocupa `[0, natural×k]`, e a margem
           * esquerda faz a centralização com a largura que ele tem DEPOIS de
           * escalado. Nunca negativa, porque `natural×k ≤ disponível`.
           */
          transformOrigin: "top left",
          marginLeft: recuo,
          width: "fit-content",
        }}
      >
        {children}
      </div>
    </div>
  );
}
