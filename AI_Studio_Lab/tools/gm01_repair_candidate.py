from pathlib import Path

ROOT = Path('.')

def write(path: str, content: str) -> None:
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')

# ---------------------------------------------------------------------------
# Procedimento F49 — cada atributo tem um eixo real de comparação.
# ---------------------------------------------------------------------------
write('src/curriculum/procedimentos/grandezaProcedure.ts', '''import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";

/** F49 — comparação direta de grandezas com uma referência justa. */
export type Atributo = "altura" | "comprimento" | "tamanho";
export type Polo = "maior" | "menor";
export type EixoDaGrandeza = "vertical" | "horizontal" | "uniforme";

interface DegrauDaF49 {
  atributo: Atributo;
  diferenca: number;
  objetosDiferentes: boolean;
  seria: boolean;
  reguaFantasma: boolean;
}

/**
 * §5. Uma coisa nova por vez:
 * - L1 aprende a comparação vertical;
 * - L2 troca somente o eixo: comprimento;
 * - L3 mantém altura e reduz a diferença;
 * - L4 mantém altura e troca a identidade dos objetos;
 * - L5 mantém uma única identidade visual e introduz só a SERIAÇÃO.
 */
const DEGRAUS: Record<number, DegrauDaF49> = {
  1: { atributo: "altura", diferenca: 0.45, objetosDiferentes: false, seria: false, reguaFantasma: false },
  2: { atributo: "comprimento", diferenca: 0.40, objetosDiferentes: false, seria: false, reguaFantasma: false },
  3: { atributo: "altura", diferenca: 0.14, objetosDiferentes: false, seria: false, reguaFantasma: true },
  4: { atributo: "altura", diferenca: 0.22, objetosDiferentes: true, seria: false, reguaFantasma: true },
  5: { atributo: "tamanho", diferenca: 0.20, objetosDiferentes: false, seria: true, reguaFantasma: true },
};

function degrau(nivel: number): DegrauDaF49 {
  return DEGRAUS[Math.min(5, Math.max(1, Math.round(nivel)))];
}

export const atributoDoNivel = (n: number): Atributo => degrau(n).atributo;
export const diferencaDoNivel = (n: number): number => degrau(n).diferenca;
export const objetosDiferentesNoNivel = (n: number): boolean => degrau(n).objetosDiferentes;
export const seriaNoNivel = (n: number): boolean => degrau(n).seria;
export const reguaFantasmaNoNivel = (n: number): boolean => degrau(n).reguaFantasma;
export const quantosNoNivel = (n: number): number => (seriaNoNivel(n) ? 3 : 2);
export const diferencaPequena = (n: number): boolean => diferencaDoNivel(n) <= 0.15;

export function eixoDoAtributo(atributo: Atributo): EixoDaGrandeza {
  if (atributo === "altura") return "vertical";
  if (atributo === "comprimento") return "horizontal";
  return "uniforme";
}

export const ADJETIVO: Record<Atributo, Record<Polo, string>> = {
  altura: { maior: "mais alto", menor: "mais baixo" },
  comprimento: { maior: "mais comprido", menor: "mais curto" },
  tamanho: { maior: "maior", menor: "menor" },
};

export const FALAS = {
  pergunta: (atributo: Atributo, polo: Polo, nome: string): string =>
    `Qual ${nome} é ${ADJETIVO[atributo][polo]}?`,
  perguntaDaSeriacao: (atributo: Atributo, polo: Polo): string =>
    `Toque do ${ADJETIVO[atributo][polo]} para o ${ADJETIVO[atributo][polo === "maior" ? "menor" : "maior"]}.`,

  // §7 canônica de L1; os outros eixos recebem a mesma regra em linguagem própria.
  howto: "Olhe onde os dois começam. Agora veja qual sobe mais.",
  explain: "Compare a partir do chão. Os dois começam na mesma linha.",
  howtoDoAtributo: (atributo: Atributo): string => atributo === "comprimento"
    ? "Olhe onde os dois começam. Agora veja qual vai mais longe."
    : atributo === "tamanho"
      ? "Compare o objeto inteiro. Veja a ordem do maior para o menor."
      : "Olhe onde os dois começam. Agora veja qual sobe mais.",
  explainDoAtributo: (atributo: Atributo): string => atributo === "comprimento"
    ? "Alinhe o começo dos dois. O que termina mais longe é o mais comprido."
    : atributo === "tamanho"
      ? "Compare de dois em dois e monte a ordem sem pular nenhum."
      : "Compare a partir do chão. Os dois começam na mesma linha.",

  acerto: (atributo: Atributo, polo: Polo): string => `Isso! Esse é ${ADJETIVO[atributo][polo]}.`,
  erroSuave: (atributo: Atributo, polo: Polo): string =>
    `Olhe a linha: esse é ${ADJETIVO[atributo][polo === "maior" ? "menor" : "maior"]}.`,
};

export interface AcaoDeGrandeza {
  escolhido: number;
  certo: number;
  vencedorDoOutroAtributo: number;
  diferencaPequena: boolean;
  /** A criança decidiu antes de a referência comum terminar de aparecer. */
  antesDaReferencia: boolean;
  atributo: Atributo;
  /** L5: preserva a sequência inteira para telemetria futura sem mudar o valor-resposta. */
  ordemProduzida?: number[];
}

/** §6 — hipóteses; erro motor continua filtrado antes, no answerPolicy. */
export function diagnosticar(acao: AcaoDeGrandeza): string | undefined {
  if (acao.escolhido === acao.certo) return undefined;
  if (acao.antesDaReferencia) return MisconceptionTag.BASE_DESALINHADA;
  if (acao.vencedorDoOutroAtributo >= 0 && acao.escolhido === acao.vencedorDoOutroAtributo) {
    return MisconceptionTag.CONFUNDE_ATRIBUTOS;
  }
  if (acao.diferencaPequena) return MisconceptionTag.SO_DIFERENCA_GRANDE;
  return MisconceptionTag.CONFUNDE_ATRIBUTOS;
}

/** §9 — a retenção entre sessões mora no motor; aqui validamos a condição de conteúdo. */
export function dominou(historico: AcaoDeGrandeza[]): boolean {
  const acertos = historico.filter(a => a.escolhido === a.certo);
  return acertos.length >= 3 && acertos.some(a => a.diferencaPequena);
}

/** P13 já está integrado: esta evidência viaja answerPolicy → progressEngine. */
export function evidenciasDe(acao: AcaoDeGrandeza): string[] {
  return acao.escolhido === acao.certo && acao.diferencaPequena
    ? [Evidencia.DIFERENCA_PEQUENA]
    : [];
}
''')

