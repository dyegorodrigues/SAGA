import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { PecaDeAtributo, nomeDaPeca } from "./PecaDeAtributo";
import { ClassificacaoSpec, LacoSpec } from "../../curriculum/procedimentos/classificacaoContract";
import {
  AcaoDeClassificacao,
  Criterio,
  ColocacaoDaPeca,
  FALAS,
  Peca,
  destinoCerto,
  rotuloDoCriterio,
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
 *
 * ### Nível 3 é um processo, não um campo no JSON
 *
 * O primeiro código guardava `criterioAnterior`, mas nunca o mostrava: a criança
 * classificava uma vez pelo critério novo e o diagnóstico fingia que ela tinha
 * visto um critério anterior. A tabela §5 é explícita: **critério mudou —
 * reclassificar as mesmas peças**. Portanto este palco executa duas rodadas com
 * o MESMO conjunto, separadas pela transição da §4.
 */

interface Props {
  spec: ClassificacaoSpec;
  onAnswer?: (valor: unknown, acao: AcaoDeClassificacao) => void;
  disabled?: boolean;
  /** A voz do app. §4: confirma o "fora", repete critério e narra a troca. */
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
    /** §8: índice PREFERIDO da peça que a Mão Fantasma põe DENTRO. */
    moverParaDentro?: number;
    /** §8: índice PREFERIDO da peça que a Mão Fantasma deixa FORA. */
    deixarFora?: number;
  } | null;
  /**
   * Prende uma fase do nível 3 para a sonda/print. A criança nunca recebe isto.
   * Sem essa lente, um screenshot do nível 3 só provaria metade da competência.
   */
  faseReclassificacao?: EtapaReclassificacao;
}

/** O destino de uma peça já colocada. `[]` = fora. */
type Colocado = Record<number, number[]>;
type EtapaReclassificacao = "primeira" | "transicao" | "segunda";

/** §4: a troca de critério dura 2,5s. */
const DURACAO_DA_TROCA = 2500;

const TINTA_DO_CRITERIO: Record<string, string> = {
  vermelho: "#DC2626",
  azul: "#2563EB",
  amarelo: "#EAB308",
};

/**
 * Um critério precisa ser visível sem leitura.
 *
 * A faixa F0 inclui criança pré-leitora. Texto continua presente para adulto e
 * acessibilidade, mas cor/forma/tamanho também ganham um sinal visual. Caso
 * contrário "VERMELHOS" e "GRANDES" seriam instruções que só quem lê entende.
 */
function CriterioVisual({ criterio }: { criterio: Criterio }) {
  if (criterio.atributo === "cor") {
    return (
      <span
        aria-hidden
        data-criterio-visual
        className="inline-block shrink-0 rounded-full border-2 border-slate-700"
        style={{ width: 20, height: 20, background: TINTA_DO_CRITERIO[String(criterio.valor)] ?? "#94A3B8" }}
      />
    );
  }

  if (criterio.atributo === "forma") {
    const fill = "#64748B";
    return (
      <svg aria-hidden data-criterio-visual width="22" height="22" viewBox="0 0 40 40" className="shrink-0">
        {criterio.valor === "circulo" && <circle cx="20" cy="20" r="15" fill={fill} />}
        {criterio.valor === "quadrado" && <rect x="6" y="6" width="28" height="28" rx="3" fill={fill} />}
        {criterio.valor === "triangulo" && <polygon points="20,4 36,35 4,35" fill={fill} />}
      </svg>
    );
  }

  const grande = criterio.valor === "grande";
  return (
    <span
      aria-hidden
      data-criterio-visual
      className="inline-block shrink-0 rounded-md border-2 border-slate-600 bg-slate-400"
      style={{ width: grande ? 22 : 13, height: grande ? 22 : 13 }}
    />
  );
}

function criterioDaChave(chave: string): Criterio | null {
  const [atributo, valor] = chave.split(":");
  if (!valor || !["cor", "forma", "tamanho"].includes(atributo)) return null;
  return { atributo, valor } as Criterio;
}

function instrucaoDosLacos(lacos: LacoSpec[]): string {
  if (lacos.length <= 1) return `Agora separe os ${lacos[0]?.rotulo ?? "iguais"}.`;
  const nomes = lacos.map(l => l.rotulo);
  return `Agora separe os ${nomes.slice(0, -1).join(", ")} e os ${nomes.at(-1)}.`;
}

