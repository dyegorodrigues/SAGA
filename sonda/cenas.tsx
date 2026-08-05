/**
 * As cenas que a sonda de layout mede.
 *
 * ---
 *
 * **Por que isto existe.** Três defeitos reais escaparam de 1074 testes:
 * o rótulo `MILHAR` impresso por cima da peça, a reta numérica rolando na
 * horizontal e o sapinho tapando o número que a pergunta manda ler. Todos são
 * de LAYOUT, e o jsdom — onde o Vitest roda — **não faz layout**: toda caixa
 * mede zero, então `render` + `getByText` acham qualquer coisa, inclusive o que
 * está escondido atrás de outra coisa.
 *
 * A sonda abre as cenas num Chromium de verdade, na largura do aparelho da
 * criança, e mede três coisas que só existem com layout:
 *
 * 1. **Vazamento horizontal** — conteúdo além dos 390px (Padrão Ouro §6.16)
 * 2. **Colisão de texto** — dois textos ocupando o mesmo pixel (§6.28)
 * 3. **Texto coberto** — o pixel do centro do texto pertence a outro elemento
 *
 * Cada cena aqui é um estado real de tela, não uma montagem inventada: vem do
 * gerador da competência, do mesmo jeito que a criança recebe.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { ALL_MATH_TRACKS } from "../src/curriculum/motores/curriculum";
import { GameLoopExerciseRenderer } from "../src/components/gameloop/GameLoopExerciseRenderer";
import { Composer } from "../src/curriculum/Composer";
import { N4_08 } from "../src/curriculum/fichas/jornada/N4.08";
import { DeslocamentoStage } from "../src/components/primitives/DeslocamentoStage";
import { AreaStage } from "../src/components/primitives/AreaStage";
import { N4_09 } from "../src/curriculum/fichas/jornada/N4.09";
import { N1_01 } from "../src/curriculum/fichas/jornada/N1.01";
import { PareamentoStage } from "../src/components/primitives/PareamentoStage";

/** A largura do aparelho da criança. Não é palpite: é o tablet do projeto. */
export const LARGURA_DO_APARELHO = 390;

interface Cena {
  nome: string;
  render: (semente: number) => React.ReactNode;
}

const nada = () => {};

/**
 * As sementes de sorteio que cada cena percorre.
 *
 * Os geradores sorteiam os números da questão. Sem semear, a sonda media uma
 * questão diferente a cada execução: um vazamento aparecia, sumia na seguinte e
 * voltava na terceira — uma sonda que muda de resposta não serve de portão. Com
 * semente fixa, "passou" quer dizer alguma coisa; com três, a cena é medida com
 * números pequenos e grandes, que é onde o material estoura a largura.
 */
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

/** Roda `f` com o sorteio preso a uma semente, e devolve o acaso depois. */
function comSemente<T>(semente: number, f: () => T): T {
  const original = Math.random;
  let s = semente >>> 0;
  Math.random = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  try {
    return f();
  } finally {
    Math.random = original;
  }
}

/** Uma questão do gerador da competência, no nível pedido. */
function questaoDe(id: string, lvl: number, semente: number) {
  const track: any = (ALL_MATH_TRACKS as any[]).find(t => t.id === id);
  if (!track) throw new Error(`competência ${id} não existe no currículo`);
  return { track, q: comSemente(semente, () => track.gen(lvl)) };
}

function Exercicio({ id, lvl, semente }: { id: string; lvl: number; semente: number }) {
  const { track, q } = questaoDe(id, lvl, semente);
  return (
    <>
      {q.prompt && <p className="px-3 py-2 text-center text-xl font-black text-slate-800">{q.prompt}</p>}
      <GameLoopExerciseRenderer
        q={q} status={null} idx={0} handlePick={nada} timeLeft={30} promptDone
        guidedIdx={null} mockTutorialN={null} tutShow={null} journeyDone={false}
        flashHidden={false} sel={null} totalQFor={() => 10} track={track}
        aulaSuggest={false} guidedNarr={null} playAulinha={nada}
        setShowClockTutorial={nada} sound={false} peekAgain={nada} setJourneyDone={nada}
        orderTaps={[]} handleOrderTap={nada} orderShake={null} hiddenOpts={[]}
        armedOpt={null} setArmedOpt={nada}
      />
    </>
  );
}

/**
 * O catálogo. Cresce a cada competência construída — uma cena por estado que
 * vale olhar, não uma por competência.
 */