# ---------------------------------------------------------------------------
# Contrato — alvo, eixo visual e resposta derivam da MESMA dimensão.
# ---------------------------------------------------------------------------
write('src/curriculum/procedimentos/grandezaContract.ts', '''import {
  Atributo,
  EixoDaGrandeza,
  FALAS,
  Polo,
  atributoDoNivel,
  diferencaDoNivel,
  diferencaPequena,
  eixoDoAtributo,
  objetosDiferentesNoNivel,
  quantosNoNivel,
  reguaFantasmaNoNivel,
  seriaNoNivel,
} from "./grandezaProcedure";

export const LARGURA_DE_PROJETO = 340;
export const LARGURA_DA_CAIXA = 150;
export const ALTURA_DA_CAIXA = 190;
export const LINHA_DO_CHAO = 168;
/** L2: ambos começam aqui; comparar comprimento sem alinhar o começo é tão inválido quanto altura sem chão. */
export const LINHA_DE_INICIO = 18;

const ALTURA_MAX = 126;
const COMPRIMENTO_MAX = 116;

export interface ObjetoDeGrandeza {
  emoji: string;
  nome: string;
  altura: number;
  comprimento: number;
}

export interface GrandezaSpec {
  nivel: number;
  atributo: Atributo;
  eixo: EixoDaGrandeza;
  polo: Polo;
  seria: boolean;
  reguaFantasma: boolean;
  objetos: ObjetoDeGrandeza[];
  resposta: number;
  ordemCerta: number[];
  vencedorDoOutroAtributo: number;
  pequena: boolean;
  enunciado: string;
  falado: string;
}

export const OBJETOS: { emoji: string; nome: string }[] = [
  { emoji: "🦕", nome: "dinossauro" },
  { emoji: "🌳", nome: "árvore" },
  { emoji: "🏠", nome: "casa" },
  { emoji: "🚀", nome: "foguete" },
  { emoji: "🐧", nome: "pinguim" },
  { emoji: "🌻", nome: "girassol" },
];

function extremo(valores: number[], polo: Polo): number {
  let melhor = 0;
  for (let i = 1; i < valores.length; i += 1) {
    if ((polo === "maior" && valores[i] > valores[melhor])
      || (polo === "menor" && valores[i] < valores[melhor])) melhor = i;
  }
  return melhor;
}

export function valorComparado(o: ObjetoDeGrandeza, atributo: Atributo): number {
  if (atributo === "altura") return o.altura;
  if (atributo === "comprimento") return o.comprimento;
  // No L5 as duas dimensões são escaladas na mesma proporção; a área só torna explícita a ordem uniforme.
  return o.altura * o.comprimento;
}

function embaralhar<T>(lista: T[], sorteio: () => number): T[] {
  const fora = [...lista];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

export function construirGrandezaSpec(nivel: number, sorteio: () => number): GrandezaSpec {
  const atributo = atributoDoNivel(nivel);
  const eixo = eixoDoAtributo(atributo);
  const polo: Polo = sorteio() < 0.5 ? "maior" : "menor";
  const seria = seriaNoNivel(nivel);
  const quantos = quantosNoNivel(nivel);
  const dif = diferencaDoNivel(nivel);

  const pool = [...OBJETOS];
  const umSo = pool[Math.floor(sorteio() * pool.length) % pool.length];
  const escolhidos = Array.from({ length: quantos }, () => {
    // L5 usa a MESMA identidade em três escalas: a única novidade é ordenar.
    if (!objetosDiferentesNoNivel(nivel)) return umSo;
    const i = Math.floor(sorteio() * pool.length) % pool.length;
    return pool.splice(i, 1)[0];
  });

  let dimensoes: Array<{ altura: number; comprimento: number }>;
  if (atributo === "altura") {
    const alturas = Array.from({ length: quantos }, (_, i) => Math.round(ALTURA_MAX * (1 - dif * i)));
    // A dimensão distratora anda ao contrário: permite observar CONFUNDE_ATRIBUTOS sem entregar a resposta.
    const comprimentos = Array.from({ length: quantos }, (_, i) => 72 + i * 30);
    dimensoes = alturas.map((altura, i) => ({ altura, comprimento: comprimentos[i] }));
  } else if (atributo === "comprimento") {
    const comprimentos = Array.from({ length: quantos }, (_, i) => Math.round(COMPRIMENTO_MAX * (1 - dif * i)));
    const alturas = Array.from({ length: quantos }, (_, i) => 72 + i * 34);
    dimensoes = comprimentos.map((comprimento, i) => ({ comprimento, altura: alturas[i] }));
  } else {
    // Seriação: escala UNIFORME. Nenhuma dimensão conta uma história diferente da outra.
    dimensoes = Array.from({ length: quantos }, (_, i) => {
      const escala = 1 - dif * i;
      return {
        altura: Math.round(118 * escala),
        comprimento: Math.round(96 * escala),
      };
    });
  }

  const ordemDesenho = embaralhar(Array.from({ length: quantos }, (_, i) => i), sorteio);
  const objetos: ObjetoDeGrandeza[] = ordemDesenho.map(posto => ({ ...escolhidos[posto], ...dimensoes[posto] }));
  const valoresAlvo = objetos.map(o => valorComparado(o, atributo));
  const ordemCerta = [...valoresAlvo.keys()].sort((a, b) =>
    polo === "maior" ? valoresAlvo[b] - valoresAlvo[a] : valoresAlvo[a] - valoresAlvo[b]);
  const resposta = ordemCerta[0];

  let vencedorDoOutroAtributo = -1;
  if (!seria) {
    const outro = atributo === "altura"
      ? objetos.map(o => o.comprimento)
      : objetos.map(o => o.altura);
    vencedorDoOutroAtributo = extremo(outro, polo);
  }

  const nome = objetosDiferentesNoNivel(nivel) ? "objeto" : objetos[0].nome;
  const enunciado = seria
    ? FALAS.perguntaDaSeriacao(atributo, polo)
    : FALAS.pergunta(atributo, polo, nome);

  return {
    nivel, atributo, eixo, polo, seria,
    reguaFantasma: reguaFantasmaNoNivel(nivel),
    objetos, resposta, ordemCerta, vencedorDoOutroAtributo,
    pequena: diferencaPequena(nivel),
    enunciado, falado: enunciado,
  };
}

export function semEmpate(spec: GrandezaSpec): boolean {
  const valores = spec.objetos.map(o => valorComparado(o, spec.atributo));
  return new Set(valores).size === valores.length;
}

export function cabeNaCaixa(spec: GrandezaSpec): boolean {
  return spec.objetos.every(o =>
    o.altura > 0 && o.altura <= LINHA_DO_CHAO - 8
    && o.comprimento > 0 && o.comprimento <= LARGURA_DA_CAIXA - LINHA_DE_INICIO - 8);
}

/** O extremo do atributo distrator precisa ser uma resposta ERRADA, senão a tag seria impossível de observar. */
export function outroAtributoContrario(spec: GrandezaSpec): boolean {
  return spec.seria || spec.vencedorDoOutroAtributo < 0 || spec.vencedorDoOutroAtributo !== spec.resposta;
}

/** Nome histórico mantido por compatibilidade; o conceito agora vale nos dois eixos. */
export const larguraContraria = outroAtributoContrario;
''')