export function ClassificacaoStage({
  spec,
  onAnswer,
  disabled,
  falar,
  resolvidas,
  mostrar,
  faseReclassificacao,
}: Props) {
  const semMovimento = useReducedMotion();
  const ehReclassificacao = spec.forma === "reclassificar" && Boolean(spec.criterioAnterior);
  const faseInicial: EtapaReclassificacao = ehReclassificacao ? "primeira" : "segunda";

  const [etapa, setEtapa] = React.useState<EtapaReclassificacao>(faseReclassificacao ?? faseInicial);
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
  const enviado = React.useRef(false);
  const falarRef = React.useRef(falar);

  React.useEffect(() => { falarRef.current = falar; }, [falar]);

  /**
   * Um `ClassificacaoStage` pode receber a próxima questão sem desmontar. O
   * `PareamentoStage` já guarda esta mesma regra. Sem reset por `spec`, uma
   * classificação terminada vazava para a seguinte e podia nascer já resolvida.
   */
  React.useEffect(() => {
    setEtapa(faseReclassificacao ?? (spec.forma === "reclassificar" && spec.criterioAnterior ? "primeira" : "segunda"));
    setColocado(iniciais(spec, resolvidas));
    setSelecionada(null);
    setAviso(null);
    setBrilho(null);
    setEscolhaDoCriterio(null);
    setTentativas({});
    enviado.current = false;
  }, [spec, resolvidas, faseReclassificacao]);

  const etapaEfetiva = faseReclassificacao ?? etapa;
  const emTransicao = ehReclassificacao && etapaEfetiva === "transicao";

  const lacosAtivos: LacoSpec[] = ehReclassificacao && etapaEfetiva === "primeira" && spec.criterioAnterior
    ? [{ criterio: spec.criterioAnterior, rotulo: rotuloDoCriterio(spec.criterioAnterior) }]
    : spec.lacos;
  const criteriosAtivos = lacosAtivos.map(l => l.criterio);

  const naBandeja = spec.pecas.filter(p => colocado[p.id] === undefined);
  const terminou = naBandeja.length === 0;
  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || emTransicao || emAula;

  /**
   * Fim da PRIMEIRA classificação não é resposta: é a troca de critério. Só a
   * segunda classificação pode chegar ao GameLoop.
   */
  React.useEffect(() => {
    if (!terminou || spec.forma === "descobrir" || emAula) return;

    if (ehReclassificacao && etapaEfetiva === "primeira") {
      // A fase presa pela sonda não deve se autoavançar enquanto é fotografada.
      if (faseReclassificacao) return;
      setEtapa("transicao");
      setColocado({}); // §4: as MESMAS peças voltam ao centro.
      setSelecionada(null);
      setTentativas({}); // diagnóstico da reclassificação lê só a SEGUNDA tentativa.
      // A faixa de fase abaixo já anuncia a mudança. Duplicar a mesma frase no
      // `aviso` criaria duas regiões aria-live dizendo a mesma coisa.
      setAviso(null);
      return;
    }

    if (ehReclassificacao && etapaEfetiva === "transicao") return;
    if (enviado.current) return;
    enviado.current = true;

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
  }, [
    terminou,
    spec,
    colocado,
    tentativas,
    onAnswer,
    emAula,
    ehReclassificacao,
    etapaEfetiva,
    faseReclassificacao,
  ]);

  /** A transição existe na tela por 2,5s; depois a segunda rodada é liberada. */
  React.useEffect(() => {
    if (!ehReclassificacao || etapaEfetiva !== "transicao" || faseReclassificacao) return;
    const atual = spec.lacos;
    falarRef.current?.(`Mudou! ${instrucaoDosLacos(atual)}`);
    const t = window.setTimeout(() => {
      setEtapa("segunda");
      setAviso(null);
    }, DURACAO_DA_TROCA);
    return () => window.clearTimeout(t);
  }, [ehReclassificacao, etapaEfetiva, faseReclassificacao, spec]);

  /** Põe a peça selecionada num destino. `[]` é a prateleira do fora. */
  function colocar(onde: number[]) {
    if (travado || selecionada === null) return;
    const peca = spec.pecas.find(p => p.id === selecionada)!;
    const certo = destinoCerto(peca, criteriosAtivos);
    const acertou = certo.length === onde.length && certo.every(i => onde.includes(i));

    if (!acertou) {
      // §4, erro suave: "a peça é empurrada de volta e o critério é repetido,
      // com o atributo destacado na peça". Sem penalidade, sem X — ela tenta
      // de novo. É a mesma regra do "silêncio é proibido" da F01.
      setTentativas(t => ({ ...t, [peca.id]: [...(t[peca.id] ?? []), onde] }));
      const criterio = onde.length > 0 ? lacosAtivos[onde[0]].criterio : lacosAtivos[0].criterio;
      setAviso(FALAS.erroSuave(criterio));
      falarRef.current?.(FALAS.erroSuave(criterio));
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
      const fala = FALAS.foraCerto(lacosAtivos[0].criterio);
      setAviso(fala);
      falarRef.current?.(fala);
    } else {
      setAviso(null);
    }
  }

  const lacoAceso = (emAula && mostrar?.destacarLaco === true) || emTransicao;

  /**
   * A coreografia da ficha passa um índice de exemplo, mas o índice é só uma
   * preferência editorial. O sorteio muda as peças. Se o índice deixou de ser
   * semanticamente válido, o palco encontra uma peça que realmente demonstre o
   * conceito. Foi um PRINT que pegou a versão anterior ensinando uma peça
   * vermelha como exemplo de "fica fora" num laço de vermelhos.
   */
  function pecaDaDemonstracao(preferida: number | undefined, destino: "dentro" | "fora"): number | undefined {
    if (preferida === undefined) return undefined;
    const serve = (p: Peca) => destino === "dentro"
      ? destinoCerto(p, criteriosAtivos).length > 0
      : destinoCerto(p, criteriosAtivos).length === 0;
    const pedida = spec.pecas.find(p => p.id === preferida);
    if (pedida && serve(pedida)) return pedida.id;
    return spec.pecas.find(serve)?.id;
  }

  const maoDentro = emAula ? pecaDaDemonstracao(mostrar?.moverParaDentro, "dentro") : undefined;
  const maoFora = emAula ? pecaDaDemonstracao(mostrar?.deixarFora, "fora") : undefined;

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
            const criterio = criterioDaChave(a.valor);
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
                className="flex min-h-[56px] items-center gap-2 rounded-2xl px-4 text-lg font-black transition-all active:translate-y-1"
                style={{
                  color: "#22315C",
                  border: "2px solid #C7D7F0",
                  boxShadow: `0 4px 0 ${escolhaDoCriterio && certa ? "#2FB98C" : "#C7D7F0"}`,
                  background: escolhaDoCriterio === null ? "#F8FAFC"
                    : certa ? "#D1FAE5" : escolhida ? "#FEF3C7" : "#F8FAFC",
                }}
              >
                {criterio && <CriterioVisual criterio={criterio} />}
                <span>{a.rotulo}</span>
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

  const rotuloDoLaco = (l: LacoSpec) => (
    <span className="flex items-center justify-center gap-1.5">
      <CriterioVisual criterio={l.criterio} />
      <span>{l.rotulo}</span>
    </span>
  );

  const laco = (indices: number[], l: LacoSpec, chave: string, largura: number | string) => (
    <motion.button
      key={chave}
      type="button"
      onClick={() => colocar(indices)}
      disabled={travado || selecionada === null}
      aria-label={`Laço: ${l.rotulo}`}
      className="relative flex flex-col items-center justify-start gap-1 rounded-[32px] border-4 p-2"
      style={{
        width: largura,
        minHeight: dentroDe(indices).length > 0 ? 92 : 62,
        borderColor: "#6D28D9",
        borderStyle: selecionada === null ? "dashed" : "solid",
        background: lacoAceso ? "#F5F3FF" : "#FAFAFF",
      }}
      animate={semMovimento || !lacoAceso ? undefined : { opacity: [1, 0.72, 1] }}
      transition={{ duration: 0.9, repeat: lacoAceso ? Infinity : 0 }}
    >
      <span className="text-xs font-black uppercase tracking-wide" style={{ color: "#6D28D9" }}>
        {rotuloDoLaco(l)}
      </span>
      <span className="flex flex-wrap items-center justify-center gap-0.5">
        {dentroDe(indices).map(p => (
          <PecaDeAtributo key={p.id} peca={p} brilhando={brilho === p.id} disabled />
        ))}
      </span>
    </motion.button>
  );

  /** Os dois laços que **se cruzam** — §5, nível 4. */
  const lacosCruzados = () => {
    const LARGURA = 62;
    const SOBRA = 100 - LARGURA;
    const zona = (indices: number[], l: LacoSpec | null, rotulo: string, esquerda: number, largura: number) => (
      <button
        type="button"
        onClick={() => colocar(indices)}
        disabled={travado || selecionada === null}
        aria-label={`Laço: ${rotulo}`}
        className="absolute top-0 flex h-full flex-col items-center justify-center gap-0.5"
        style={{ left: `${esquerda}%`, width: `${largura}%` }}
      >
        <span
          className="flex items-center gap-1 text-[10px] font-black uppercase leading-tight"
          style={{ color: "#6D28D9" }}
        >
          {l && <CriterioVisual criterio={l.criterio} />}
          <span>{rotulo}</span>
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
        {zona([0], lacosAtivos[0], lacosAtivos[0].rotulo, 2, SOBRA - 4)}
        {zona([0, 1], null, "os dois", SOBRA + 1, LARGURA - SOBRA - 2)}
        {zona([1], lacosAtivos[1], lacosAtivos[1].rotulo, LARGURA + 2, SOBRA - 4)}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col items-center gap-2 select-none">
      {ehReclassificacao && (
        <div
          role="status"
          aria-live="polite"
          className="min-h-[24px] text-center text-sm font-black"
          style={{ color: emTransicao ? "#B45309" : "#6D28D9" }}
        >
          {emTransicao ? "Agora mudou!" : etapaEfetiva === "primeira" ? "Primeiro jeito" : "Outro jeito"}
        </div>
      )}

      <div className="flex w-full items-stretch justify-center gap-1">
        {intersecao ? (
          lacosCruzados()
        ) : (
          lacosAtivos.map((l, i) => laco([i], l, `l${i}`, lacosAtivos.length > 1 ? "48%" : "82%"))
        )}
      </div>

      <div
        role="group"
        aria-label={naBandeja.length > 0 ? "Peças para separar" : "A bandeja está vazia"}
        className="flex min-h-[64px] w-full flex-wrap items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-2"
      >
        {naBandeja.map(p => {
          const demonstracao = maoDentro === p.id ? "dentro" : maoFora === p.id ? "fora" : null;
          return (
            <span
              key={p.id}
              className="relative flex items-center justify-center"
              data-peca-id={p.id}
              data-mao-fantasma={demonstracao ?? undefined}
            >
              <PecaDeAtributo
                peca={p}
                selecionada={selecionada === p.id || demonstracao !== null}
                onClick={() => !travado && setSelecionada(s => (s === p.id ? null : p.id))}
                disabled={travado}
              />
              {demonstracao && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute right-[-2px] text-[24px]"
                  style={{ zIndex: 2, top: demonstracao === "dentro" ? 28 : -10 }}
                  initial={semMovimento ? undefined : { opacity: 0, y: demonstracao === "dentro" ? 20 : -20 }}
                  animate={semMovimento
                    ? { opacity: 1 }
                    : {
                      opacity: [0, 1, 1, 0],
                      y: demonstracao === "dentro" ? [20, 4, -10, -10] : [-20, -4, 10, 10],
                    }}
                  transition={{ duration: 2.1, times: [0, 0.3, 0.8, 1], repeat: Infinity, repeatDelay: 0.4 }}
                >
                  {demonstracao === "dentro" ? "👆" : "👇"}
                </motion.span>
              )}
            </span>
          );
        })}
        {naBandeja.length === 0 && (
          <span className="text-sm font-bold text-slate-500">Acabou!</span>
        )}
      </div>

      <motion.button
        type="button"
        onClick={() => colocar([])}
        disabled={travado || selecionada === null}
        aria-label="Deixar fora dos laços"
        className="flex w-full flex-wrap items-center justify-center gap-1 rounded-2xl border-2 p-2"
        style={{
          minHeight: dentroDe([]).length > 0 ? 64 : 46,
          borderColor: "#B45309",
          borderStyle: selecionada === null ? "dashed" : "solid",
          background: "#FFFBEB",
        }}
        animate={semMovimento || maoFora === undefined ? undefined : { opacity: [1, 0.72, 1] }}
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
