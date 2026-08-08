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
import { FichaCompetencia } from "../src/curriculum/schema";
import { N1_02 } from "../src/curriculum/fichas/jornada/N1.02";
import { N1_04 } from "../src/curriculum/fichas/jornada/N1.04";
import { GameLoopExerciseRenderer } from "../src/components/gameloop/GameLoopExerciseRenderer";
import { Composer } from "../src/curriculum/Composer";
import { N4_08 } from "../src/curriculum/fichas/jornada/N4.08";
import { DeslocamentoStage } from "../src/components/primitives/DeslocamentoStage";
import { AreaStage } from "../src/components/primitives/AreaStage";
import { N4_09 } from "../src/curriculum/fichas/jornada/N4.09";
import { N1_01 } from "../src/curriculum/fichas/jornada/N1.01";
import { N1_03 } from "../src/curriculum/fichas/jornada/N1.03";
import { N1_08 } from "../src/curriculum/fichas/jornada/N1.08";
import { AL_02 } from "../src/curriculum/fichas/jornada/AL.02";
import { AL_01 } from "../src/curriculum/fichas/jornada/AL.01";
import { N1_06 } from "../src/curriculum/fichas/jornada/N1.06";
import { N1_13 } from "../src/curriculum/fichas/jornada/N1.13";
import { GE_01 } from "../src/curriculum/fichas/jornada/GE.01";
import { GE_02 } from "../src/curriculum/fichas/jornada/GE.02";
import { GM_01 } from "../src/curriculum/fichas/jornada/GM.01";
import { GM_12 } from "../src/curriculum/fichas/jornada/GM.12";
import { N1_10 } from "../src/curriculum/fichas/jornada/N1.10";
import { N1_11 } from "../src/curriculum/fichas/jornada/N1.11";
import { JD3, JD5 } from "../src/curriculum/fichas/dojo/jardim";
import { Fase } from "../src/components/primitives/EmojiRowStage";
import { FaseDaMoldura } from "../src/components/primitives/MolduraStage";
import { DojoTab } from "../src/components/home/DojoTab";

/**
 * A largura do aparelho da criança.
 *
 * ⚠️ Era **fixa em 390** — e por isso a sonda mediu, durante todo este bloco,
 * exatamente a largura em que as cenas cabem. Medir com o viewport em 320
 * acusava vazamento em TODAS elas, e o culpado era este `<section>`: o andaime
 * continuava com 390px enquanto o aparelho tinha 320. A sonda estava medindo a
 * própria régua.
 *
 * Agora ela segue o viewport, como o app segue (`max-w-3xl` na tela de jogo,
 * `px-4` de respiro). 390 continua sendo o padrão quando não há viewport.
 */
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
const TODAS_AS_SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

/**
 * As sementes desta execução.
 *
 * O PORTÃO usa as oito. O LAÇO DE TRABALHO usa uma — `?sementes=1` na URL.
 *
 * A diferença não é cosmética: oito sementes × 54 cenas × 1,5s de espera são
 * onze minutos, e onze minutos por conserto transforma o instrumento de medida
 * em gargalo. Foi o que aconteceu construindo esta escada: eu tinha nove
 * defeitos na mão e rodei o portão inteiro três vezes, que é exatamente o erro
 * já registrado na RETOMADA §7.3 e que eu repeti com outro nome.
 */
const SEMENTES = (() => {
  const pedido = new URLSearchParams(location.search).get("sementes");
  if (!pedido) return TODAS_AS_SEMENTES;
  const n = Number(pedido);
  return Number.isFinite(n) && n > 0 ? TODAS_AS_SEMENTES.slice(0, n) : TODAS_AS_SEMENTES;
})();

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
 * O mesmo exercício do app, mas montado a partir da FICHA.
 *
 * `Exercicio` usa `track.gen`, que respeita o canário — então uma ficha
 * implementada e ainda não ativada apareceria como o legado. Este monta a
 * questão direto da ficha e a entrega ao **renderizador real do app**, com o
 * cartão, a margem e a tipografia que a criança vê.
 *
 * Renderizar só o palco, como eu vinha fazendo, mede o layout do palco e esconde
 * o enquadramento: dá para aprovar uma tela que, dentro do cartão, não cabe.
 */