# ---------------------------------------------------------------------------
# Grupo — acrescenta o análogo horizontal da linha de chão.
# ---------------------------------------------------------------------------
write('src/components/primitives/Grupo.tsx', '''import React from 'react';
import { motion } from 'motion/react';
import { tokens } from '../../styles/tokens';

interface ReferenciaComparacao {
  linha: number;
  largura: number;
  altura: number;
  destacada?: boolean;
}

export interface GrupoProps {
  items: React.ReactNode[];
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  /** F49 altura: linha horizontal comum. */
  chao?: ReferenciaComparacao;
  /** F49 comprimento: extremidade inicial comum, a mesma regra girada 90°. */
  inicio?: ReferenciaComparacao;
  rotulo?: string;
}

export function Grupo({ items, onClick, selected, disabled, chao, inicio, rotulo }: GrupoProps) {
  const referencia = chao ?? inicio;
  if (referencia) {
    const vertical = Boolean(inicio);
    return (
      <motion.button
        whileTap={disabled ? {} : { scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        aria-label={rotulo}
        data-grupo-eixo={vertical ? 'horizontal' : 'vertical'}
        className={`relative flex overflow-hidden rounded-3xl ${
          vertical ? 'items-center justify-start' : 'items-end justify-center'
        } ${selected ? 'ring-4 ring-blue-500' : ''}`}
        style={{
          width: referencia.largura,
          height: referencia.altura,
          backgroundColor: tokens.cor.superficie.fundo,
          border: `3px solid ${tokens.cor.elementos.borda}`,
          ...(vertical
            ? { paddingLeft: referencia.linha }
            : { paddingBottom: referencia.altura - referencia.linha }),
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {items}
        {chao && (
          <motion.span
            data-grupo-referencia="chao"
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              top: chao.linha,
              backgroundColor: '#E7D3B3',
              borderTop: `${chao.destacada ? 5 : 4}px solid ${chao.destacada ? '#2563EB' : '#B45309'}`,
              transformOrigin: 'left center',
              zIndex: 20,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}
        {inicio && (
          <motion.span
            data-grupo-referencia="inicio"
            aria-hidden
            className="pointer-events-none absolute inset-y-3"
            style={{
              left: inicio.linha,
              borderLeft: `${inicio.destacada ? 5 : 4}px solid ${inicio.destacada ? '#2563EB' : '#B45309'}`,
              transformOrigin: 'center top',
              zIndex: 20,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={rotulo}
      className={`relative flex flex-wrap items-center justify-center p-6 min-h-[160px] min-w-[160px] rounded-3xl transition-colors ${selected ? 'ring-4 ring-offset-4 ring-blue-500' : ''}`}
      style={{
        backgroundColor: tokens.cor.elementos.preenchimento,
        border: `2px solid ${tokens.cor.elementos.borda}`,
        cursor: disabled ? 'default' : 'pointer'
      }}
    >
      {items.map((item, i) => <div key={i} className="m-2">{item}</div>)}
    </motion.button>
  );
}
''')

