import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F56 / PE.01 — o contador de animais. Pictogramas e tabelas simples.
 *
 * ## O começo da estatística
 *
 * É a primeira vez que a criança lê um dado **coletado por outra pessoa**. Ela
 * precisa confiar na representação e extrair informação dela — que é uma coisa
 * diferente de contar objetos que estão ali.
 *
 * ## O degrau escondido, e onde quase todas erram
 *
 * Quando **um ícone representa duas unidades**. A criança conta os ícones e
 * responde o número de ícones, não a quantidade real. É a primeira noção de
 * escala, e é o erro que a ficha chama `IGNORA_ESCALA`.
 *
 * Por isso a legenda existe como nível próprio, e por isso o §9 pede que o
 * domínio inclua um caso com legenda de escala: sem isso a criança fecha a
 * competência tendo lido só pictogramas um-para-um, onde contar ícones e contar
 * a quantidade dão o mesmo número por acidente.
 */
export const PictogramaMisconception = {
  IGNORA_ESCALA: "ignora-escala",
  LINHA_TROCADA: "linha-trocada",
  COMPARA_SOMANDO: "compara-somando",
} as const;
export type PictogramaMisconceptionTag = typeof PictogramaMisconception[keyof typeof PictogramaMisconception];

export type PictogramaModo = "ler-linha" | "comparar-linhas" | "total" | "com-legenda" | "construir";
export type FamiliaEscala = "um-para-um" | "com-escala";

export interface LinhaDoPictograma {
  rotulo: string;
  /** Quantos DESENHOS a linha mostra — não a quantidade que ela representa. */
  icones: number;
  emoji: string;
}

export interface PictogramaF56Spec {
  nivel: number;
  modo: PictogramaModo;
  linhas: LinhaDoPictograma[];
  /** Quanto vale cada desenho. Dois é a legenda que o L4 estreia. */
  escala: number;
  /** A linha sobre a qual se pergunta. Na comparação, a primeira das duas. */
  perguntada: number;
  /** Na comparação, a segunda linha. */
  comparada?: number;
  /** No modo construir, a quantidade dada em números — a resposta é quantos desenhos. */
  quantidadeDada?: number;
  resposta: number;
  familia: FamiliaEscala;
  opcoes: Array<{ value: number; label: string; misconception?: PictogramaMisconceptionTag }>;
}

interface PictogramaShow {
  linhas: LinhaDoPictograma[];
  escala: number;
  acender?: number;
  pulsarLegenda?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const CATALOGO: Array<{ rotulo: string; emoji: string }> = [
  { rotulo: "Cachorros", emoji: "🐶" },
  { rotulo: "Gatos", emoji: "🐱" },
  { rotulo: "Pássaros", emoji: "🐦" },
  { rotulo: "Peixes", emoji: "🐟" },
  { rotulo: "Coelhos", emoji: "🐰" },
];

function opcoes(correta: number, erradas: Array<{ value: number; misconception: PictogramaMisconceptionTag }>): PictogramaF56Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value > 0)
    .slice(0, 4);
}

/**
 * Três categorias sorteadas do catálogo, com contagens DISTINTAS.
 *
 * As contagens precisam diferir por dois motivos. O primeiro é de medida: com
 * duas linhas iguais, "leu a linha errada" deixa de ser diagnosticável —
 * trocar de linha dá o mesmo número, e o distrator some por coincidir com a
 * resposta, deixando o nível com duas alternativas. O segundo é pedagógico: um
 * pictograma em que duas categorias empatam não dá o que comparar.
 */
function sortearLinhas(quantidade: number, min: number, max: number): LinhaDoPictograma[] {
  const disponiveis = [...CATALOGO];
  const contagens: number[] = [];
  for (let n = min; n <= max; n += 1) contagens.push(n);
  const linhas: LinhaDoPictograma[] = [];
  for (let i = 0; i < quantidade; i += 1) {
    const escolhido = disponiveis.splice(ri(0, disponiveis.length - 1), 1)[0];
    const icones = contagens.splice(ri(0, contagens.length - 1), 1)[0];
    linhas.push({ rotulo: escolhido.rotulo, emoji: escolhido.emoji, icones });
  }
  return linhas;
}

