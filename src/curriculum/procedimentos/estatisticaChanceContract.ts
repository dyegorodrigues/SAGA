import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { Evidencia } from "../../constants/evidencias";
import { EstatisticaChanceMisconception, type EstatisticaChanceMisconceptionTag } from "../../constants/estatisticaChanceMisconceptions";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export type EstatisticaChanceModo = "certo-possivel-impossivel" | "mais-menos-provavel" | "chance-fracao" | "frequencia-independencia" | "contar-possibilidades";

export interface EstatisticaChanceF95Spec {
  ficha: "F95";
  nivel: number;
  modo: EstatisticaChanceModo;
  primitivas: ["SingaporeBars", "ArrayGrid"];
  acessibilidade: { toqueAlternativo: true; semArrastoObrigatorio: true; alvoMinPx: 80; erroMotorNaoTag: true };
  favoraveis: number;
  total: number;
  /** O que a caixa de L1 guarda — o enunciado nasce dela. */
  caixa?: { conteudo: string; procurado: string };
  /** Os dois sacos de L2. O palco desenha estes, não números escritos à mão. */
  sacos?: Array<{ label: string; favoraveis: number; total: number }>;
  historico?: string[];
  /** De que experimento L4 fala — a falácia é sobre ele, e o palco o nomeia. */
  experimento?: { nome: string; artigo: string; resultados: string[] };
  grade?: { linhas: number; colunas: number; rotulosLinhas: string[]; rotulosColunas: string[] };
  resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: EstatisticaChanceMisconceptionTag }>;
}

type Show = Pick<EstatisticaChanceF95Spec, "modo" | "favoraveis" | "total" | "historico" | "grade"> & { destaque: string };

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const acessibilidade = { toqueAlternativo: true, semArrastoObrigatorio: true, alvoMinPx: 80, erroMotorNaoTag: true } as const;
function opts(correta: string | number, erradas: Array<{ value: string | number; misconception?: EstatisticaChanceMisconceptionTag }>): EstatisticaChanceF95Spec["opcoes"] {
  return [{ value: correta, label: String(correta) }, ...erradas.map(x => ({ ...x, label: String(x.value) }))]
    .filter((x, i, a) => a.findIndex(y => String(y.value) === String(x.value)) === i)
    .slice(0, 4);
}

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];

/**
 * CLASS-003 — o experimento é sorteado, a escada não.
 *
 * As respostas certas eram "certo", "Saco B", "3/5", "continua 1/2" e 6, nessa
 * ordem, em todo sorteio. Cinco rótulos decorados venciam a competência.
 *
 * O degrau continua sendo o que cada nível pergunta: nomear a certeza, comparar
 * dois sacos, escrever a fração, resistir à falácia do apostador e contar
 * combinações numa grade.
 */
const CAIXAS_F95: readonly { conteudo: string; procurado: string }[] = [
  { conteudo: "fichas azuis", procurado: "uma ficha azul" },
  { conteudo: "bolas vermelhas", procurado: "uma bola vermelha" },
  { conteudo: "cartas de copas", procurado: "uma carta de copas" },
  { conteudo: "botões amarelos", procurado: "um botão amarelo" },
];
const EXPERIMENTOS_F95: readonly { nome: string; artigo: string; resultados: string[]; favoraveis: number; total: number }[] = [
  { nome: "moeda justa", artigo: "uma", resultados: ["cara", "coroa"], favoraveis: 1, total: 2 },
  { nome: "dado justo", artigo: "um", resultados: ["1", "2", "3", "4", "5", "6"], favoraveis: 1, total: 6 },
  { nome: "roleta de três cores", artigo: "uma", resultados: ["azul", "verde", "amarelo"], favoraveis: 1, total: 3 },
  { nome: "roleta de quatro cores", artigo: "uma", resultados: ["azul", "verde", "amarelo", "vermelho"], favoraveis: 1, total: 4 },
];
const PECAS_F95: readonly { nome: string; itens: string[] }[] = [
  { nome: "camisa", itens: ["camisa A", "camisa B", "camisa C", "camisa D"] },
  { nome: "calça", itens: ["calça 1", "calça 2", "calça 3", "calça 4"] },
  { nome: "boné", itens: ["boné curto", "boné longo", "boné listrado", "boné liso"] },
  { nome: "tênis", itens: ["tênis branco", "tênis preto", "tênis azul", "tênis verde"] },
];