# ---------------------------------------------------------------------------
# Stage F49 — fases autorais, retry, eixos, guia e seta de medida.
# ---------------------------------------------------------------------------
write('src/components/primitives/GrandezaStage.tsx', '''import React from "react";
import { motion } from "motion/react";
import { Grupo } from "./Grupo";
import { PalcoEscalado } from "./PalcoEscalado";
import {
  ALTURA_DA_CAIXA,
  GrandezaSpec,
  LARGURA_DA_CAIXA,
  LINHA_DE_INICIO,
  LINHA_DO_CHAO,
  ObjetoDeGrandeza,
  valorComparado,
} from "../../curriculum/procedimentos/grandezaContract";
import { AcaoDeGrandeza, FALAS } from "../../curriculum/procedimentos/grandezaProcedure";

const ABERTURA_MS = 1200;
const ERRO_MS = 2200;
const ACERTO_MS = 1800;
const BASE_OBJETO = 84;

type Fase = "idle" | "erro" | "acerto" | "fecho";

interface Props {
  spec: GrandezaSpec;
  onAnswer?: (valor: number, acao: AcaoDeGrandeza) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: {
    destacarLinhaBase?: boolean;
    subirLinhaTracejada?: boolean;
    destacarMaior?: boolean;
  } | null;
}

function ObjetoVisual({ o, eixo, destaque, erro, delay }: {
  o: ObjetoDeGrandeza;
  eixo: GrandezaSpec["eixo"];
  destaque: boolean;
  erro: boolean;
  delay: number;
}) {
  const sx = o.comprimento / BASE_OBJETO;
  const sy = o.altura / BASE_OBJETO;
  return (
    <motion.span
      data-grandeza-object
      data-grandeza-altura={o.altura}
      data-grandeza-comprimento={o.comprimento}
      className="relative z-10 flex h-[84px] w-[84px] items-center justify-center"
      initial={{ opacity: 0, x: eixo === "horizontal" ? -24 : 0, y: eixo === "horizontal" ? 0 : -28, scale: 0.94 }}
      animate={{
        opacity: 1,
        x: erro ? [0, -5, 5, 0] : 0,
        y: 0,
        scale: destaque ? 1.08 : 1,
      }}
      transition={erro ? { duration: 0.4 } : { duration: 0.7, delay }}
    >
      <span
        aria-hidden
        className="block text-[68px] leading-none"
        style={{
          transform: `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
          transformOrigin: eixo === "horizontal" ? "left center" : "center bottom",
        }}
      >
        {o.emoji}
      </span>
    </motion.span>
  );
}

function Guia({ spec, objeto, de, para }: {
  spec: GrandezaSpec;
  objeto: ObjetoDeGrandeza;
  de?: number;
  para?: number;
}) {
  const vertical = spec.eixo !== "horizontal";
  const alvo = vertical ? objeto.altura : objeto.comprimento;
  const inicio = de ?? alvo;
  const fim = para ?? alvo;
  if (vertical) {
    return (
      <motion.span
        data-grandeza-guide
        aria-hidden
        className="pointer-events-none absolute inset-x-2 z-30 border-t-[3px] border-dashed border-blue-600"
        initial={{ top: LINHA_DO_CHAO - inicio, opacity: 0 }}
        animate={{ top: LINHA_DO_CHAO - fim, opacity: 1 }}
        transition={{ duration: de == null ? 0.55 : 0.8, ease: "easeInOut" }}
      />
    );
  }
  return (
    <motion.span
      data-grandeza-guide
      aria-hidden
      className="pointer-events-none absolute inset-y-3 z-30 border-l-[3px] border-dashed border-blue-600"
      initial={{ left: LINHA_DE_INICIO + inicio, opacity: 0 }}
      animate={{ left: LINHA_DE_INICIO + fim, opacity: 1 }}
      transition={{ duration: de == null ? 0.55 : 0.8, ease: "easeInOut" }}
    />
  );
}

function SetaMedida({ spec, objeto }: { spec: GrandezaSpec; objeto: ObjetoDeGrandeza }) {
  if (spec.eixo === "horizontal") {
    return (
      <span
        data-grandeza-measure-arrow
        aria-hidden
        className="pointer-events-none absolute z-40 flex items-center text-blue-700"
        style={{ left: LINHA_DE_INICIO, top: 10, width: objeto.comprimento }}
      >
        <span className="text-lg leading-none">◀</span>
        <span className="h-[3px] flex-1 bg-blue-600" />
        <span className="text-lg leading-none">▶</span>
      </span>
    );
  }
  return (
    <span
      data-grandeza-measure-arrow
      aria-hidden
      className="pointer-events-none absolute z-40 flex flex-col items-center text-blue-700"
      style={{ left: 7, top: LINHA_DO_CHAO - objeto.altura, height: objeto.altura }}
    >
      <span className="text-lg leading-none">▲</span>
      <span className="w-[3px] flex-1 bg-blue-600" />
      <span className="text-lg leading-none">▼</span>
    </span>
  );
}

export function GrandezaStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [fase, setFase] = React.useState<Fase>("idle");
  const [escolhido, setEscolhido] = React.useState<number | null>(null);
  const [ordem, setOrdem] = React.useState<number[]>([]);
  const [referenciaPronta, setReferenciaPronta] = React.useState(false);
  const [entradaSeq, setEntradaSeq] = React.useState(0);
  const timers = React.useRef<number[]>([]);

  const limparTimers = React.useCallback(() => {
    timers.current.forEach(t => window.clearTimeout(t));
    timers.current = [];
  }, []);
  const agendar = React.useCallback((fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  React.useEffect(() => {
    limparTimers();
    setFase("idle");
    setEscolhido(null);
    setOrdem([]);
    setReferenciaPronta(false);
    setEntradaSeq(n => n + 1);
    const t = window.setTimeout(() => setReferenciaPronta(true), ABERTURA_MS);
    timers.current.push(t);
    return limparTimers;
  }, [spec, limparTimers]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || fase !== "idle" || emAula;

  function leitura(valor: number, ordemProduzida?: number[]): AcaoDeGrandeza {
    return {
      escolhido: valor,
      certo: spec.resposta,
      vencedorDoOutroAtributo: spec.vencedorDoOutroAtributo,
      diferencaPequena: spec.pequena,
      antesDaReferencia: !referenciaPronta,
      atributo: spec.atributo,
      ...(ordemProduzida ? { ordemProduzida } : {}),
    };
  }

  function resolver(valor: number, certo: boolean, ordemProduzida?: number[]) {
    setEscolhido(valor >= 0 ? valor : ordemProduzida?.[ordemProduzida.length - 1] ?? null);
    if (!certo) {
      setFase("erro");
      falar?.(FALAS.erroSuave(spec.atributo, spec.polo));
      onAnswer?.(valor, leitura(valor, ordemProduzida));
      agendar(() => {
        setFase("idle");
        setEscolhido(null);
        setOrdem([]);
      }, ERRO_MS);
      return;
    }
    setFase("acerto");
    falar?.(FALAS.acerto(spec.atributo, spec.polo));
    onAnswer?.(valor, leitura(valor, ordemProduzida));
    agendar(() => setFase("fecho"), ACERTO_MS);
  }

  function tocar(i: number) {
    if (travado) return;
    if (!spec.seria) {
      resolver(i, i === spec.resposta);
      return;
    }
    if (ordem.includes(i)) return;
    const nova = [...ordem, i];
    setOrdem(nova);
    if (nova.length < spec.objetos.length) return;
    const certo = nova.every((v, k) => v === spec.ordemCerta[k]);
    // Nunca reutilize o primeiro item como valor de erro: uma ordem errada pode começar certo.
    resolver(certo ? spec.resposta : -1, certo, nova);
  }

  const medidas = spec.objetos.map(o => valorComparado(o, spec.atributo));
  const menorIdx = medidas.indexOf(Math.min(...medidas));
  const objetoMenor = spec.objetos[menorIdx];
  const mostrarGuiaNormal = referenciaPronta && (
    spec.reguaFantasma || fase === "fecho" || Boolean(emAula && mostrar?.subirLinhaTracejada)
  );
  const escolhidoObj = escolhido != null && escolhido >= 0 ? spec.objetos[escolhido] : null;
  const corretoObj = spec.objetos[spec.resposta];

  return (
    <PalcoEscalado>
      <div className="flex flex-col items-center gap-2 select-none" data-grandeza-stage data-grandeza-eixo={spec.eixo}>
        <div className="flex items-end justify-center" style={{ gap: 14 }}>
          {spec.objetos.map((o, i) => {
            const naOrdem = spec.seria ? ordem.indexOf(i) : -1;
            const certoVisual = fase === "acerto" && i === spec.resposta;
            const erroVisual = fase === "erro" && escolhido === i;
            const destaqueAula = Boolean(emAula && mostrar?.destacarMaior && i === spec.resposta);
            const ref = {
              largura: LARGURA_DA_CAIXA,
              altura: ALTURA_DA_CAIXA,
              destacada: Boolean(emAula && mostrar?.destacarLinhaBase),
            };
            const grupo = spec.eixo === "horizontal"
              ? { inicio: { ...ref, linha: LINHA_DE_INICIO } }
              : { chao: { ...ref, linha: LINHA_DO_CHAO } };
            return (
              <div key={`${entradaSeq}-${i}-${o.nome}`} className="relative" style={{ width: LARGURA_DA_CAIXA, height: ALTURA_DA_CAIXA }}>
                <Grupo
                  {...grupo}
                  disabled={travado}
                  onClick={() => tocar(i)}
                  selected={certoVisual || naOrdem >= 0}
                  rotulo={`${o.nome} ${i + 1}`}
                  items={[
                    <ObjetoVisual
                      key="obj"
                      o={o}
                      eixo={spec.eixo}
                      destaque={certoVisual || destaqueAula}
                      erro={erroVisual}
                      delay={0.25 + i * 0.18}
                    />,
                  ]}
                />

                {mostrarGuiaNormal && <Guia spec={spec} objeto={objetoMenor} />}
                {fase === "erro" && escolhidoObj && (
                  <Guia
                    key={`erro-${escolhido}`}
                    spec={spec}
                    objeto={corretoObj}
                    de={spec.eixo === "horizontal" ? escolhidoObj.comprimento : escolhidoObj.altura}
                    para={spec.eixo === "horizontal" ? corretoObj.comprimento : corretoObj.altura}
                  />
                )}
                {certoVisual && <SetaMedida spec={spec} objeto={o} />}

                {naOrdem >= 0 && (
                  <span
                    data-grandeza-order={naOrdem + 1}
                    aria-hidden
                    className="absolute right-2 top-2 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white shadow"
                  >{naOrdem + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PalcoEscalado>
  );
}
''')