export function construirPictogramaSpec(level: number, familiaPedida?: FamiliaEscala): PictogramaF56Spec {
  const nivel = clamp(level);
  const PM = PictogramaMisconception;

  // A escala é o degrau da ficha: um-para-um até o L3, dois no L4, e o L5
  // mistura — que é onde a criança precisa OLHAR a legenda em vez de supor.
  const familia: FamiliaEscala = nivel <= 3
    ? "um-para-um"
    : nivel === 4
      ? "com-escala"
      : familiaPedida ?? (Math.random() < 0.5 ? "um-para-um" : "com-escala");
  const escala = familia === "com-escala" ? 2 : 1;

  const linhas = sortearLinhas(3, 2, 6);
  const perguntada = ri(0, linhas.length - 1);
  const valorDa = (i: number) => linhas[i].icones * escala;

  if (nivel === 2) {
    // Comparar duas linhas: precisam ser diferentes, senão "quantos a mais"
    // seria zero e a pergunta não teria o que medir.
    const comparada = (perguntada + 1) % linhas.length;
    const maior = valorDa(perguntada) >= valorDa(comparada) ? perguntada : comparada;
    const menor = maior === perguntada ? comparada : perguntada;
    const diferenca = valorDa(maior) - valorDa(menor);
    return {
      nivel, modo: "comparar-linhas", linhas, escala, perguntada: maior, comparada: menor,
      resposta: diferenca, familia,
      opcoes: opcoes(diferenca, [
        // Confundiu "a mais" com total: somou as duas linhas.
        { value: valorDa(maior) + valorDa(menor), misconception: PM.COMPARA_SOMANDO },
        // Leu uma linha só, em vez de comparar.
        { value: valorDa(maior), misconception: PM.LINHA_TROCADA },
        { value: valorDa(menor), misconception: PM.LINHA_TROCADA },
      ]),
    };
  }

  if (nivel === 3) {
    const total = linhas.reduce((soma, linha) => soma + linha.icones * escala, 0);
    return {
      nivel, modo: "total", linhas, escala, perguntada, resposta: total, familia,
      opcoes: opcoes(total, [
        // Leu uma linha em vez de somar todas.
        { value: valorDa(perguntada), misconception: PM.LINHA_TROCADA },
        { value: total - valorDa(perguntada), misconception: PM.LINHA_TROCADA },
        { value: linhas.length, misconception: PM.COMPARA_SOMANDO },
      ]),
    };
  }

  if (nivel === 5) {
    // Construir: dada a quantidade em números, quantos desenhos a linha precisa?
    // É o inverso do L4, e é onde "de dados soltos para pictograma" acontece.
    const desenhos = ri(2, 6);
    const quantidade = desenhos * escala;
    return {
      nivel, modo: "construir", linhas, escala, perguntada,
      quantidadeDada: quantidade, resposta: desenhos, familia,
      opcoes: opcoes(desenhos, [
        // Desenhou um por unidade, ignorando que cada desenho vale dois.
        { value: quantidade, misconception: PM.IGNORA_ESCALA },
        { value: desenhos + 1, misconception: PM.LINHA_TROCADA },
        { value: Math.max(1, desenhos - 1), misconception: PM.LINHA_TROCADA },
      ]),
    };
  }

  // L1 e L4: ler uma linha. O que muda entre eles é a legenda.
  const resposta = valorDa(perguntada);
  // As DUAS outras linhas entram como distrator, não uma só. Com uma, o valor
  // dela podia coincidir com `resposta + escala` e as duas alternativas viravam
  // uma — o nível caía para duas opções, que é cara ou coroa. As três contagens
  // são distintas por construção, então as duas outras nunca colidem entre si
  // nem com a resposta.
  const outra = (perguntada + 1) % linhas.length;
  const terceira = (perguntada + 2) % linhas.length;
  return {
    nivel,
    modo: nivel === 4 ? "com-legenda" : "ler-linha",
    linhas,
    escala,
    perguntada,
    resposta,
    familia,
    opcoes: opcoes(resposta, [
      // O erro do nível 4: contou os desenhos e ignorou a legenda.
      ...(escala > 1 ? [{ value: linhas[perguntada].icones, misconception: PM.IGNORA_ESCALA }] : []),
      // Leu a linha errada — qualquer uma das outras duas.
      { value: valorDa(outra), misconception: PM.LINHA_TROCADA },
      { value: valorDa(terceira), misconception: PM.LINHA_TROCADA },
      { value: resposta + escala, misconception: PM.LINHA_TROCADA },
    ]),
  };
}

export function construirPictogramaResolucao(spec: PictogramaF56Spec): ResolucaoDeclarativa<PictogramaShow, number, PictogramaMisconceptionTag> {
  const cena: PictogramaShow = { linhas: spec.linhas, escala: spec.escala };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "achar-a-linha",
        say: `Ache a linha dos ${spec.linhas[spec.perguntada].rotulo.toLowerCase()}.`,
        show: { ...cena, acender: spec.perguntada },
        corrige: [PictogramaMisconception.LINHA_TROCADA],
        parcial: spec.linhas[spec.perguntada].icones,
      },
      {
        id: "olhar-a-legenda",
        say: spec.escala > 1
          ? "Olhe a legenda: cada desenho vale dois."
          : "Aqui cada desenho vale um.",
        show: { ...cena, acender: spec.perguntada, pulsarLegenda: true },
        corrige: [PictogramaMisconception.IGNORA_ESCALA],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.01 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirPictogramaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "PE.01") throw new Error(`pictogramaContract recebeu ${ficha.id}.`);
  const spec = construirPictogramaSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.01 sem micro L${spec.nivel}.`);

  const alvo = spec.linhas[spec.perguntada];
  const prompt = spec.modo === "comparar-linhas"
    ? `Quantos ${alvo.rotulo.toLowerCase()} a mais que ${spec.linhas[spec.comparada ?? 0].rotulo.toLowerCase()}?`
    : spec.modo === "total"
      ? "Quantos bichinhos a turma tem no total?"
      : spec.modo === "construir"
        ? `A turma tem ${spec.quantidadeDada} ${alvo.rotulo.toLowerCase()}. Quantos desenhos essa linha precisa ter?`
        : `Quantos ${alvo.rotulo.toLowerCase()} a turma tem?`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "pictograma-f56",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirPictogramaResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    // A escala só é evidência onde o nível de fato varia entre as duas. Nos
    // níveis de escala fixa, etiquetar a família afirmaria uma escolha que a
    // criança não fez.
    ...(spec.nivel === 5 ? { evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, spec.familia) } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
