from pathlib import Path

ROOT = Path('.')

def write(path: str, content: str) -> None:
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')

# ---------------------------------------------------------------------------
# F48 runtime ficha — a fronteira GE.02 (plano) × GE.04 (sólidos) fica explícita.
# ---------------------------------------------------------------------------
write('src/curriculum/fichas/jornada/GE.02.ts', '''import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/formaProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F48 — Que forma é essa? *Reconhecer formas planas, mesmo giradas.*
 *
 * Regra estrutural: GE.02 termina em **invariância de forma plana**. Sólidos
 * pertencem à GE.04/F59 no grafo. A antiga linha "formas 3D" do nível 5 da F48
 * duplicava a competência sucessora e fazia a criança saltar de domínio antes
 * de consolidar a transferência entre representações 2D.
 *
 * A escada agora muda uma coisa por vez:
 * 1. forma pura em pé;
 * 2. a mesma classe girada;
 * 3. cor/tamanho deixam de ser pista;
 * 4. a forma é reconhecida dentro de um objeto do mundo;
 * 5. mistura as representações já conhecidas na mesma cena — nenhuma linguagem
 *    nova, apenas transferência e invariância.
 */

const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  exige: {
    evidencia: Evidencia.FORMA_GIRADA,
    descricao: "Reconhecer a forma mesmo com ela virada.",
  },
};

/** §8 retificada semanticamente: a demonstração acompanha o alvo sorteado. */
const coreografia = [
  { fala: "Procure a forma que eu pedi.", show: { destacarTodas: true } },
  { fala: "Conte os lados da forma certa.", show: { contarLadosAlvo: true } },
  { fala: "Mesmo virada, ela continua sendo a mesma forma!", show: { girarAlvo: true } },
];

export const GE_02: FichaCompetencia = {
  id: "GE.02",
  nome: "Que forma é essa? (formas planas)",
  strand: "GE",
  faixa: "F0",
  prereqs: ["AL.01"],
  bncc: "EI03ET05",

  howto: FALAS.howto,
  explain: FALAS.explain,
  distratores: [],

  niveis: {
    1: { primitiva: "shapecanvas", micro: "puras", andaime: "mao_fantasma" },
    2: { primitiva: "shapecanvas", micro: "giradas", andaime: "alto" },
    3: { primitiva: "shapecanvas", micro: "tamanhos_cores", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "mundo_real", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "mistura_representacoes", andaime: "nenhum", rt_alvo: 12000 },
  },

  micros: [
    {
      id: "puras",
      fonte: "F48",
      alvo: "nomear a forma na orientação padrão — vocabulário visual de partida",
      kinds: ["shapecanvas"],
      params: { modo: "formas", audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "giradas",
      fonte: "F48",
      alvo: "a MESMA forma, girada: o assunto declarado da ficha",
      kinds: ["shapecanvas"],
      params: { modo: "formas", audio_prompt: FALAS.howto, tutorial: coreografia },
      dominio,
    },
    {
      id: "tamanhos_cores",
      fonte: "F48",
      alvo: "tamanho e cor mudam, a forma não — propriedade contra aparência",
      kinds: ["shapecanvas"],
      params: { modo: "formas", audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "mundo_real",
      fonte: "F48",
      alvo: "achar a forma DENTRO de uma coisa: roda, janela, chapéu, quadro",
      kinds: ["shapecanvas"],
      params: {
        modo: "formas",
        howto: "Olhe o contorno da coisa toda. Que forma ele faz?",
        explain: "Não é o nome do objeto que importa: é o formato do contorno.",
      },
      dominio,
    },
    {
      id: "mistura_representacoes",
      fonte: "F48",
      alvo: "transferir: formas puras e formas dentro de objetos aparecem juntas, já com giro, cor e tamanho variados",
      kinds: ["shapecanvas"],
      params: {
        modo: "formas",
        howto: "Algumas formas estão sozinhas e outras escondidas em objetos. Olhe o contorno.",
        explain: "A aparência mudou, mas os lados e o contorno continuam dizendo qual é a forma.",
      },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.SO_ORIENTACAO_PADRAO, descricao: "Não reconhece a forma girada: memorizou uma imagem, não a propriedade." },
    { id: MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO, descricao: "Trocou quadrado por retângulo: não comparou o comprimento dos lados." },
    { id: MisconceptionTag.IGNORA_LADOS, descricao: "Escolheu pela aparência geral, sem usar lados e contorno." },
  ],
};
''')