export function construirEstatisticaChanceF95Spec(level: number): EstatisticaChanceF95Spec {
  const nivel = clamp(level);
  const base = { ficha: "F95" as const, nivel, primitivas: ["SingaporeBars", "ArrayGrid"] as ["SingaporeBars", "ArrayGrid"], acessibilidade };

  if (nivel === 1) {
    // Só os dois extremos: a caixa tem tudo do que se procura, ou não tem nada.
    //
    // O caso do meio faria "possível" ser a resposta em parte dos sorteios — e
    // "possível" é a casa do TUDO_CINQUENTA, quem responde "pode ser" para tudo.
    // Naquela rodada o distrator ficaria sem casa e a tela não diagnosticaria
    // nada. Nomear a certeza é o degrau; a chance intermediária é L2 em diante.
    const caixa = escolher(CAIXAS_F95);
    const total = ri(4, 9);
    const soTem = Math.random() < 0.5;
    return {
      ...base, modo: "certo-possivel-impossivel", favoraveis: soTem ? total : 0, total, caixa,
      resposta: soTem ? "certo" : "impossível",
      opcoes: opts(soTem ? "certo" : "impossível", [
        { value: "possível", misconception: EstatisticaChanceMisconception.TUDO_CINQUENTA },
        { value: soTem ? "impossível" : "certo" },
      ]),
    };
  }

  if (nivel === 2) {
    // Mesmo total nos dois sacos: o degrau é comparar favoráveis, não converter
    // frações — isso é L3. Qual saco ganha é sorteado; deixar sempre o B faria a
    // resposta ser sempre "Saco B", que é a CLASS-003 de novo.
    const total = ri(5, 9);
    const maior = ri(2, total - 1);
    const menor = ri(1, maior - 1);
    const certoEhA = Math.random() < 0.5;
    const sacos = [
      { label: "Saco A", favoraveis: certoEhA ? maior : menor, total },
      { label: "Saco B", favoraveis: certoEhA ? menor : maior, total },
    ];
    return {
      ...base, modo: "mais-menos-provavel", favoraveis: maior, total, sacos,
      resposta: certoEhA ? "Saco A" : "Saco B",
      opcoes: opts(certoEhA ? "Saco A" : "Saco B", [
        // Quem acha que tudo é cinquenta por cento responde "iguais". A tag
        // estava no saco errado: ninguém que comete esse erro escolhe um saco.
        { value: "iguais", misconception: EstatisticaChanceMisconception.TUDO_CINQUENTA },
        { value: certoEhA ? "Saco B" : "Saco A" },
      ]),
    };
  }

  if (nivel === 3) {
    const total = ri(4, 9);
    const favoraveis = ri(2, total - 1);
    return {
      ...base, modo: "chance-fracao", favoraveis, total, resposta: `${favoraveis}/${total}`,
      opcoes: opts(`${favoraveis}/${total}`, [
        { value: `${favoraveis}/${favoraveis}`, misconception: EstatisticaChanceMisconception.IGNORA_TOTAL },
        { value: `${total}/${favoraveis}`, misconception: EstatisticaChanceMisconception.IGNORA_TOTAL },
      ]),
    };
  }

  if (nivel === 4) {
    const experimento = escolher(EXPERIMENTOS_F95);
    // Um histórico desequilibrado é o que convida à falácia: sem uma sequência
    // que "está devendo" um resultado, não há apostador a desmentir.
    const insistente = escolher(experimento.resultados);
    const outro = escolher(experimento.resultados.filter(r => r !== insistente));
    const historico = [...Array.from({ length: ri(3, 4) }, () => insistente), outro];
    return {
      ...base, modo: "frequencia-independencia",
      favoraveis: experimento.favoraveis, total: experimento.total,
      historico, experimento: { nome: experimento.nome, artigo: experimento.artigo, resultados: experimento.resultados },
      resposta: `continua ${experimento.favoraveis}/${experimento.total}`,
      opcoes: opts(`continua ${experimento.favoraveis}/${experimento.total}`, [
        { value: `agora ${outro} é mais provável`, misconception: EstatisticaChanceMisconception.FALACIA_APOSTADOR },
        { value: `agora ${insistente} é mais provável`, misconception: EstatisticaChanceMisconception.FALACIA_APOSTADOR },
      ]),
    };
  }

  // A grade é linhas × colunas, e somar precisa dar outro número: com 2×2 a
  // soma bate com o produto e o erro mais comum do nível acerta por acidente.
  // Duas peças distintas, sorteadas sem comparador aleatório: o `sort` com
  // `Math.random() - 0.5` é a CLASS-005, e o gate do repositório o proíbe em
  // src/ inteiro — ele não embaralha uniformemente e concentra posições.
  const iPrimeira = ri(0, PECAS_F95.length - 1);
  const primeira = PECAS_F95[iPrimeira];
  const segunda = PECAS_F95[(iPrimeira + ri(1, PECAS_F95.length - 1)) % PECAS_F95.length];
  let linhas = ri(2, 4);
  let colunas = ri(2, 4);
  while (linhas + colunas === linhas * colunas || linhas === colunas) colunas = ri(2, 4);
  const combinacoes = linhas * colunas;
  return {
    ...base, modo: "contar-possibilidades", favoraveis: combinacoes, total: combinacoes,
    grade: { linhas, colunas, rotulosLinhas: primeira.itens.slice(0, linhas), rotulosColunas: segunda.itens.slice(0, colunas) },
    resposta: combinacoes,
    opcoes: opts(combinacoes, [
      { value: linhas + colunas },
      { value: linhas, misconception: EstatisticaChanceMisconception.IGNORA_TOTAL },
      { value: colunas },
    ]),
  };
}