# ---------------------------------------------------------------------------
# Testes do procedimento/contrato: protegem o eixo certo, não a implementação antiga.
# ---------------------------------------------------------------------------
write('src/curriculum/procedimentos/grandezaProcedure.test.ts', '''import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ADJETIVO, AcaoDeGrandeza, FALAS, atributoDoNivel, diagnosticar,
  diferencaDoNivel, diferencaPequena, dominou, eixoDoAtributo,
  objetosDiferentesNoNivel, quantosNoNivel, reguaFantasmaNoNivel, seriaNoNivel,
} from "./grandezaProcedure";
import {
  cabeNaCaixa, construirGrandezaSpec, outroAtributoContrario,
  semEmpate, valorComparado,
} from "./grandezaContract";
import { GM_01 } from "../fichas/jornada/GM.01";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];
const CANONE = readFileSync(join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"), "utf8").split("**").join("");

describe("F49 §5 — escada", () => {
  it.each([
    [1, "altura", "vertical", false, false],
    [2, "comprimento", "horizontal", false, false],
    [3, "altura", "vertical", false, false],
    [4, "altura", "vertical", true, false],
    [5, "tamanho", "uniforme", false, true],
  ])("nível %i: %s/%s, objetos diferentes %s, seriação %s", (n, attr, eixo, dif, seria) => {
    expect(atributoDoNivel(n)).toBe(attr);
    expect(eixoDoAtributo(attr as never)).toBe(eixo);
    expect(objetosDiferentesNoNivel(n)).toBe(dif);
    expect(seriaNoNivel(n)).toBe(seria);
  });
  it("só L3 carrega diferença pequena", () => expect([1,2,3,4,5].map(diferencaPequena)).toEqual([false,false,true,false,false]));
  it("régua fantasma entra de L3 em diante", () => expect([1,2,3,4,5].map(reguaFantasmaNoNivel)).toEqual([false,false,true,true,true]));
  it("L5 tem três objetos", () => expect([1,2,3,4,5].map(quantosNoNivel)).toEqual([2,2,2,2,3]));
  it("L1 é muito mais separado que L3", () => expect(diferencaDoNivel(1)).toBeGreaterThan(diferencaDoNivel(3) * 2));
});

describe("contrato semântico da cena", () => {
  it("nunca há empate e tudo cabe", () => {
    for (const s of SEMENTES) for (let n=1;n<=5;n+=1) {
      const spec=construirGrandezaSpec(n,semente(s));
      expect(semEmpate(spec), `empate n${n} s${s}`).toBe(true);
      expect(cabeNaCaixa(spec), `caixa n${n} s${s}`).toBe(true);
    }
  });

  it("a resposta é extrema NA DIMENSÃO QUE A PERGUNTA NOMEIA", () => {
    for (const s of SEMENTES) for (let n=1;n<=4;n+=1) {
      const spec=construirGrandezaSpec(n,semente(s));
      const vals=spec.objetos.map(o=>valorComparado(o,spec.atributo));
      const alvo=spec.polo==="maior"?Math.max(...vals):Math.min(...vals);
      expect(valorComparado(spec.objetos[spec.resposta],spec.atributo), `n${n} s${s}`).toBe(alvo);
    }
  });

  it("L2 pergunta comprimento e o vencedor é realmente o mais comprido/curto — não o mais alto", () => {
    for (const s of SEMENTES) {
      const spec=construirGrandezaSpec(2,semente(s));
      expect(spec.atributo).toBe("comprimento");
      const comprimentos=spec.objetos.map(o=>o.comprimento);
      const alturas=spec.objetos.map(o=>o.altura);
      const alvoC=spec.polo==="maior"?Math.max(...comprimentos):Math.min(...comprimentos);
      expect(spec.objetos[spec.resposta].comprimento).toBe(alvoC);
      const extremoAltura=spec.polo==="maior"?alturas.indexOf(Math.max(...alturas)):alturas.indexOf(Math.min(...alturas));
      expect(extremoAltura).not.toBe(spec.resposta);
    }
  });

  it("atributo distrator nunca aponta para a resposta certa em L1–L4", () => {
    for (const s of SEMENTES) for (let n=1;n<=4;n+=1) {
      expect(outroAtributoContrario(construirGrandezaSpec(n,semente(s))), `n${n} s${s}`).toBe(true);
    }
  });

  it("L1–L3 usam a mesma identidade; L4 troca; L5 volta à mesma identidade para isolar seriação", () => {
    for (const s of SEMENTES) {
      for (const n of [1,2,3,5]) expect(new Set(construirGrandezaSpec(n,semente(s)).objetos.map(o=>o.emoji)).size, `n${n}`).toBe(1);
      expect(new Set(construirGrandezaSpec(4,semente(s)).objetos.map(o=>o.emoji)).size).toBe(2);
    }
  });

  it("L5 escala as duas dimensões na mesma ordem e ordena os três", () => {
    for (const s of SEMENTES) {
      const spec=construirGrandezaSpec(5,semente(s));
      expect(new Set(spec.ordemCerta).size).toBe(3);
      const hs=spec.ordemCerta.map(i=>spec.objetos[i].altura);
      const cs=spec.ordemCerta.map(i=>spec.objetos[i].comprimento);
      const sh=spec.polo==="maior"?[...hs].sort((a,b)=>b-a):[...hs].sort((a,b)=>a-b);
      const sc=spec.polo==="maior"?[...cs].sort((a,b)=>b-a):[...cs].sort((a,b)=>a-b);
      expect(hs).toEqual(sh); expect(cs).toEqual(sc);
    }
  });

  it("posição na tela não denuncia a resposta", () => {
    expect(new Set(SEMENTES.map(s=>construirGrandezaSpec(1,semente(s)).resposta)).size).toBeGreaterThan(1);
  });

  it("500 amostras sem exceção", () => {
    for(let i=0;i<500;i+=1) expect(()=>construirGrandezaSpec((i%5)+1,semente(i+1))).not.toThrow();
  });
});

describe("§6 diagnóstico", () => {
  const base: AcaoDeGrandeza={ escolhido:0,certo:0,vencedorDoOutroAtributo:1,diferencaPequena:false,antesDaReferencia:false,atributo:"altura" };
  it("acerto não diagnostica",()=>expect(diagnosticar(base)).toBeUndefined());
  it("decidir antes da referência é BASE_DESALINHADA",()=>expect(diagnosticar({...base,escolhido:1,antesDaReferencia:true})).toBe(MisconceptionTag.BASE_DESALINHADA));
  it("escolher a dimensão distratora é CONFUNDE_ATRIBUTOS",()=>expect(diagnosticar({...base,escolhido:1})).toBe(MisconceptionTag.CONFUNDE_ATRIBUTOS));
  it("errar diferença pequena é SO_DIFERENCA_GRANDE",()=>expect(diagnosticar({...base,escolhido:2,vencedorDoOutroAtributo:1,diferencaPequena:true})).toBe(MisconceptionTag.SO_DIFERENCA_GRANDE));
});

describe("§9 domínio",()=>{
  const a=(pequena:boolean):AcaoDeGrandeza=>({escolhido:0,certo:0,vencedorDoOutroAtributo:1,diferencaPequena:pequena,antesDaReferencia:false,atributo:"altura"});
  it("três fáceis não bastam",()=>expect(dominou([a(false),a(false),a(false)])).toBe(false));
  it("um pequeno entre três basta para a condição local",()=>expect(dominou([a(false),a(false),a(true)])).toBe(true));
});

describe("§7 e ficha",()=>{
  it("falas-base continuam no cânone",()=>{expect(CANONE).toContain(FALAS.howto);expect(CANONE).toContain(FALAS.explain);});
  it("adjetivos por eixo",()=>{expect(ADJETIVO.altura.maior).toBe("mais alto");expect(ADJETIVO.comprimento.menor).toBe("mais curto");});
  it("cinco níveis continuam grandeza",()=>{for(let n=1;n<=5;n+=1)expect(GM_01.niveis![n].primitiva).toBe("grandeza");});
  it("três tags declaradas",()=>expect(GM_01.erros_tipicos!.map(e=>e.id).sort()).toEqual([MisconceptionTag.BASE_DESALINHADA,MisconceptionTag.CONFUNDE_ATRIBUTOS,MisconceptionTag.SO_DIFERENCA_GRANDE].sort()));
});
''')