write('src/curriculum/procedimentos/formaProcedure.ts', '''import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";

/** Procedimento da F48/GE.02 — invariância de FORMAS PLANAS. */
export type Forma = "circulo" | "quadrado" | "triangulo" | "retangulo";
export type Figura = Forma;

export const FORMAS: Forma[] = ["circulo", "quadrado", "triangulo", "retangulo"];

/** Nome falado; o artigo evita frases telegráficas na voz. */
export const NOME: Record<Forma, string> = {
  circulo: "o círculo",
  quadrado: "o quadrado",
  triangulo: "o triângulo",
  retangulo: "o retângulo",
};

export const LADOS: Record<Forma, number> = {
  circulo: 0,
  quadrado: 4,
  triangulo: 3,
  retangulo: 4,
};

export function descricaoDeLados(forma: Forma): string {
  if (forma === "circulo") return "0 lados — uma curva contínua";
  if (forma === "quadrado") return "4 lados iguais";
  if (forma === "retangulo") return "4 lados — 2 longos e 2 curtos";
  return "3 lados";
}

type Representacao = "pura" | "real" | "mista";

interface DegrauDaF48 {
  gira: boolean;
  variaAparencia: boolean;
  representacao: Representacao;
  opcoes: number;
}

/**
 * Escada retificada com a fronteira curricular explícita.
 *
 * GE.02 é "formas planas básicas" no grafo. GE.04/F59 é "sólidos geométricos".
 * O antigo nível 5 de sólidos duplicava GE.04 e quebrava a progressão. O novo
 * nível 5 combina apenas transformações já ensinadas: pura + mundo real,
 * giro + cor + tamanho. É transferência, não conteúdo novo.
 */
const DEGRAUS: Record<number, DegrauDaF48> = {
  1: { gira: false, variaAparencia: false, representacao: "pura", opcoes: 3 },
  2: { gira: true, variaAparencia: false, representacao: "pura", opcoes: 3 },
  3: { gira: true, variaAparencia: true, representacao: "pura", opcoes: 4 },
  4: { gira: true, variaAparencia: true, representacao: "real", opcoes: 4 },
  5: { gira: true, variaAparencia: true, representacao: "mista", opcoes: 4 },
};

function degrau(nivel: number): DegrauDaF48 {
  return DEGRAUS[Math.min(5, Math.max(1, Math.round(nivel)))];
}

export const giraNoNivel = (n: number): boolean => degrau(n).gira;
export const variaAparenciaNoNivel = (n: number): boolean => degrau(n).variaAparencia;
export const mundoRealNoNivel = (n: number): boolean => degrau(n).representacao === "real";
export const misturaRepresentacoesNoNivel = (n: number): boolean => degrau(n).representacao === "mista";
export const opcoesDoNivel = (n: number): number => degrau(n).opcoes;

/** Ângulos que de fato mudam a aparência percebida da figura. */
export const ANGULOS: Record<Forma, number[]> = {
  circulo: [0],
  quadrado: [45],
  triangulo: [120, 180, 210],
  retangulo: [30, 45, 60, 90],
};

export function anguloDe(forma: Forma, sorteio: () => number): number {
  const opcoes = ANGULOS[forma];
  return opcoes[Math.floor(sorteio() * opcoes.length) % opcoes.length];
}

export function aceitaGiro(forma: Forma): boolean {
  return ANGULOS[forma].some(a => a !== 0);
}

function inicio(nome: string): string {
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

function contarLados(forma: Forma): string {
  return LADOS[forma] === 0 ? "nenhum lado" : `${LADOS[forma]} lados`;
}

export const FALAS = {
  pergunta: (forma: Forma): string => `Qual é ${NOME[forma]}?`,

  // Não fixa "triângulo": o alvo é sorteado. A fala antiga podia pedir
  // quadrado e, em seguida, ensinar "o triângulo tem três lados".
  howto: "Olhe o contorno. Se houver lados, conte; mesmo virada, a forma continua a mesma.",
  explain: "Não use a posição, a cor ou o tamanho como pista. Compare lados e contorno.",

  acerto: (forma: Forma): string => forma === "circulo"
    ? "Isso! O círculo não tem lados — ele é uma curva contínua."
    : `Isso! ${inicio(NOME[forma])} tem ${descricaoDeLados(forma)}, em qualquer posição.`,

  erroSuave: (escolhida: Forma, certa: Forma): string => {
    const par = new Set<Forma>([escolhida, certa]);
    if (par.has("quadrado") && par.has("retangulo")) {
      return "Os dois têm 4 lados. O quadrado tem os quatro lados iguais; o retângulo tem dois longos e dois curtos.";
    }
    return `${inicio(NOME[escolhida])} tem ${contarLados(escolhida)}. ${inicio(NOME[certa])} tem ${contarLados(certa)}.`;
  },
};

export interface AcaoDeForma {
  pedida: Forma;
  escolhida: Forma;
  pedidaGirada: boolean;
  escolhidaEmPe: boolean;
}

export function diagnosticar(acao: AcaoDeForma): string | undefined {
  if (acao.escolhida === acao.pedida) return undefined;
  if (acao.pedidaGirada && acao.escolhidaEmPe) return MisconceptionTag.SO_ORIENTACAO_PADRAO;

  const par = new Set([acao.pedida, acao.escolhida]);
  if (par.has("quadrado") && par.has("retangulo")) {
    return MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO;
  }
  return MisconceptionTag.IGNORA_LADOS;
}

/** §9: a evidência extra já viaja por Question.exigeEvidencia/evidenciasVistas. */
export function dominou(historico: AcaoDeForma[]): boolean {
  const acertos = historico.filter(a => a.escolhida === a.pedida);
  if (acertos.length < 3) return false;
  return acertos.some(a => a.pedidaGirada);
}

export function evidenciasDe(acao: AcaoDeForma): string[] {
  return acao.escolhida === acao.pedida && acao.pedidaGirada ? [Evidencia.FORMA_GIRADA] : [];
}
''')