function ExercicioDaFicha({ ficha, lvl, semente, mostrar, fase }: {
  ficha: FichaCompetencia; lvl: number; semente: number; mostrar?: unknown;
  fase?: Fase | FaseDaMoldura;
}) {
  const q = React.useMemo(
    () => comSemente(semente, () => Composer.generate(ficha, lvl)),
    [ficha, lvl, semente],
  );
  const [audioPromptVisible, setAudioPromptVisible] = React.useState(false);
  React.useEffect(() => setAudioPromptVisible(false), [ficha.id, lvl, semente]);
  return (
    <>
      {/* A caixa do enunciado que o app desenha ACIMA do palco (GameLoop.tsx).
          Ela faltava aqui, e a falta escondeu o enunciado saindo DUAS vezes em
          todo palco que imprimia o próprio: o palco só, sem o enquadramento do
          app, é o print errado da RETOMADA §7.4. */}
      {q.prompt && (q.kind !== "audiochoice" || audioPromptVisible) && (
        <div className="mx-3 mb-2 rounded-2xl border-3 px-3.5 py-2.5 text-center text-[17px] font-bold"
          style={{ borderColor: "#D9E5F8", color: "#22315C", background: "#fff", borderWidth: 3 }}>
          {q.prompt}
        </div>
      )}
    <GameLoopExerciseRenderer
      q={q} status={null} idx={0} handlePick={nada} timeLeft={30} promptDone
      guidedIdx={null} mockTutorialN={null} tutShow={(mostrar ?? null) as never}
      journeyDone={false}
      flashHidden={false} sel={null} totalQFor={() => 10} track={{ id: ficha.id } as never}
      aulaSuggest={false} guidedNarr={null} playAulinha={nada}
      setShowClockTutorial={nada} sound={false} peekAgain={nada} setJourneyDone={nada}
      orderTaps={[]} handleOrderTap={nada} orderShake={null} hiddenOpts={[]}
      armedOpt={null} setArmedOpt={nada}
      faseDaCena={fase}
      onFirstAuditionComplete={() => setAudioPromptVisible(true)}
    />
    </>
  );
}


function progressoP8(lvl: number, maxLvl = lvl) {
  return {
    lvl, maxLvl, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0,
  };
}

function JardimProbe({ modo }: { modo: "locked" | "partial" | "advanced" }) {
  const prog = modo === "locked" ? {} : modo === "partial" ? {
    "N1.03": progressoP8(1, 3),
    "N1.08": progressoP8(3, 3),
    "N1.11": progressoP8(2, 2),
    "N1.10": progressoP8(2, 2),
  } : {
    "N1.03": progressoP8(3, 5),
    "N1.08": progressoP8(4, 5),
    "N1.11": progressoP8(3, 3),
    "N1.10": progressoP8(3, 4),
  };

  const dojoTracks = modo === "locked" ? {} : modo === "partial" ? {
    JD1: {
      unlocked: true, mastered: false, family: "JD", currentStep: 2, highestStep: 3,
      goodRounds: 1, weakRounds: 0, rounds: 3, attempts: 24, correct: 20,
    },
    JD2: {
      unlocked: true, mastered: false, family: "JD", currentStep: 1, highestStep: 1,
      goodRounds: 0, weakRounds: 0, rounds: 1, attempts: 8, correct: 6,
    },
  } : {
    JD1: {
      unlocked: true, mastered: true, family: "JD", currentStep: 4, highestStep: 5,
      goodRounds: 0, weakRounds: 1, rounds: 12, attempts: 96, correct: 87,
    },
    JD2: {
      unlocked: true, mastered: false, family: "JD", currentStep: 3, highestStep: 4,
      goodRounds: 1, weakRounds: 0, rounds: 7, attempts: 56, correct: 48,
    },
    JD3: {
      unlocked: true, mastered: false, family: "JD", currentStep: 2, highestStep: 2,
      goodRounds: 0, weakRounds: 0, rounds: 4, attempts: 32, correct: 26,
    },
    JD5: {
      unlocked: true, mastered: true, family: "JD", currentStep: 3, highestStep: 5,
      goodRounds: 0, weakRounds: 0, rounds: 10, attempts: 80, correct: 70,
    },
  };

  return (
    <div className="p-3" style={{ background: "#F8FAFC" }}>
      <DojoTab
        prog={prog as never}
        dojoTracks={dojoTracks as never}
        onGardenTrack={nada}
        onMixed={nada}
        onOpenPicker={nada}
      />
    </div>
  );
}