write('src/components/primitives/GrandezaStage.f49.test.tsx', '''// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GM_01 } from "../../curriculum/fichas/jornada/GM.01";
import { GrandezaSpec } from "../../curriculum/procedimentos/grandezaContract";
import { GrandezaStage } from "./GrandezaStage";

const spec=(lvl:number)=>Composer.generate(GM_01,lvl).uiProps as GrandezaSpec;
const botoes=(c:HTMLElement)=>[...c.querySelectorAll<HTMLButtonElement>('button[aria-label]')];
afterEach(()=>vi.useRealTimers());

describe("GrandezaStage — F49",()=>{
  it("trocar spec zera seleção, ordem e fase",()=>{
    vi.useFakeTimers(); const s1=spec(1),s2=spec(2);
    const {container,rerender}=render(<GrandezaStage spec={s1}/>);
    fireEvent.click(botoes(container)[s1.resposta]);
    expect(botoes(container)[0].disabled).toBe(true);
    rerender(<GrandezaStage spec={s2}/>);
    expect(botoes(container)[0].disabled).toBe(false);
    expect(container.querySelector('[data-grandeza-order]')).toBeNull();
  });

  it("erro pertence ao palco e devolve retry após 2,2s",()=>{
    vi.useFakeTimers(); const s=spec(1); const onAnswer=vi.fn();
    const {container}=render(<GrandezaStage spec={s} onAnswer={onAnswer}/>);
    const errada=s.resposta===0?1:0;
    fireEvent.click(botoes(container)[errada]);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(botoes(container)[0].disabled).toBe(true);
    expect(container.querySelector('[data-grandeza-guide]')).toBeTruthy();
    act(()=>vi.advanceTimersByTime(2200));
    expect(botoes(container)[0].disabled).toBe(false);
  });

  it("acerto mostra seta de medida e fecha com a linha de comparação",()=>{
    vi.useFakeTimers(); const s=spec(1); const {container}=render(<GrandezaStage spec={s}/>);
    fireEvent.click(botoes(container)[s.resposta]);
    expect(container.querySelector('[data-grandeza-measure-arrow]')).toBeTruthy();
    act(()=>vi.advanceTimersByTime(1800));
    expect(container.querySelector('[data-grandeza-measure-arrow]')).toBeNull();
    expect(container.querySelector('[data-grandeza-guide]')).toBeTruthy();
  });

  it("L2 usa linha de início vertical; L1 usa chão horizontal",()=>{
    const a=render(<GrandezaStage spec={spec(1)}/>);
    expect(a.container.querySelector('[data-grupo-referencia="chao"]')).toBeTruthy();
    expect(a.container.querySelector('[data-grupo-referencia="inicio"]')).toBeNull(); a.unmount();
    const b=render(<GrandezaStage spec={spec(2)}/>);
    expect(b.container.querySelector('[data-grupo-referencia="inicio"]')).toBeTruthy();
    expect(b.container.querySelector('[data-grupo-referencia="chao"]')).toBeNull();
  });

  it("L3 mostra a régua fantasma antes da resposta depois da abertura",()=>{
    vi.useFakeTimers(); const {container}=render(<GrandezaStage spec={spec(3)}/>);
    expect(container.querySelector('[data-grandeza-guide]')).toBeNull();
    act(()=>vi.advanceTimersByTime(1200));
    expect(container.querySelector('[data-grandeza-guide]')).toBeTruthy();
  });

  it("ordem errada que começa pelo item certo continua ERRADA e volta para retry",()=>{
    vi.useFakeTimers(); const s=spec(5); const onAnswer=vi.fn();
    const {container}=render(<GrandezaStage spec={s} onAnswer={onAnswer}/>);
    const errada=[s.ordemCerta[0],s.ordemCerta[2],s.ordemCerta[1]];
    errada.forEach(i=>fireEvent.click(botoes(container)[i]));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][0]).toBe(-1);
    act(()=>vi.advanceTimersByTime(2200));
    expect(botoes(container)[0].disabled).toBe(false);
    expect(container.querySelector('[data-grandeza-order]')).toBeNull();
  });
});
''')