write('src/curriculum/procedimentos/formaContract.ts', '''import {
  FALAS,
  FORMAS,
  Forma,
  aceitaGiro,
  anguloDe,
  giraNoNivel,
  misturaRepresentacoesNoNivel,
  mundoRealNoNivel,
  opcoesDoNivel,
  variaAparenciaNoNivel,
} from "./formaProcedure";

/** Contrato do ShapeCanvas no modo formas (F48). */
export const LARGURA_DE_PROJETO = 340;
export const LADO_DO_CONTEINER = 100;
export const VAO = 12;
export const COR_PADRAO = "#2563EB";
export const CORES = ["#2563EB", "#DC2626", "#15803D", "#B45309", "#7C3AED"];

export interface OpcaoDeForma {
  figura: Forma;
  giro: number;
  tamanho: number;
  cor: string;
  objeto?: "roda" | "janela" | "chapeu" | "quadro";
}

export interface FormaSpec {
  nivel: number;
  alvo: Forma;
  opcoes: OpcaoDeForma[];
  alvoGirado: boolean;
  /** N5: há formas puras e formas dentro de objetos na mesma cena. */
  misturaRepresentacoes: boolean;
  enunciado: string;
  falado: string;
  resposta: Forma;
}

export const OBJETOS_REAIS: Record<NonNullable<OpcaoDeForma["objeto"]>, Forma> = {
  roda: "circulo",
  janela: "retangulo",
  chapeu: "triangulo",
  quadro: "quadrado",
};

/** O alvo dos níveis com giro nunca é círculo, pois girá-lo é visualmente inerte. */
export function alvosPossiveis(nivel: number): Forma[] {
  if (!giraNoNivel(nivel)) return [...FORMAS];
  return FORMAS.filter(aceitaGiro);
}

function embaralhar<T>(lista: T[], sorteio: () => number): T[] {
  const fora = [...lista];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

function objetoDaForma(forma: Forma): OpcaoDeForma["objeto"] {
  return (Object.keys(OBJETOS_REAIS) as NonNullable<OpcaoDeForma["objeto"]>[])
    .find(k => OBJETOS_REAIS[k] === forma);
}

export function construirFormaSpec(nivel: number, sorteio: () => number): FormaSpec {
  const quantas = opcoesDoNivel(nivel);
  const gira = giraNoNivel(nivel);
  const varia = variaAparenciaNoNivel(nivel);
  const mundoReal = mundoRealNoNivel(nivel);
  const mistura = misturaRepresentacoesNoNivel(nivel);

  const possiveis = alvosPossiveis(nivel);
  const alvo = possiveis[Math.floor(sorteio() * possiveis.length) % possiveis.length];
  const outras = embaralhar(FORMAS.filter(f => f !== alvo), sorteio).slice(0, quantas - 1);

  function montar(figura: Forma, ehOAlvo: boolean): OpcaoDeForma {
    const giro = gira && aceitaGiro(figura) && (ehOAlvo || sorteio() < 0.6)
      ? anguloDe(figura, sorteio)
      : 0;
    return {
      figura,
      giro,
      tamanho: varia ? 48 + Math.floor(sorteio() * 29) : 64,
      cor: varia ? CORES[Math.floor(sorteio() * CORES.length) % CORES.length] : COR_PADRAO,
    };
  }

  let opcoes = embaralhar([montar(alvo, true), ...outras.map(f => montar(f, false))], sorteio);

  if (mundoReal) {
    opcoes = opcoes.map(o => ({ ...o, objeto: objetoDaForma(o.figura) }));
  } else if (mistura) {
    // Exatamente metade real e metade pura, com os índices sorteados. Assim o
    // alvo pode cair em qualquer representação e nenhuma posição vira pista.
    const indicesReais = new Set(
      embaralhar(opcoes.map((_o, i) => i), sorteio).slice(0, Math.floor(opcoes.length / 2)),
    );
    opcoes = opcoes.map((o, i) => indicesReais.has(i)
      ? { ...o, objeto: objetoDaForma(o.figura) }
      : o);
  }

  const enunciado = FALAS.pergunta(alvo);
  return {
    nivel,
    alvo,
    opcoes,
    alvoGirado: opcoes.find(o => o.figura === alvo)!.giro !== 0,
    misturaRepresentacoes: mistura,
    enunciado,
    falado: enunciado,
    resposta: alvo,
  };
}

export function respostaApareceUmaVez(spec: FormaSpec): boolean {
  return spec.opcoes.filter(o => o.figura === spec.resposta).length === 1;
}

export function alvoGiradoQuandoDeve(spec: FormaSpec): boolean {
  if (!giraNoNivel(spec.nivel)) return true;
  return spec.alvoGirado;
}

export function representacoesMistasQuandoDeve(spec: FormaSpec): boolean {
  if (!misturaRepresentacoesNoNivel(spec.nivel)) return true;
  const reais = spec.opcoes.filter(o => o.objeto !== undefined).length;
  return reais > 0 && reais < spec.opcoes.length;
}

export function conteineresIdenticos(): number {
  return LADO_DO_CONTEINER;
}
''')

