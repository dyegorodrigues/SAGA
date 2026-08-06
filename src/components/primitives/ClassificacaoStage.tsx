import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { PecaDeAtributo, nomeDaPeca } from "./PecaDeAtributo";
import { ClassificacaoSpec } from "../../curriculum/procedimentos/classificacaoContract";
import {
  AcaoDeClassificacao,
  ColocacaoDaPeca,
  FALAS,
  Peca,
  destinoCerto,
} from "../../curriculum/procedimentos/classificacaoProcedure";

/**
 * `ClassificacaoStage` — a tela de AL.01, ficha F51.
 *
 * ---
 *
 * ### É o outro modo do `DragGroup`, e por isso partilha a gramática
 *
 * O N1.01 (`DragGroup` modo *parear*) montou a gramática: **os destinos em
 * cima, a bandeja embaixo, e o gesto é tocar a peça e tocar o destino** — nunca
 * arrastar, porque o §8.3-bis proíbe precisão de dedo como requisito para
 * demonstrar compreensão. Esta tela usa a mesma, com os laços no lugar dos
 * receptores. Para a criança não é um desenho novo: é o mesmo desenho com
 * outro tipo de alvo.
 *
 * Ver `classificacaoProcedure` para a observação de progressão (P11): os dois
 * modos estreiam em dois nós raiz, sem ordem entre eles.
 *
 * ### "Fora" é um alvo, não a ausência de ação
 *
 * A §2 chama o "não pertence" de *"o que quase ninguém ensina, e é o mais
 * importante"*, e a §4 manda a peça deixada fora **brilhar**. Uma peça que
 * fica de fora porque a criança não fez nada não é uma decisão — e o app não
 * teria como distinguir "ela decidiu" de "ela não terminou".
 *
 * Por isso existe a **prateleira do fora**, com rótulo, e ela recebe toque
 * igual a um laço.
 */

interface Props {
  spec: ClassificacaoSpec;
  onAnswer?: (valor: unknown, acao: AcaoDeClassificacao) => void;
  disabled?: boolean;
  /** A voz do app. §4: a fala confirma o "fora" e repete o critério no erro. */
  falar?: (texto: string) => void;
  /**
   * Coloca peças já resolvidas. **Só a sonda passa.**
   *
   * A tela muda de forma conforme a bandeja esvazia — os laços enchem, a
   * prateleira do fora aparece. Uma sonda que medisse só o estado inicial nunca
   * veria metade dela. Irmão do `preenchidos` do `TouchCount`.
   */
  resolvidas?: number;
  /** O passo da micro-aula, vindo do `tutShow`. */
  mostrar?: {
    /** §8: "Vamos separar os vermelhos." — o laço acende. */
    destacarLaco?: boolean;
    /** §8: o índice da peça que a Mão Fantasma põe DENTRO. */
    moverParaDentro?: number;
    /** §8: o índice da peça que a Mão Fantasma deixa FORA. */
    deixarFora?: number;
  } | null;
}

/** O destino de uma peça já colocada. `[]` = fora. */
type Colocado = Record<number, number[]>;