write('src/components/gameloop/grandezaAuthorialPolicy.test.ts', '''import { describe, expect, it } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GM_01 } from "../../curriculum/fichas/jornada/GM.01";
import { Question } from "../../types";
import { authorialFeedbackHoldMs, ownsAuthorialFeedback, ownsAuthorialRetry } from "./answerPolicy";

const q=Composer.generate(GM_01,1) as Question;
const meta={grandeza:{escolhido:1,certo:0,vencedorDoOutroAtributo:1,diferencaPequena:false,antesDaReferencia:false,atributo:"altura"}} as any;
describe("F49 — autoria do fluxo",()=>{
  it("GrandezaStage possui erro/retry e cinema próprios",()=>{
    expect(ownsAuthorialRetry(q,meta)).toBe(true);
    expect(ownsAuthorialFeedback(q,meta)).toBe(true);
    expect(authorialFeedbackHoldMs(q,meta)).toBe(3300);
  });
});
''')

# ---------------------------------------------------------------------------
# answerPolicy: integra F49 ao mesmo protocolo autoral das outras fichas F0.
# ---------------------------------------------------------------------------
p=ROOT/'src/components/gameloop/answerPolicy.ts'
s=p.read_text(encoding='utf-8')
needle='''    || (isFormaQuestion(q) && meta?.forma !== undefined);'''
repl='''    || (isFormaQuestion(q) && meta?.forma !== undefined)\n    || (q.kind === "grandeza" && meta?.grandeza !== undefined);'''
if s.count(needle)!=2: raise SystemExit(f'answerPolicy autoria mudou: {s.count(needle)}')
s=s.replace(needle,repl)
hold='''  if (isFormaQuestion(q) && meta?.forma !== undefined) {\n    // F48 §4: 2,2s de giro/contagem + 1,5s de fecho numerado.\n    return 3700;\n  }'''
hold_new=hold+'''\n  if (q.kind === "grandeza" && meta?.grandeza !== undefined) {\n    // F49 §4: 1,8s de medida + 1,5s de fecho comparativo.\n    return 3300;\n  }'''
if s.count(hold)!=1: raise SystemExit('answerPolicy hold F48 mudou')
s=s.replace(hold,hold_new,1)
p.write_text(s,encoding='utf-8')