write('src/components/primitives/FormaStage.tsx', '''import React from "react";
import { motion } from "motion/react";
import { PalcoEscalado } from "./PalcoEscalado";
import { FiguraDesenhada } from "./ShapeCanvas";
import { FormaSpec, LADO_DO_CONTEINER, OpcaoDeForma, VAO } from "../../curriculum/procedimentos/formaContract";
import { AcaoDeForma, descricaoDeLados, FALAS, Forma, NOME } from "../../curriculum/procedimentos/formaProcedure";

const DURACAO_ERRO = 2500;
const DURACAO_ACERTO = 2200;

type Fase = "idle" | "erro" | "acerto" | "fecho";

interface Props {
  spec: FormaSpec;
  onAnswer?: (valor: string, acao: AcaoDeForma) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: {
    destacarTodas?: boolean;
    /** Demonstra semanticamente A FORMA CERTA da questão atual. */
    contarLadosAlvo?: boolean;
    /** Gira somente A FORMA CERTA da questão atual. */
    girarAlvo?: boolean;
  } | null;
}

const MARCADORES: Record<Forma, Array<{ left: string; top: string }>> = {
  circulo: [],
  triangulo: [
    { left: "50%", top: "8%" },
    { left: "18%", top: "70%" },
    { left: "82%", top: "70%" },
  ],
  quadrado: [
    { left: "50%", top: "9%" },
    { left: "88%", top: "50%" },
    { left: "50%", top: "88%" },
    { left: "12%", top: "50%" },
  ],
  retangulo: [
    { left: "50%", top: "18%" },
    { left: "88%", top: "50%" },
    { left: "50%", top: "82%" },
    { left: "12%", top: "50%" },
  ],
};

function MarcadoresDeLados({ forma, giro }: { forma: Forma; giro: number }) {
  if (forma === "circulo") {
    return (
      <span
        data-forma-side-zero
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 px-2 py-1 text-[11px] font-black text-blue-700 shadow"
      >
        0 lados
      </span>
    );
  }
  return (
    <span
      aria-hidden
      data-forma-side-markers
      className="pointer-events-none absolute inset-0"
      style={{ transform: `rotate(${giro}deg)`, transformOrigin: "center" }}
    >
      {MARCADORES[forma].map((p, i) => (
        <span
          key={i}
          data-forma-side-marker
          className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow"
          style={p}
        >
          {i + 1}
        </span>
      ))}
    </span>
  );
}

function MiniForma({ opcao }: { opcao: OpcaoDeForma }) {
  return (
    <div className="relative flex h-[76px] w-[92px] items-center justify-center rounded-xl border-2 border-slate-200 bg-white">
      <FiguraDesenhada
        figura={opcao.figura}
        giro={opcao.giro}
        tamanho={Math.min(54, opcao.tamanho)}
        cor={opcao.cor}
        objeto={opcao.objeto}
      />
    </div>
  );
}

function ComparacaoDoErro({ escolhida, certa }: { escolhida: OpcaoDeForma; certa: OpcaoDeForma }) {
  return (
    <div
      data-forma-comparison
      aria-live="polite"
      className="flex w-full items-stretch justify-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50/90 p-2"
    >
      {[{ titulo: "Você tocou", opcao: escolhida }, { titulo: "Compare com", opcao: certa }].map(({ titulo, opcao }) => (
        <div key={titulo} className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <span className="text-[11px] font-black text-slate-500">{titulo}</span>
          <MiniForma opcao={opcao} />
          <span className="text-[12px] font-black text-slate-700">{descricaoDeLados(opcao.figura)}</span>
        </div>
      ))}
    </div>
  );
}

export function FormaStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [fase, setFase] = React.useState<Fase>("idle");
  const [escolhida, setEscolhida] = React.useState<number | null>(null);
  const [entradaSeq, setEntradaSeq] = React.useState(0);
  const timers = React.useRef<number[]>([]);

  const limparTimers = React.useCallback(() => {
    timers.current.forEach(id => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const agendar = React.useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  React.useEffect(() => {
    limparTimers();
    setFase("idle");
    setEscolhida(null);
    setEntradaSeq(n => n + 1);
    return limparTimers;
  }, [spec, limparTimers]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || fase !== "idle" || emAula;
  const corretaIdx = spec.opcoes.findIndex(o => o.figura === spec.resposta);
  const escolhidaOpcao = escolhida == null ? null : spec.opcoes[escolhida];
  const corretaOpcao = spec.opcoes[corretaIdx];

  function acaoDa(opcao: OpcaoDeForma): AcaoDeForma {
    return {
      pedida: spec.alvo,
      escolhida: opcao.figura,
      pedidaGirada: spec.alvoGirado,
      escolhidaEmPe: opcao.giro === 0,
    };
  }

  function responder(i: number) {
    if (travado) return;
    const opcao = spec.opcoes[i];
    const certo = opcao.figura === spec.resposta;
    setEscolhida(i);

    if (!certo) {
      setFase("erro");
      falar?.(FALAS.erroSuave(opcao.figura, spec.resposta));
      onAnswer?.(opcao.figura, acaoDa(opcao));
      agendar(() => {
        setEscolhida(null);
        setFase("idle");
      }, DURACAO_ERRO);
      return;
    }

    setFase("acerto");
    falar?.(FALAS.acerto(opcao.figura));
    // Publica antes do cinema: RT mede decisão, não os 2,2s de animação.
    onAnswer?.(opcao.figura, acaoDa(opcao));
    agendar(() => setFase("fecho"), DURACAO_ACERTO);
  }

  const colunas = spec.opcoes.length === 4 ? 2 : spec.opcoes.length;

  return (
    <PalcoEscalado>
      <div className="flex flex-col items-center gap-3 select-none">
        <div
          role="group"
          aria-label="As formas"
          className="grid justify-center"
          style={{ gridTemplateColumns: `repeat(${colunas}, ${LADO_DO_CONTEINER}px)`, gap: VAO }}
        >
          {spec.opcoes.map((o, i) => {
            const certa = i === corretaIdx;
            const selecionada = i === escolhida;
            const erroEscolhido = fase === "erro" && selecionada && !certa;
            const mostrarCertaNoErro = fase === "erro" && certa;
            const sucesso = (fase === "acerto" || fase === "fecho") && certa;
            const tutorialTodas = emAula && mostrar?.destacarTodas;
            const tutorialAlvo = emAula && certa && (mostrar?.contarLadosAlvo || mostrar?.girarAlvo);
            const rodando = (fase === "acerto" && certa) || Boolean(emAula && certa && mostrar?.girarAlvo);
            const mostraLados = sucesso || Boolean(emAula && certa && mostrar?.contarLadosAlvo);

            let opacity = 1;
            if (fase === "erro" && !erroEscolhido && !mostrarCertaNoErro) opacity = 0.28;
            if (fase === "fecho" && !certa) opacity = 0;
            if (emAula && (mostrar?.contarLadosAlvo || mostrar?.girarAlvo) && !certa) opacity = 0.28;

            const borderColor = erroEscolhido
              ? "#F97316"
              : (mostrarCertaNoErro || sucesso)
                ? "#16A34A"
                : tutorialAlvo
                  ? "#2563EB"
                  : tutorialTodas
                    ? "#60A5FA"
                    : "#C7D7F0";

            return (
              <motion.button
                key={`${entradaSeq}-${o.figura}-${i}`}
                type="button"
                data-forma-figura={o.figura}
                data-forma-representacao={o.objeto ? "real" : "pura"}
                data-forma-spinning={rodando ? "true" : undefined}
                data-forma-close={fase === "fecho" && certa ? "true" : undefined}
                disabled={travado}
                onClick={() => responder(i)}
                aria-label={NOME[o.figura]}
                className="relative flex items-center justify-center overflow-visible rounded-2xl"
                style={{
                  width: LADO_DO_CONTEINER,
                  height: LADO_DO_CONTEINER,
                  backgroundColor: tutorialTodas || tutorialAlvo ? "rgba(37,99,235,0.08)" : "#F8FAFC",
                  border: `${tutorialAlvo ? 4 : 3}px solid ${borderColor}`,
                  boxShadow: tutorialAlvo ? "0 0 0 5px rgba(37,99,235,0.10)" : "none",
                  padding: 0,
                }}
                initial={{ opacity: 0, scale: 0.82, rotate: i % 2 === 0 ? -8 : 8 }}
                animate={{
                  opacity,
                  scale: sucesso ? 1.08 : (tutorialAlvo ? [1, 1.06, 1] : 1),
                  rotate: rodando ? 360 : 0,
                  x: erroEscolhido ? [0, -6, 6, 0] : 0,
                }}
                transition={rodando
                  ? { duration: fase === "acerto" ? 2.2 : 1.6, ease: "easeInOut" }
                  : erroEscolhido
                    ? { duration: 0.4 }
                    : { duration: 0.55, delay: i * 0.14 }}
              >
                <FiguraDesenhada
                  figura={o.figura}
                  giro={o.giro}
                  tamanho={o.tamanho}
                  cor={o.cor}
                  objeto={o.objeto}
                />
                {mostraLados && <MarcadoresDeLados forma={o.figura} giro={o.giro} />}
                {fase === "fecho" && certa && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-[12px] font-black text-blue-800 shadow">
                    {descricaoDeLados(o.figura)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {fase === "erro" && escolhidaOpcao && corretaOpcao && (
          <ComparacaoDoErro escolhida={escolhidaOpcao} certa={corretaOpcao} />
        )}
      </div>
    </PalcoEscalado>
  );
}
''')