export function ClassificacaoStage({ spec, onAnswer, disabled, falar, resolvidas, mostrar }: Props) {
  const semMovimento = useReducedMotion();
  const [colocado, setColocado] = React.useState<Colocado>(() => iniciais(spec, resolvidas));
  const [selecionada, setSelecionada] = React.useState<number | null>(null);
  const [aviso, setAviso] = React.useState<string | null>(null);
  const [brilho, setBrilho] = React.useState<number | null>(null);
  const [escolhaDoCriterio, setEscolhaDoCriterio] = React.useState<string | null>(null);
  /**
   * As tentativas recusadas, por peça.
   *
   * É AQUI que o diagnóstico da §6 mora. O erro é empurrado de volta (§4), então
   * o estado final está sempre certo — se ninguém guardasse a tentativa,
   * `TUDO_CABE` nunca poderia disparar. Ver `classificacaoProcedure`.
   */
  const [tentativas, setTentativas] = React.useState<Record<number, number[][]>>({});

  const naBandeja = spec.pecas.filter(p => colocado[p.id] === undefined);
  const terminou = naBandeja.length === 0;

  React.useEffect(() => {
    if (!terminou || spec.forma === "descobrir") return;
    const colocacoes: ColocacaoDaPeca[] = spec.pecas.map(p => ({
      peca: p,
      onde: colocado[p.id] ?? [],
      tentativas: tentativas[p.id] ?? [],
    }));
    onAnswer?.(true, {
      colocacoes,
      criterios: spec.lacos.map(l => l.criterio),
      forma: spec.forma,
      criterioAnterior: spec.criterioAnterior,
    });
    // `onAnswer` é estável no GameLoop; a dependência é o fim da rodada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminou]);

  /** Põe a peça selecionada num destino. `[]` é a prateleira do fora. */
  function colocar(onde: number[]) {
    if (disabled || selecionada === null) return;
    const peca = spec.pecas.find(p => p.id === selecionada)!;
    const certo = destinoCerto(peca, spec.lacos.map(l => l.criterio));
    const acertou = certo.length === onde.length && certo.every(i => onde.includes(i));

    if (!acertou) {
      // §4, erro suave: "a peça é empurrada de volta e o critério é repetido,
      // com o atributo destacado na peça". Sem penalidade, sem X — ela tenta
      // de novo. É a mesma regra do "silêncio é proibido" da F01.
      setTentativas(t => ({ ...t, [peca.id]: [...(t[peca.id] ?? []), onde] }));
      const criterio = onde.length > 0 ? spec.lacos[onde[0]].criterio : spec.lacos[0].criterio;
      setAviso(FALAS.erroSuave(criterio));
      falar?.(FALAS.erroSuave(criterio));
      setSelecionada(null);
      return;
    }

    setColocado(atual => ({ ...atual, [peca.id]: onde }));
    setSelecionada(null);
    setBrilho(peca.id);
    window.setTimeout(() => setBrilho(b => (b === peca.id ? null : b)), 700);

    if (onde.length === 0) {
      // §4: "ao deixar uma peça fora, ela TAMBÉM brilha — e a voz confirma".
      // O brilho no fora é o detalhe crucial da ficha: ensina que "não
      // pertence" é uma decisão, não um erro.
      const fala = FALAS.foraCerto(spec.lacos[0].criterio);
      setAviso(fala);
      falar?.(fala);
    } else {
      setAviso(null);
    }
  }

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const lacoAceso = emAula && mostrar?.destacarLaco === true;
  const maoDentro = emAula ? mostrar?.moverParaDentro : undefined;
  const maoFora = emAula ? mostrar?.deixarFora : undefined;

  /* ---------------------------------------------------------------- *
   *  Nível 5 — descobrir o critério
   * ---------------------------------------------------------------- */

  if (spec.forma === "descobrir") {
    return (
      <div className="flex w-full flex-col items-center gap-3 select-none">
        <div
          role="group"
          aria-label="As peças que estão juntas"
          className="flex w-full flex-wrap items-center justify-center gap-1 rounded-[32px] border-4 p-3"
          style={{ borderColor: "#6D28D9", borderStyle: "solid", background: "#FAF5FF" }}
        >
          {spec.pecas
            .filter(p => destinoCerto(p, spec.lacos.map(l => l.criterio)).length > 0)
            .map(p => <PecaDeAtributo key={p.id} peca={p} disabled />)}
        </div>

        <div role="group" aria-label="Alternativas" className="flex flex-wrap justify-center gap-2">
          {(spec.alternativas ?? []).map(a => {
            const escolhida = escolhaDoCriterio === a.valor;
            const certa = a.valor === spec.resposta;
            return (
              <button
                key={a.valor}
                type="button"
                disabled={disabled || escolhaDoCriterio !== null}
                onClick={() => {
                  setEscolhaDoCriterio(a.valor);
                  onAnswer?.(a.valor, {
                    colocacoes: [],
                    criterios: spec.lacos.map(l => l.criterio),
                    forma: spec.forma,
                  });
                }}
                className="min-h-[56px] rounded-2xl px-4 text-lg font-black transition-all active:translate-y-1"
                style={{
                  color: "#22315C",
                  border: "2px solid #C7D7F0",
                  boxShadow: `0 4px 0 ${escolhaDoCriterio && certa ? "#2FB98C" : "#C7D7F0"}`,
                  background: escolhaDoCriterio === null ? "#F8FAFC"
                    : certa ? "#D1FAE5" : escolhida ? "#FEF3C7" : "#F8FAFC",
                }}
              >
                {a.rotulo}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- *
   *  Níveis 1 a 4 — os laços
   * ---------------------------------------------------------------- */

  const intersecao = spec.forma === "intersecao";

  /** As peças que caíram num destino. */
  const dentroDe = (alvo: number[]) => spec.pecas.filter(p => {
    const onde = colocado[p.id];
    if (onde === undefined) return false;
    return onde.length === alvo.length && alvo.every(i => onde.includes(i));
  });

  const laco = (indices: number[], rotulo: string, chave: string, largura: number | string) => (
    <motion.button
      key={chave}
      type="button"
      onClick={() => colocar(indices)}
      disabled={disabled || selecionada === null}
      aria-label={`Laço: ${rotulo}`}
      className="relative flex flex-col items-center justify-start gap-1 rounded-[32px] border-4 p-2"
      style={{
        width: largura,
        // Baixo quando vazio, cresce com as peças. Uma moldura de 96px sem nada
        // dentro é a moldura vazia lida como bug do §6.6 — e aqui ela ocupava
        // um quarto da tela no primeiro segundo do exercício.
        minHeight: dentroDe(indices).length > 0 ? 92 : 62,
        borderColor: "#6D28D9",
        borderStyle: selecionada === null ? "dashed" : "solid",
        background: lacoAceso ? "#F5F3FF" : "#FAFAFF",
      }}
      animate={semMovimento || !lacoAceso ? undefined : { scale: [1, 1.03, 1] }}
      transition={{ duration: 0.9, repeat: lacoAceso ? Infinity : 0 }}
    >
      <span className="text-xs font-black uppercase tracking-wide" style={{ color: "#6D28D9" }}>
        {rotulo}
      </span>
      <span className="flex flex-wrap items-center justify-center gap-0.5">
        {dentroDe(indices).map(p => (
          <PecaDeAtributo key={p.id} peca={p} brilhando={brilho === p.id} disabled />
        ))}
      </span>
    </motion.button>
  );

  /**
   * Os dois laços que **se cruzam** — §5, nível 4.
   *
   * ### O defeito que isto corrige
   *
   * A primeira versão pôs três caixas lado a lado e chamou a do meio de "OS
   * DOIS". Estava correto e ilegível: uma criança de 4 anos **não lê** "os
   * dois" — ela precisa VER que os laços se sobrepõem, e que a região comum é
   * comum porque pertence aos dois desenhos. O print mostrou três caixas
   * separadas com uma legenda, que é outra coisa.
   *
   * A ficha desenha o cruzamento, e o §6.34 é explícito: *"leia o desenho da
   * ficha, não só o texto dela — quando a ficha traz um diagrama, ele é
   * especificação"*. Duas elipses de verdade, com borda, sobrepostas: a
   * interseção existe no desenho antes de existir no rótulo.
   */
  const lacosCruzados = () => {
    const LARGURA = 62;   // % da caixa que cada elipse ocupa
    const SOBRA = 100 - LARGURA;             // onde a segunda começa
    const zona = (indices: number[], rotulo: string, esquerda: number, largura: number) => (
      <button
        type="button"
        onClick={() => colocar(indices)}
        disabled={disabled || selecionada === null}
        aria-label={`Laço: ${rotulo}`}
        className="absolute top-0 flex h-full flex-col items-center justify-center gap-0.5"
        style={{ left: `${esquerda}%`, width: `${largura}%` }}
      >
        <span
          className="text-[10px] font-black uppercase leading-tight"
          style={{ color: "#6D28D9" }}
        >
          {rotulo}
        </span>
        <span className="flex max-w-full flex-wrap items-center justify-center gap-0.5">
          {dentroDe(indices).map(p => (
            <PecaDeAtributo key={p.id} peca={p} brilhando={brilho === p.id} disabled />
          ))}
        </span>
      </button>
    );

    return (
      <div className="relative w-full" style={{ height: 132 }}>
        {/* As elipses. Só borda, fundo transparente: é a sobreposição das duas
            linhas que faz a interseção aparecer. Fundo opaco taparia uma. */}
        {[0, SOBRA].map((esq, i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute top-0 h-full rounded-[50%] border-4"
            style={{
              left: `${esq}%`,
              width: `${LARGURA}%`,
              borderColor: i === 0 ? "#6D28D9" : "#B45309",
              borderStyle: selecionada === null ? "dashed" : "solid",
              background: i === 0 ? "rgba(124,58,237,0.06)" : "rgba(180,83,9,0.06)",
            }}
          />
        ))}
        {zona([0], spec.lacos[0].rotulo, 2, SOBRA - 4)}
        {zona([0, 1], "os dois", SOBRA + 1, LARGURA - SOBRA - 2)}
        {zona([1], spec.lacos[1].rotulo, LARGURA + 2, SOBRA - 4)}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col items-center gap-2 select-none">
      {/* Os laços. No nível 4 eles se CRUZAM (§5) e o vão do meio é um alvo
          próprio: é ali que mora a peça que pertence aos dois, e é esse degrau
          que a ficha chama de "o mais difícil do raciocínio lógico infantil".
          Desenhá-los lado a lado, sem cruzar, apagaria a interseção. */}
      <div className="flex w-full items-stretch justify-center gap-1">
        {intersecao ? (
          lacosCruzados()
        ) : (
          spec.lacos.map((l, i) => laco([i], l.rotulo, `l${i}`, spec.lacos.length > 1 ? "48%" : "82%"))
        )}
      </div>

      {/* A bandeja: o que ainda não foi decidido. Mesma caixa tracejada do
          `PareamentoStage` — é a bandeja da mesma primitiva. */}
      <div
        role="group"
        aria-label={naBandeja.length > 0 ? "Peças para separar" : "A bandeja está vazia"}
        className="flex min-h-[64px] w-full flex-wrap items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-2"
      >
        {naBandeja.map(p => (
          <PecaDeAtributo
            key={p.id}
            peca={p}
            selecionada={selecionada === p.id || maoDentro === p.id || maoFora === p.id}
            onClick={() => setSelecionada(s => (s === p.id ? null : p.id))}
            disabled={disabled}
          />
        ))}
        {naBandeja.length === 0 && (
          // Moldura vazia lê como bug (§6.6): a bandeja vazia se explica.
          <span className="text-sm font-bold text-slate-500">Acabou!</span>
        )}
      </div>

      {/* A prateleira do FORA. Um alvo de verdade, porque "não pertence" é uma
          decisão — §2. Sem ela, ficar de fora seria não fazer nada, e o app
          não distinguiria a criança que decidiu da que parou no meio. */}
      <motion.button
        type="button"
        onClick={() => colocar([])}
        disabled={disabled || selecionada === null}
        aria-label="Deixar fora dos laços"
        className="flex w-full flex-wrap items-center justify-center gap-1 rounded-2xl border-2 p-2"
        style={{
          // Encolhe vazia, cresce com as peças — §6.6, a mesma razão do laço.
          minHeight: dentroDe([]).length > 0 ? 64 : 46,
          borderColor: "#B45309",
          borderStyle: selecionada === null ? "dashed" : "solid",
          background: "#FFFBEB",
        }}
        animate={semMovimento || maoFora === undefined ? undefined : { scale: [1, 1.03, 1] }}
        transition={{ duration: 0.9, repeat: maoFora !== undefined ? Infinity : 0 }}
      >
        <span className="text-xs font-black uppercase tracking-wide" style={{ color: "#92400E" }}>
          fica fora
        </span>
        <span className="flex flex-wrap items-center justify-center gap-0.5">
          {dentroDe([]).map(p => (
            <PecaDeAtributo key={p.id} peca={p} brilhando={brilho === p.id} disabled />
          ))}
        </span>
      </motion.button>

      {/* Silêncio é proibido: toda ação responde, e o erro não pune. */}
      <p
        role="status"
        aria-live="polite"
        className="min-h-[22px] text-center text-sm font-bold"
        style={{ color: "#B45309" }}
      >
        {aviso ?? (selecionada !== null
          ? `Onde vai ${nomeDaPeca(spec.pecas.find(p => p.id === selecionada)!)}?`
          : "")}
      </p>
    </div>
  );
}

/** As peças que a sonda pede já resolvidas — nunca a criança. */
function iniciais(spec: ClassificacaoSpec, quantas?: number): Colocado {
  if (!quantas) return {};
  const criterios = spec.lacos.map(l => l.criterio);
  const fora: Colocado = {};
  spec.pecas.slice(0, quantas).forEach(p => { fora[p.id] = destinoCerto(p as Peca, criterios); });
  return fora;
}