export function evidenciasEstatisticaChanceF95(spec: EstatisticaChanceF95Spec, correta: boolean): string[] {
  return correta && spec.modo === "chance-fracao" ? [Evidencia.CHANCE_FRACAO_F95] : [];
}

export function construirEstatisticaChanceResolucao(spec: EstatisticaChanceF95Spec): ResolucaoDeclarativa<Show, string | number, EstatisticaChanceMisconceptionTag> {
  const show: Show = { modo: spec.modo, favoraveis: spec.favoraveis, total: spec.total, historico: spec.historico, grade: spec.grade, destaque: "favoraveis-sobre-total" };
  const say = spec.modo === "certo-possivel-impossivel"
    ? "Compare os resultados possíveis: certo acontece em todos, impossível em nenhum, e possível em parte deles."
    : spec.modo === "mais-menos-provavel"
      ? "O evento mais provável tem mais casos favoráveis em relação ao total de resultados."
      : spec.modo === "chance-fracao"
        ? "Escreva a chance como fração: casos favoráveis em cima e total de resultados embaixo."
        : spec.modo === "frequencia-independencia"
          ? "A frequência do histórico pode oscilar; em eventos independentes, o próximo resultado continua com a mesma chance, e no longo prazo a frequência se aproxima da expectativa."
          : "Organize as combinações numa grade: linhas vezes colunas dão o produto de possibilidades sem repetir nem esquecer casos.";
  return { estadoInicial: show, passos: [{ id: "contar", say, show, corrige: Object.values(EstatisticaChanceMisconception), parcial: spec.resposta }], fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): { micro: FichaCompetencia["micros"][number]; rule: MasteryRule } {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.04 sem micro L${nivel}.`);
  return { micro, rule: { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes } };
}

export function construirEstatisticaChanceQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "PE.04") throw new Error(`estatisticaChanceContract recebeu ${ficha.id}.`);
  const spec = construirEstatisticaChanceF95Spec(level);
  const { micro, rule } = mastery(ficha, spec.nivel);
  const caixa = spec.caixa;
  const sacos = spec.sacos ?? [];
  const grade = spec.grade;
  const prompt = spec.modo === "certo-possivel-impossivel"
    ? `Se uma caixa contém ${spec.favoraveis === 0 ? `apenas peças que não são ${caixa?.conteudo}` : `apenas ${caixa?.conteudo}`}, tirar ${caixa?.procurado} é certo, possível ou impossível?`
    : spec.modo === "mais-menos-provavel"
      ? `Qual saco é mais provável de dar uma ficha marcada: ${sacos.map(saco => `${saco.label.replace("Saco ", "")} com ${saco.favoraveis} de ${saco.total}`).join(" ou ")}?`
    : spec.modo === "chance-fracao" ? `Há ${spec.favoraveis} resultados favoráveis entre ${spec.total} resultados possíveis. Qual fração representa essa chance?`
    : spec.modo === "frequencia-independencia" ? `Depois desse histórico de ${spec.experimento?.nome}, qual é a chance de ${spec.experimento?.resultados[0]} na próxima jogada?`
    : `Com ${grade?.linhas} ${grade?.rotulosLinhas[0].split(" ")[0]}s e ${grade?.colunas} ${grade?.rotulosColunas[0].split(" ")[0]}s, quantas combinações diferentes podem ser formadas?`;
  const options: Option[] = spec.opcoes;
  return {
    kind: "estatistica-chance-f95",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirEstatisticaChanceResolucao(spec),
    masteryRule: rule,
    exigeEvidencia: micro.dominio.exige?.evidencia,
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => String(a) === String(spec.resposta),
  };
}