# ---------------------------------------------------------------------------
# Procedure + contract tests: lock the curricular frontier and L5 transfer.
# ---------------------------------------------------------------------------
write('src/curriculum/procedimentos/formaProcedure.test.ts', '''import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ANGULOS,
  FALAS,
  FORMAS,
  LADOS,
  aceitaGiro,
  diagnosticar,
  dominou,
  giraNoNivel,
  misturaRepresentacoesNoNivel,
  mundoRealNoNivel,
  opcoesDoNivel,
  variaAparenciaNoNivel,
} from "./formaProcedure";
import {
  LADO_DO_CONTEINER,
  OBJETOS_REAIS,
  alvoGiradoQuandoDeve,
  alvosPossiveis,
  construirFormaSpec,
  representacoesMistasQuandoDeve,
  respostaApareceUmaVez,
} from "./formaContract";
import { GE_02 } from "../fichas/jornada/GE.02";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

const CANONE = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
).replace(/\*\*/g, "");

const GRAFO_GE = readFileSync(join(__dirname, "..", "..", "..", "curriculum", "GE.yaml"), "utf8");

describe("F48 §5 — escada corrigida dentro de GE.02", () => {
  it.each([
    [1, false, false, false, false, 3],
    [2, true, false, false, false, 3],
    [3, true, true, false, false, 4],
    [4, true, true, true, false, 4],
    [5, true, true, false, true, 4],
  ])("nível %i: gira %s varia %s real %s mista %s opções %i", (n, gira, varia, real, mista, opcoes) => {
    expect(giraNoNivel(n)).toBe(gira);
    expect(variaAparenciaNoNivel(n)).toBe(varia);
    expect(mundoRealNoNivel(n)).toBe(real);
    expect(misturaRepresentacoesNoNivel(n)).toBe(mista);
    expect(opcoesDoNivel(n)).toBe(opcoes);
  });

  it("⚠️ GE.02 não invade GE.04: todo nível da F48 continua plano", () => {
    expect(GRAFO_GE).toContain("id: GE.02");
    expect(GRAFO_GE).toContain("titulo: Formas planas básicas");
    expect(GRAFO_GE).toContain("id: GE.04");
    expect(GRAFO_GE).toContain("titulo: Sólidos geométricos");
    for (const n of [1, 2, 3, 4, 5]) {
      for (const s of SEMENTES) {
        const spec = construirFormaSpec(n, semente(s));
        expect(spec.opcoes.every(o => FORMAS.includes(o.figura)), `n${n} s${s}`).toBe(true);
      }
    }
  });

  it("N5 mistura exatamente duas representações reais e duas puras", () => {
    for (const s of SEMENTES) {
      const spec = construirFormaSpec(5, semente(s));
      expect(spec.opcoes).toHaveLength(4);
      expect(spec.opcoes.filter(o => o.objeto).length).toBe(2);
      expect(spec.opcoes.filter(o => !o.objeto).length).toBe(2);
      expect(representacoesMistasQuandoDeve(spec)).toBe(true);
    }
  });

  it("o cânone registra explicitamente a retificação 2D→3D", () => {
    expect(CANONE).toContain("Retificação GE.02 × GE.04");
    expect(CANONE).toContain("mistura de representações planas");
  });
});

describe("o giro, assunto da ficha", () => {
  it("círculo não finge ter orientação", () => {
    expect(aceitaGiro("circulo")).toBe(false);
    expect(ANGULOS.circulo).toEqual([0]);
  });

  it("quadrado inclui 45° — o caso que parece losango", () => {
    expect(ANGULOS.quadrado).toContain(45);
  });

  it("desde o nível 2 a resposta certa é realmente girada", () => {
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        expect(alvoGiradoQuandoDeve(construirFormaSpec(n, semente(s))), `n${n} s${s}`).toBe(true);
      }
    }
  });

  it("o alvo girável nunca é círculo nos níveis 2–5", () => {
    for (const n of [2, 3, 4, 5]) expect(alvosPossiveis(n)).not.toContain("circulo");
  });
});

describe("a cena", () => {
  it("resposta aparece uma vez e contêiner nunca muda de tamanho", () => {
    expect(LADO_DO_CONTEINER).toBeGreaterThanOrEqual(80);
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        const spec = construirFormaSpec(n, semente(s));
        expect(respostaApareceUmaVez(spec), `n${n} s${s}`).toBe(true);
        expect(spec.opcoes).toHaveLength(opcoesDoNivel(n));
        expect(spec.opcoes.every(o => o.tamanho < LADO_DO_CONTEINER)).toBe(true);
      }
    }
  });

  it("N4 põe todas as formas dentro de objetos coerentes", () => {
    for (const s of SEMENTES) {
      const spec = construirFormaSpec(4, semente(s));
      expect(spec.opcoes.every(o => o.objeto !== undefined)).toBe(true);
      expect(spec.opcoes.every(o => OBJETOS_REAIS[o.objeto!] === o.figura)).toBe(true);
    }
  });

  it("N1–2 não usam cor/tamanho como pista", () => {
    for (const s of SEMENTES) {
      for (const n of [1, 2]) {
        const spec = construirFormaSpec(n, semente(s));
        expect(new Set(spec.opcoes.map(o => o.cor)).size).toBe(1);
        expect(new Set(spec.opcoes.map(o => o.tamanho)).size).toBe(1);
      }
    }
  });

  it("500 amostras sem exceção", () => {
    for (let i = 0; i < 500; i += 1) {
      expect(() => construirFormaSpec((i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });
});

describe("§6 — diagnóstico", () => {
  const base = { pedida: "triangulo", escolhida: "triangulo", pedidaGirada: true, escolhidaEmPe: false } as const;

  it("acerto não gera hipótese", () => expect(diagnosticar(base)).toBeUndefined());

  it("certa girada + escolhida em pé é SO_ORIENTACAO_PADRAO", () => {
    expect(diagnosticar({ ...base, escolhida: "circulo", escolhidaEmPe: true }))
      .toBe(MisconceptionTag.SO_ORIENTACAO_PADRAO);
  });

  it("quadrado/retângulo tem hipótese própria quando giro não explica", () => {
    expect(diagnosticar({ pedida: "quadrado", escolhida: "retangulo", pedidaGirada: false, escolhidaEmPe: false }))
      .toBe(MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO);
  });

  it("o restante é IGNORA_LADOS", () => {
    expect(diagnosticar({ pedida: "triangulo", escolhida: "circulo", pedidaGirada: false, escolhidaEmPe: false }))
      .toBe(MisconceptionTag.IGNORA_LADOS);
  });
});

describe("§7–§9", () => {
  it("howto não contradiz o alvo sorteado", () => {
    expect(FALAS.howto.toLowerCase()).not.toContain("triângulo");
    expect(FALAS.howto).toContain("contorno");
  });

  it("quadrado × retângulo recebe feedback que realmente distingue os dois", () => {
    const fala = FALAS.erroSuave("quadrado", "retangulo");
    expect(fala).toContain("quatro lados iguais");
    expect(fala).toContain("dois longos e dois curtos");
  });

  it("círculo tem zero lados", () => expect(LADOS.circulo).toBe(0));

  it("domínio exige pelo menos um acerto girado", () => {
    const a = (g: boolean) => ({ pedida: "triangulo", escolhida: "triangulo", pedidaGirada: g, escolhidaEmPe: false } as const);
    expect(dominou([a(false), a(false), a(false)])).toBe(false);
    expect(dominou([a(false), a(false), a(true)])).toBe(true);
  });

  it("a coreografia usa o alvo semântico, não triângulo fixo", () => {
    const beats = GE_02.micros.find(m => m.id === "giradas")!.params.tutorial as { fala?: string; show?: Record<string, unknown> }[];
    expect(beats.some(b => b.show?.destacarTodas === true)).toBe(true);
    expect(beats.some(b => b.show?.contarLadosAlvo === true)).toBe(true);
    expect(beats.some(b => b.show?.girarAlvo === true)).toBe(true);
    expect(beats.map(b => b.fala).join(" ").toLowerCase()).not.toContain("triângulo");
  });
});
''')