/**
 * O catálogo. Cresce a cada competência construída — uma cena por estado que
 * vale olhar, não uma por competência.
 */
export const CENAS: Cena[] = [
  {
    nome: "P8 Jardim home — todas as trilhas bloqueadas",
    render: () => <JardimProbe modo="locked" />,
  },
  {
    nome: "P8 Jardim home — JD1 e JD2 abertas",
    render: () => <JardimProbe modo="partial" />,
  },
  {
    nome: "P8 Jardim home — progresso avancado e reflexos",
    render: () => <JardimProbe modo="advanced" />,
  },
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: `GM.12 F50 massa/capacidade (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={GM_12} lvl={lvl} semente={s} />,
  })),
  // N1.01 pelo `track.gen`: é a tela em ROLLBACK — a ficha congelada de
  // draggroup que a produção serve enquanto o pareamento não é ativado. Medir
  // o alvo de rollback importa: uma tela de emergência quebrada não socorre.
  { nome: "N1.01 rollback: draggroup congelado (nível 1)", render: (s) => <Exercicio id="N1.01" lvl={1} semente={s} /> },

  // N1.01 pela ficha, nos cinco níveis. Implementada e NÃO ativada: `track.gen`
  // devolveria o congelado. Passa pelo renderizador REAL do app — foi o palco
  // solto que escondeu a barra de alternativas duplicada por baixo da cena.
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: `N1.01 pareamento (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={N1_01} lvl={lvl} semente={s} />,
  })),
  // N1.02 e N1.04 — `TouchCount`, implementada e NÃO ativada. Montadas pela
  // ficha e desenhadas pelo renderizador REAL do app.
  ...[1, 3, 4, 5].map(lvl => ({
    nome: `N1.04 contar tocando (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={N1_04} lvl={lvl} semente={s} />,
  })),
  ...[1, 3, 5].map(lvl => ({
    nome: `N1.02 canhão de balões (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={N1_02} lvl={lvl} semente={s} />,
  })),
  {
    nome: "N1.04 micro-aula: contar juntos",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_04} lvl={1} semente={s}
        mostrar={{ destacarGrupo: true, maoFantasma: 0, numeral: 1 }} />
    ),
  },
  {
    nome: "N1.01 micro-aula: a Mão Fantasma",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_01} lvl={1} semente={s}
        mostrar={{ destacarFileira: "receptores", maoFantasma: true }} />
    ),
  },
  // N1.03 (JD1), N1.08 (JD2) e AL.02 (F52) — a escada de modos do `EmojiRow`,
  // implementada e NÃO ativada. Montadas pela ficha e desenhadas pelo
  // renderizador REAL do app.
  //
  // A fase é PRESA: a tela percorre cinco fases em quatro segundos (§4), e a
  // sonda mede aos 1500ms. Sem prender, ela fotografaria uma fase diferente a
  // cada execução — e uma sonda que muda de resposta não é portão (§6.31).
  //
  // Duas fases por nível, porque são dois layouts distintos: o RELANCE tem os
  // objetos na área e nenhuma alternativa; a PERGUNTA tem a área vazia e a barra
  // de alternativas embaixo. Medir só uma esconde metade da tela — foi
  // exatamente assim que a barra duplicada do N1.01 passou despercebida.
  // Os dois alvos de ROLLBACK. N1.03 e N1.08 saíram dos canários neste commit,
  // e é o legado que a produção serve enquanto a ativação não vem. Uma tela de
  // emergência quebrada não socorre — por isso ela também é medida.
  { nome: "N1.03 rollback: relance legado (nível 2)", render: (s) => <Exercicio id="N1.03" lvl={2} semente={s} /> },
  { nome: "N1.08 rollback: caixa mágica legada (nível 2)", render: (s) => <Exercicio id="N1.08" lvl={2} semente={s} /> },

  ...[1, 3, 5].flatMap(lvl => ([
    {
      nome: `N1.03 olhômetro relance (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_03} lvl={lvl} semente={s} fase="flash" />,
    },
    {
      nome: `N1.03 olhômetro pergunta (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_03} lvl={lvl} semente={s} fase="perguntando" />,
    },
  ])),
  {
    nome: "N1.03 revelação do erro (padrão de dado)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_03} lvl={5} semente={s} fase="revelando" />,
  },
  {
    nome: "N1.03 micro-aula: a fileira parada",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_03} lvl={1} semente={s} mostrar={{ revelar: 2 }} />
    ),
  },
  ...[1, 2].flatMap(lvl => ([
    {
      nome: `N1.08 mão relâmpago (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_08} lvl={lvl} semente={s} fase="flash" />,
    },
    {
      nome: `N1.08 mão relâmpago pergunta (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_08} lvl={lvl} semente={s} fase="perguntando" />,
    },
  ])),
  {
    nome: "N1.08 revelação: a mão cheia em bloco",
    render: (s: number) => <ExercicioDaFicha ficha={N1_08} lvl={2} semente={s} fase="revelando" />,
  },
  {
    nome: "N1.08 micro-aula: a mão parada",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_08} lvl={1} semente={s} mostrar={{ revelar: { mao: 3 } }} />
    ),
  },
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: `AL.02 padrão (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={AL_02} lvl={lvl} semente={s} fase="perguntando" />,
  })),
  {
    nome: "AL.02 micro-aula: a moldura da unidade",
    render: (s: number) => (
      <ExercicioDaFicha ficha={AL_02} lvl={1} semente={s} mostrar={{ molduraUnidade: [0, 1] }} />
    ),
  },
  // AL.01 — a classificação (F51), implementada e NÃO ativada. O rollback dela
  // é o `intruso_math` que a produção serve hoje, e ele também é medido: uma
  // tela de emergência quebrada não socorre.
  { nome: "AL.01 rollback: intruso legado (nível 2)", render: (s) => <Exercicio id="AL.01" lvl={2} semente={s} /> },
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: `AL.01 classificar (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={AL_01} lvl={lvl} semente={s} />,
  })),
  {
    nome: "AL.01 micro-aula: o laço aceso",
    render: (s: number) => (
      <ExercicioDaFicha ficha={AL_01} lvl={1} semente={s} mostrar={{ destacarLaco: true }} />
    ),
  },
  {
    nome: "AL.01 micro-aula: fica fora",
    render: (s: number) => (
      <ExercicioDaFicha ficha={AL_01} lvl={1} semente={s} mostrar={{ deixarFora: 1 }} />
    ),
  },
  // N1.06 — ouvir e escolher (F05), implementada e NÃO ativada. A §3 manda a
  // tela ser deliberadamente VAZIA: é a única do bloco onde isso não é o
  // defeito §6.6, porque o que preenche a tela é o áudio.
  { nome: "N1.06 rollback: o número escrito na tela (nível 2)", render: (s) => <Exercicio id="N1.06" lvl={2} semente={s} /> },
  ...[1, 4, 5].map(lvl => ({
    nome: `N1.06 ouvir e escolher (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={N1_06} lvl={lvl} semente={s} />,
  })),
  {
    nome: "N1.06 micro-aula: aperte pra escutar",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_06} lvl={1} semente={s} mostrar={{ pulsar: "botaoSom" }} />
    ),
  },
  // N1.09 — produzir quantidade (F04), implementada e NÃO ativada. Três estados
  // que valem olhar: a vaga pulsando (nível 1), o contorno discreto (nível 3) e
  // a CENA LIVRE (nível 4), que é onde a ficha diz estar o salto — e onde a
  // tela tem de sustentar até 12 objetos sem vaga nenhuma guiando.
  { nome: "N1.09 (o nó antigo) segue com o legado de contagem (nível 2)", render: (s) => <Exercicio id="N1.09" lvl={2} semente={s} /> },
  ...[1, 3, 4, 5].map(lvl => ({
    nome: `N1.13 produzir quantidade (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={N1_13} lvl={lvl} semente={s} />,
  })),
  {
    nome: "N1.09 micro-aula: as vagas pulsando",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_13} lvl={1} semente={s} mostrar={{ pulsarVagas: true }} />
    ),
  },
  // GE.01 — onde está? (F47), implementada e NÃO ativada. Os quatro pares da §5
  // precisam de geometrias diferentes para serem legíveis, então cada nível é
  // uma cena diferente: mesa, caixa aberta, muro (com oclusão) e árvore.
  { nome: "GE.01 rollback: a resposta em palavras (nível 1)", render: (s) => <Exercicio id="GE.01" lvl={1} semente={s} /> },
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: `GE.01 onde está (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={GE_01} lvl={lvl} semente={s} />,
  })),
  {
    nome: "GE.01 micro-aula: esta é a mesa",
    render: (s: number) => (
      <ExercicioDaFicha ficha={GE_01} lvl={1} semente={s} mostrar={{ destacarReferencial: true }} />
    ),
  },
  // GE.02 — que forma é essa? (F48), implementada e NÃO ativada. Os cinco
  // degraus mudam a MESMA pergunta: forma pura, girada, com cor e tamanho
  // variando, dentro de um objeto do mundo, e enfim em três dimensões.
  { nome: "GE.02 rollback: dois emojis que não giram (nível 1)", render: (s) => <Exercicio id="GE.02" lvl={1} semente={s} /> },
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: `GE.02 que forma é essa (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={GE_02} lvl={lvl} semente={s} />,
  })),
  {
    nome: "GE.02 micro-aula: procurar a forma",
    render: (s: number) => <ExercicioDaFicha ficha={GE_02} lvl={2} semente={s} mostrar={{ destacarTodas: true }} />,
  },
  {
    nome: "GE.02 micro-aula: contar os lados do alvo",
    render: (s: number) => <ExercicioDaFicha ficha={GE_02} lvl={2} semente={s} mostrar={{ contarLadosAlvo: true }} />,
  },
  {
    nome: "GE.02 micro-aula: girar somente o alvo",
    render: (s: number) => <ExercicioDaFicha ficha={GE_02} lvl={2} semente={s} mostrar={{ girarAlvo: true }} />,
  },
  // GM.01 — maior, menor, mais alto (F49), implementada e NÃO ativada. Não há
  // cena de rollback: o nó não tinha gerador nenhum.
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: `GM.01 comparar grandeza (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={GM_01} lvl={lvl} semente={s} />,
  })),
  {
    nome: "GM.01 micro-aula: os dois estão no chão",
    render: (s: number) => (
      <ExercicioDaFicha ficha={GM_01} lvl={1} semente={s} mostrar={{ destacarLinhaBase: true }} />
    ),
  },
  {
    nome: "GM.01 micro-aula: veja qual sobe mais",
    render: (s: number) => (
      <ExercicioDaFicha ficha={GM_01} lvl={3} semente={s} mostrar={{ subirLinhaTracejada: true }} />
    ),
  },
  {
    nome: "GM.01 micro-aula: este é mais alto",
    render: (s: number) => (
      <ExercicioDaFicha ficha={GM_01} lvl={1} semente={s} mostrar={{ destacarMaior: true }} />
    ),
  },
  // ---- A moldura de dez: três fichas, uma primitiva ------------------------
  //
  // A fase é PRESA nas três, e pela mesma razão da `fileira`: a JD3 percorre
  // cinco estados em três segundos e a JD5 tem a tampa deslizando. Sem prender,
  // a sonda fotografaria um estado diferente a cada execução (§6.31).
  //
  // N1.08 níveis 3-5 (F02) — a moldura que a ficha pede. Os níveis 1-2 são a
  // JD2 (a mão) e já estão medidos acima.
  ...[3, 4, 5].map(lvl => ({
    nome: `N1.08 moldura de dez pergunta (nível ${lvl})`,
    render: (s: number) => <ExercicioDaFicha ficha={N1_08} lvl={lvl} semente={s} fase="perguntando" />,
  })),
  {
    // O flash do nível 4: as fichas na tela, sem barra de alternativas ainda.
    nome: "N1.08 moldura relâmpago (nível 4, mostrando)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_08} lvl={4} semente={s} fase="mostrando" />,
  },
  {
    // §4: a fileira de cima acende INTEIRA. É o momento pedagógico central da
    // F02, e é layout — a fileira acesa não pode cobrir o que está embaixo.
    nome: "N1.08 revelação: a fileira acesa em bloco",
    render: (s: number) => <ExercicioDaFicha ficha={N1_08} lvl={3} semente={s} fase="revelando" />,
  },
  {
    nome: "N1.08 micro-aula: a moldura vazia",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_08} lvl={3} semente={s} mostrar={{ moldura: { vazia: true } }} />
    ),
  },
  // N1.11 — uma competência, duas fontes. A Jornada instala a percepção com
  // JD3 e depois TRANSFERE para F28: moldura -> number bond -> símbolo. A escada
  // perceptual completa continua no Jardim, e também é fotografada aqui.
  { nome: "N1.11 rollback: amigos do 10 legados (nível 2)", render: (s) => <Exercicio id="N1.11" lvl={2} semente={s} /> },
  ...[1, 2].flatMap(lvl => ([
    {
      nome: `N1.11 JD3 mostrando (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={lvl} semente={s} fase="mostrando" />,
    },
    {
      nome: `N1.11 JD3 pergunta (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={lvl} semente={s} fase="perguntando" />,
    },
  ])),
  {
    nome: "N1.11 JD3 vazio sozinho (nível 2)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={2} semente={s} fase="vazio" />,
  },
  {
    nome: "N1.11 F28 number bond (nível 3)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={3} semente={s} />,
  },
  {
    nome: "N1.11 F28 símbolo (nível 4)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={4} semente={s} />,
  },
  {
    nome: "N1.11 F28 símbolo automático (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={5} semente={s} />,
  },
  {
    nome: "JD3 Jardim topo mostrando (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={JD3} lvl={5} semente={s} fase="mostrando" />,
  },
  {
    nome: "JD3 Jardim topo pergunta (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={JD3} lvl={5} semente={s} fase="perguntando" />,
  },

  // N1.10 — a JD5 instala a relação parte-todo na cabeça; só depois o L5 dá
  // nome/forma à mesma relação com o NumberBond. O Jardim guarda a JD5 inteira,
  // inclusive o topo sem moldura, sem criar outro nó no DAG.
  { nome: "N1.10 rollback: parte-todo legado (nível 2)", render: (s) => <Exercicio id="N1.10" lvl={2} semente={s} /> },
  ...[1, 4].flatMap(lvl => ([
    {
      nome: `N1.10 JD5 antes da tampa (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_10} lvl={lvl} semente={s} fase="mostrando" />,
    },
    {
      nome: `N1.10 JD5 com a tampa (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_10} lvl={lvl} semente={s} fase="perguntando" />,
    },
  ])),
  {
    nome: "N1.10 formalização NumberBond (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_10} lvl={5} semente={s} />,
  },
  {
    nome: "JD5 Jardim topo sem moldura mostrando (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={JD5} lvl={5} semente={s} fase="mostrando" />,
  },
  {
    nome: "JD5 Jardim topo sem moldura pergunta (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={JD5} lvl={5} semente={s} fase="perguntando" />,
  },
  {
    nome: "N1.10 micro-aula: vou esconder um",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_10} lvl={1} semente={s} mostrar={{ taparN: 1 }} />
    ),
  },
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
      // `max-w-3xl` + `px-4` é o enquadramento real da tela de jogo (App.tsx).
      // O palco recebe a mesma caixa que a criança recebe, em qualquer largura.
      className="mx-auto w-full px-4"
      style={{ maxWidth: 768, background: "#fff", overflow: "visible" }}
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
      // Todos os nomes de uma vez: é o que permite ao driver escolher QUAIS
      // tomadas visitar antes de gastar 1,5s em cada uma delas.
      nomes: () => TOMADAS.map(t => t.nome),
      ir: (n: number) => setI(n),
    };
  }, [i]);
  const t = TOMADAS[i];
  return <Palco key={i} cena={t.cena} semente={t.semente} />;
}

createRoot(document.getElementById("root")!).render(<App />);