# ---------------------------------------------------------------------------
# Ficha TS: fala específica do eixo e L5 sem trocar identidade visual.
# ---------------------------------------------------------------------------
p=ROOT/'src/curriculum/fichas/jornada/GM.01.ts'
s=p.read_text(encoding='utf-8')
s=s.replace(
'''      params: { audio_prompt: FALAS.howto },''',
'''      params: {\n        audio_prompt: FALAS.howtoDoAtributo("comprimento"),\n        howto: FALAS.howtoDoAtributo("comprimento"),\n        explain: FALAS.explainDoAtributo("comprimento"),\n      },''',1)
s=s.replace(
'''        howto: "Toque em ordem: primeiro o maior, depois o do meio, depois o menor.",\n        explain: "Compare de dois em dois. Ache o maior de todos, depois o maior do que sobrou.",''',
'''        howto: FALAS.howtoDoAtributo("tamanho"),\n        explain: FALAS.explainDoAtributo("tamanho"),''',1)
old=''' * | 5 | **ordenar três** | seriação |'''
if old in s:
    s=s.replace(old,' * | 5 | **ordenar três cópias do mesmo objeto** | seriação sem pista de identidade |',1)
p.write_text(s,encoding='utf-8')

# ---------------------------------------------------------------------------
# Cânone: explicita a regra geral de comparação justa também no comprimento.
# ---------------------------------------------------------------------------
p=ROOT/'AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md'
s=p.read_text(encoding='utf-8')
marker='''**⚠️ A regra pedagógica que quase todo material erra:** as **bases precisam estar alinhadas na mesma linha horizontal**. Comparar altura com objetos flutuando em posições diferentes ensina errado — é o equivalente visual de comparar quantidade pelo espaço ocupado.'''
replacement=marker+'''\n\n**A mesma regra vale girada em 90° para comprimento:** os dois objetos começam na **mesma linha vertical**. Comparar “comprido/curto” com pontos de partida diferentes é uma comparação injusta pelo mesmo motivo. A referência muda de eixo; o princípio pedagógico não muda.'''
if s.count(marker)!=1: raise SystemExit('F49 fundamento não encontrado')
s=s.replace(marker,replacement,1)
row='''| **Abertura** | uma **linha de chão** se desenha atravessando os dois contêineres. Os objetos "pousam" nela. | 1,2s |'''
row_new='''| **Abertura** | a **referência comum** se desenha: linha de chão na altura; linha de início no comprimento. Os objetos pousam/encostam nela. | 1,2s |'''
if s.count(row)!=1: raise SystemExit('F49 abertura não encontrada')
s=s.replace(row,row_new,1)
level5='''| 5 | **ordenar três ou mais** por tamanho | seriação |'''
level5_new='''| 5 | **ordenar três ou mais** por tamanho | seriação — mesma identidade visual, escalada proporcionalmente |'''
if s.count(level5)!=1: raise SystemExit('F49 L5 não encontrado')
s=s.replace(level5,level5_new,1)
p.write_text(s,encoding='utf-8')

# ---------------------------------------------------------------------------
# Sonda permanente: todos os eixos e todos os beats ficam cobertos.
# ---------------------------------------------------------------------------
p=ROOT/'sonda/cenas.tsx'
s=p.read_text(encoding='utf-8')
old='''  ...[1, 3, 4, 5].map(lvl => ({\n    nome: `GM.01 comparar grandeza (nível ${lvl})`,\n    render: (s: number) => <ExercicioDaFicha ficha={GM_01} lvl={lvl} semente={s} />,\n  })),\n  {\n    nome: "GM.01 micro-aula: os dois estão no chão",\n    render: (s: number) => (\n      <ExercicioDaFicha ficha={GM_01} lvl={1} semente={s} mostrar={{ destacarLinhaBase: true }} />\n    ),\n  },'''
new='''  ...[1, 2, 3, 4, 5].map(lvl => ({\n    nome: `GM.01 comparar grandeza (nível ${lvl})`,\n    render: (s: number) => <ExercicioDaFicha ficha={GM_01} lvl={lvl} semente={s} />,\n  })),\n  {\n    nome: "GM.01 micro-aula: os dois estão no chão",\n    render: (s: number) => (\n      <ExercicioDaFicha ficha={GM_01} lvl={1} semente={s} mostrar={{ destacarLinhaBase: true }} />\n    ),\n  },\n  {\n    nome: "GM.01 micro-aula: veja qual sobe mais",\n    render: (s: number) => (\n      <ExercicioDaFicha ficha={GM_01} lvl={3} semente={s} mostrar={{ subirLinhaTracejada: true }} />\n    ),\n  },\n  {\n    nome: "GM.01 micro-aula: este é mais alto",\n    render: (s: number) => (\n      <ExercicioDaFicha ficha={GM_01} lvl={1} semente={s} mostrar={{ destacarMaior: true }} />\n    ),\n  },'''
if s.count(old)!=1: raise SystemExit('sonda GM.01 bloco mudou')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

print('GM01 candidate written')