write('src/components/primitives/FormaStage.f48.test.tsx', '''// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GE_02 } from "../../curriculum/fichas/jornada/GE.02";
import { FormaSpec } from "../../curriculum/procedimentos/formaContract";
import { FormaStage } from "./FormaStage";

const spec = (lvl: number) => Composer.generate(GE_02, lvl).uiProps as FormaSpec;

function botao(container: HTMLElement, figura: string) {
  const el = container.querySelector<HTMLButtonElement>(`button[data-forma-figura="${figura}"]`);
  if (!el) throw new Error(`figura ${figura} ausente`);
  return el;
}

afterEach(() => vi.useRealTimers());

describe("FormaStage — F48", () => {
  it("erro mostra comparação de propriedades e devolve retry após 2,5s", () => {
    vi.useFakeTimers();
    const s = spec(2);
    const errada = s.opcoes.find(o => o.figura !== s.resposta)!;
    const onAnswer = vi.fn();
    const falar = vi.fn();
    const { container } = render(<FormaStage spec={s} onAnswer={onAnswer} falar={falar} />);

    fireEvent.click(botao(container, errada.figura));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(container.querySelector("[data-forma-comparison]")).toBeTruthy();
    expect(botao(container, s.resposta).disabled).toBe(true);

    act(() => vi.advanceTimersByTime(2500));
    expect(container.querySelector("[data-forma-comparison]")).toBeNull();
    expect(botao(container, s.resposta).disabled).toBe(false);
  });

  it("acerto publica antes do cinema, gira só a certa e fecha com lados marcados", () => {
    vi.useFakeTimers();
    const s = spec(2);
    const onAnswer = vi.fn();
    const { container } = render(<FormaStage spec={s} onAnswer={onAnswer} />);

    fireEvent.click(botao(container, s.resposta));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(botao(container, s.resposta).getAttribute("data-forma-spinning")).toBe("true");
    expect(container.querySelectorAll("[data-forma-spinning=true]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-forma-side-marker]").length).toBeGreaterThan(0);

    act(() => vi.advanceTimersByTime(2200));
    expect(botao(container, s.resposta).getAttribute("data-forma-close")).toBe("true");
  });

  it("tutorial destacarTodas é visível, contarLados foca a certa e girarAlvo não gira distratores", () => {
    const s = spec(2);
    const a = render(<FormaStage spec={s} mostrar={{ destacarTodas: true }} />);
    const todos = [...a.container.querySelectorAll<HTMLButtonElement>('button[data-forma-figura]')];
    expect(todos.every(x => x.style.borderColor === "rgb(96, 165, 250)")).toBe(true);
    a.unmount();

    const b = render(<FormaStage spec={s} mostrar={{ contarLadosAlvo: true }} />);
    expect(b.container.querySelectorAll("[data-forma-side-marker]").length).toBeGreaterThan(0);
    b.unmount();

    const c = render(<FormaStage spec={s} mostrar={{ girarAlvo: true }} />);
    expect(c.container.querySelectorAll("[data-forma-spinning=true]")).toHaveLength(1);
  });

  it("trocar spec limpa erro e fecho anteriores", () => {
    vi.useFakeTimers();
    const s1 = spec(2);
    const s2 = spec(3);
    const { container, rerender } = render(<FormaStage spec={s1} />);
    fireEvent.click(botao(container, s1.resposta));
    act(() => vi.advanceTimersByTime(2200));
    expect(container.querySelector("[data-forma-close=true]")).toBeTruthy();

    rerender(<FormaStage spec={s2} />);
    expect(container.querySelector("[data-forma-close=true]")).toBeNull();
    expect(botao(container, s2.resposta).disabled).toBe(false);
  });

  it("N5 traz duas representações reais e duas puras, todas planas", () => {
    const s = spec(5);
    const { container } = render(<FormaStage spec={s} />);
    expect(container.querySelectorAll('[data-forma-representacao="real"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-forma-representacao="pura"]')).toHaveLength(2);
    expect(screen.queryByText(/cubo|esfera|cilindro/i)).toBeNull();
  });
});
''')