export const CENAS: Cena[] = [
  // N1.01 pelo `track.gen`: é a tela em ROLLBACK — a ficha congelada de
  // draggroup que a produção serve enquanto o pareamento não é ativado. Medir
  // o alvo de rollback importa: uma tela de emergência quebrada não socorre.
  { nome: "N1.01 rollback: draggroup congelado (nível 1)", render: (s) => <Exercicio id="N1.01" lvl={1} semente={s} /> },

  // N1.01 pela ficha, nos cinco níveis. Implementada e NÃO ativada: `track.gen`
  // devolveria o congelado, então o palco é renderizado direto — a tela nova é
  // medida ANTES de chegar à criança, que é o motivo de a sonda existir.
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: `N1.01 pareamento (nível ${lvl})`,
    render: (s: number) => (
      <PareamentoStage spec={comSemente(s, () => Composer.generate(N1_01, lvl)).uiProps as never} />
    ),
  })),
  {
    nome: "N1.01 micro-aula: a Mão Fantasma",
    render: (s: number) => (
      <PareamentoStage
        spec={comSemente(s, () => Composer.generate(N1_01, 1)).uiProps as never}
        mostrar={{ destacarFileira: "receptores", maoFantasma: true }}
      />
    ),
  },
  { nome: "N1.03 comparar (nível 2)", render: (s) => <Exercicio id="N1.03" lvl={2} semente={s} /> },
  { nome: "N1.07 numeral na reta (nível 2)", render: (s) => <Exercicio id="N1.07" lvl={2} semente={s} /> },
  { nome: "N3.01 primeira soma (nível 2)", render: (s) => <Exercicio id="N3.01" lvl={2} semente={s} /> },
  { nome: "N3.03 amigos do dez (nível 2)", render: (s) => <Exercicio id="N3.03" lvl={2} semente={s} /> },
  { nome: "N3.09 problema armado (nível 2)", render: (s) => <Exercicio id="N3.09" lvl={2} semente={s} /> },
  { nome: "N3.10 problemas aditivos (nível 3)", render: (s) => <Exercicio id="N3.10" lvl={3} semente={s} /> },
  { nome: "N4.03 tabuada (nível 1)", render: (s) => <Exercicio id="N4.03" lvl={1} semente={s} /> },
  { nome: "N4.04 decomposição (nível 2)", render: (s) => <Exercicio id="N4.04" lvl={2} semente={s} /> },
  { nome: "N4.06 família ×÷ (nível 2)", render: (s) => <Exercicio id="N4.06" lvl={2} semente={s} /> },
  { nome: "N4.07 âncora (nível 2)", render: (s) => <Exercicio id="N4.07" lvl={2} semente={s} /> },
  { nome: "N4.08 deslocamento (nível 1)", render: (s) => <Exercicio id="N4.08" lvl={1} semente={s} /> },
  {
    nome: "N4.08 micro-aula ×10",
    render: () => <DeslocamentoStage spec={Composer.generate(N4_08, 1).uiProps as never} mostrar={{ promoverOrdens: true }} />,
  },
  // N4.09 ainda não é canário: a cena renderiza o palco direto, com a ficha,
  // porque `track.gen` devolveria o legado. Assim a sonda mede a tela nova
  // ANTES de ela chegar à criança.
  ...[1, 3, 4, 5].map(lvl => ({
    nome: `N4.09 modelo de área (nível ${lvl})`,
    render: (s: number) => (
      <AreaStage spec={comSemente(s, () => Composer.generate(N4_09, lvl)).uiProps as never} />
    ),
  })),
  {
    nome: "N4.09 micro-aula: o corte",
    render: (s: number) => (
      <AreaStage
        spec={comSemente(s, () => Composer.generate(N4_09, 1)).uiProps as never}
        mostrar={{ cortarRetangulo: true, destacarRegiao: 0 }}
      />
    ),
  },
  {
    nome: "N4.08 micro-aula ×100",
    render: () => <DeslocamentoStage spec={Composer.generate(N4_08, 2).uiProps as never} mostrar={{ promoverOrdens: true }} />,
  },
];

/** Cada cena vira uma tomada por semente: é isso que a sonda percorre. */
const TOMADAS = CENAS.flatMap(cena =>
  SEMENTES.map(semente => ({ cena, semente, nome: `${cena.nome} [semente ${semente}]` })));

function Palco({ cena, semente }: { cena: Cena; semente: number }) {
  return (
    <section
      data-cena={cena.nome}
      style={{ width: LARGURA_DO_APARELHO, background: "#fff", overflow: "visible" }}
    >
      {cena.render(semente)}
    </section>
  );
}

function App() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    (window as any).sonda = {
      total: TOMADAS.length,
      // O índice pode ficar para trás por um instante se o vite recarregar a
      // página no meio da corrida — foi o que aconteceu quando editei um
      // componente com a sonda rodando, e a corrida inteira morreu na tomada 45.
      nome: () => TOMADAS[Math.min(i, TOMADAS.length - 1)]?.nome ?? "(cena perdida no recarregamento)",
      ir: (n: number) => setI(n),
    };
  }, [i]);
  const t = TOMADAS[i];
  return <Palco key={i} cena={t.cena} semente={t.semente} />;
}

createRoot(document.getElementById("root")!).render(<App />);