write('src/components/gameloop/formaAuthorialPolicy.test.ts', '''import { describe, expect, it } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GE_01 } from "../../curriculum/fichas/jornada/GE.01";
import { GE_02 } from "../../curriculum/fichas/jornada/GE.02";
import { Question } from "../../types";
import { authorialFeedbackHoldMs, ownsAuthorialFeedback, ownsAuthorialRetry } from "./answerPolicy";

const q47 = Composer.generate(GE_01, 1) as Question;
const q48 = Composer.generate(GE_02, 2) as Question;

describe("autoria ShapeCanvas por metadado, não por kind", () => {
  it("F48 é dona do retry/feedback e conserva 2,2s + 1,5s do cinema", () => {
    const meta = { forma: { pedida: "quadrado", escolhida: "retangulo", pedidaGirada: true, escolhidaEmPe: true } } as any;
    expect(ownsAuthorialRetry(q48, meta)).toBe(true);
    expect(ownsAuthorialFeedback(q48, meta)).toBe(true);
    expect(authorialFeedbackHoldMs(q48, meta)).toBe(3700);
  });

  it("F47 mantém sua política própria de 3,3s", () => {
    const meta = { posicao: { pedida: "em cima", escolhida: "embaixo", par: "cima-baixo" } } as any;
    expect(ownsAuthorialRetry(q47, meta)).toBe(true);
    expect(authorialFeedbackHoldMs(q47, meta)).toBe(3300);
  });

  it("meta de forma não sequestra uma cena de posição", () => {
    expect(ownsAuthorialRetry(q47, { forma: {} } as any)).toBe(false);
  });
});
''')

# ---------------------------------------------------------------------------
# GameLoop policy: F48 owns its timing and soft feedback, F47 remains distinct.
# ---------------------------------------------------------------------------
p = ROOT / 'src/components/gameloop/answerPolicy.ts'
s = p.read_text(encoding='utf-8')
s = s.replace(
'''    || (q.kind === "touchplace" && meta?.touchplace !== undefined)\n    || (q.kind === "shapecanvas" && meta?.posicao !== undefined);''',
'''    || (q.kind === "touchplace" && meta?.touchplace !== undefined)\n    || (q.kind === "shapecanvas" && meta?.posicao !== undefined)\n    || (q.kind === "shapecanvas" && meta?.forma !== undefined);'''
)
# The same source block occurs twice (retry + feedback); replace catches both.
old = '''  if (q.kind === "shapecanvas" && meta?.posicao !== undefined) {\n    // F47 §4: 1,8s de relação/seta + 1,5s de fecho rotulado.\n    return 3300;\n  }\n  // F05 e F04 já fecham seus roteiros dentro desta janela histórica.\n  return 1500;'''
new = '''  if (q.kind === "shapecanvas" && meta?.posicao !== undefined) {\n    // F47 §4: 1,8s de relação/seta + 1,5s de fecho rotulado.\n    return 3300;\n  }\n  if (q.kind === "shapecanvas" && meta?.forma !== undefined) {\n    // F48 §4: 2,2s de giro/contagem + 1,5s de fecho numerado.\n    return 3700;\n  }\n  // F05 e F04 já fecham seus roteiros dentro desta janela histórica.\n  return 1500;'''
if old not in s:
    raise SystemExit('answerPolicy: hold block not found')
s = s.replace(old, new)
p.write_text(s, encoding='utf-8')

# ---------------------------------------------------------------------------
# Canonical F48 retification. Explicit, synchronized, never silent.
# ---------------------------------------------------------------------------
p = ROOT / 'AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md'
s = p.read_text(encoding='utf-8')
old_row = '| 5 | **formas 3D** (cubo, esfera, cilindro) |'
new_row = '| 5 | **mistura de representações planas** — formas puras e formas dentro de objetos, com giro, cor e tamanho já conhecidos |'
if old_row not in s:
    raise SystemExit('F48 canonical level 5 row not found')
s = s.replace(old_row, new_row, 1)
marker = new_row + '\n\n## 6. Diagnóstico'
ret = new_row + '''\n\n> **Retificação GE.02 × GE.04 — ago/2026.** A versão anterior colocava cubo, esfera e cilindro no nível 5. O grafo, porém, define `GE.02` como **formas planas básicas** e reserva `GE.04`/F59 para **sólidos geométricos**. Manter os sólidos aqui duplicava a competência sucessora e saltava a fronteira do grafo. O nível 5 passa a testar transferência/invariância combinando apenas representações 2D já ensinadas; os sólidos permanecem integralmente em GE.04.\n\n## 6. Diagnóstico'''
if marker not in s:
    raise SystemExit('F48 canonical retification marker not found')
s = s.replace(marker, ret, 1)
old_howto = '**howto:** *"Conte os lados. O triângulo sempre tem três, esteja em qualquer posição."*'
new_howto = '**howto:** *"Olhe o contorno. Se houver lados, conte; mesmo virada, a forma continua a mesma."*'
if old_howto not in s:
    raise SystemExit('F48 howto not found')
s = s.replace(old_howto, new_howto, 1)
old_core = '''  { fala: "Procuramos o triângulo.",  mostra: { destacarTodas: true },   sync: "junto" },\n  { fala: "Ele tem três lados.",      mostra: { contarLados: 3 },        sync: "junto" },\n  { fala: "Mesmo virado, é triângulo!", mostra: { girarForma: 360 },     sync: "depois" }'''
new_core = '''  { fala: "Procure a forma que eu pedi.", mostra: { destacarTodas: true },      sync: "junto" },\n  { fala: "Conte os lados da forma certa.", mostra: { contarLadosAlvo: true }, sync: "junto" },\n  { fala: "Mesmo virada, ela continua sendo a mesma forma!", mostra: { girarAlvo: true }, sync: "depois" }'''
if old_core not in s:
    raise SystemExit('F48 canonical choreography not found')
s = s.replace(old_core, new_core, 1)
p.write_text(s, encoding='utf-8')

# ---------------------------------------------------------------------------
# Permanent sonda: all three tutorial beats become first-class scenes.
# ---------------------------------------------------------------------------
p = ROOT / 'sonda/cenas.tsx'
s = p.read_text(encoding='utf-8')
old = '''  {\n    nome: "GE.02 micro-aula: mesmo virado é triângulo",\n    render: (s: number) => (\n      <ExercicioDaFicha ficha={GE_02} lvl={2} semente={s} mostrar={{ girarForma: 360 }} />\n    ),\n  },'''
new = '''  {\n    nome: "GE.02 micro-aula: procurar a forma",\n    render: (s: number) => <ExercicioDaFicha ficha={GE_02} lvl={2} semente={s} mostrar={{ destacarTodas: true }} />,\n  },\n  {\n    nome: "GE.02 micro-aula: contar os lados do alvo",\n    render: (s: number) => <ExercicioDaFicha ficha={GE_02} lvl={2} semente={s} mostrar={{ contarLadosAlvo: true }} />,\n  },\n  {\n    nome: "GE.02 micro-aula: girar somente o alvo",\n    render: (s: number) => <ExercicioDaFicha ficha={GE_02} lvl={2} semente={s} mostrar={{ girarAlvo: true }} />,\n  },'''
if old not in s:
    raise SystemExit('sonda GE.02 tutorial block not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

# ---------------------------------------------------------------------------
# Persistent handoff note. Idempotent for reruns.
# ---------------------------------------------------------------------------
p = ROOT / 'AI_Studio_Lab/codex/RETOMADA.md'
s = p.read_text(encoding='utf-8')
sentinel = '### Checkpoint Codex — F48/GE.02: fronteira 2D→3D explicitada'
if sentinel not in s:
    s += '''\n\n### Checkpoint Codex — F48/GE.02: fronteira 2D→3D explicitada\n\nA auditoria sistêmica da F48 encontrou uma contradição entre artefatos canônicos: a ficha punha sólidos no nível 5 de `GE.02`, enquanto `curriculum/GE.yaml` define `GE.02` como **formas planas básicas** e `GE.04` como **sólidos geométricos**; a F59 confirma que cubo/esfera/cilindro pertencem à GE.04. A ficha foi retificada de forma explícita: o nível 5 agora mistura representações planas já aprendidas (pura + objeto do mundo, giro, cor e tamanho), testando transferência sem introduzir vocabulário 3D.\n\nA mesma auditoria encontrou problemas independentes no palco: erro sem retry autoral, abertura cinematográfica ausente, comparação de erro incompleta, coreografia fixa em “triângulo” apesar de alvo sorteado, `destacarTodas` inerte, contagem de lados apenas textual e giro aplicado a todas as opções. A correção mantém `ShapeCanvas` compartilhado com F47 sem misturar as duas semânticas: `AnswerMeta.forma` identifica a autoria da F48; `AnswerMeta.posicao` continua identificando a F47.\n'''
p.write_text(s, encoding='utf-8')

print('F48 candidate written')
