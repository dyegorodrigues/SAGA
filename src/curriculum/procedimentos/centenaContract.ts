import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

/**
 * F37 / N2.04 — a centena. A mesma regra de agrupamento, um nível acima.
 *
 * ## Por que é fácil se a dezena estiver firme
 *
 * Dez cubinhos viram barra; dez barras viram placa. É literalmente o mesmo
 * movimento. Quem entendeu o primeiro agrupamento entende o segundo em minutos.
 *
 * **Quem não entendeu trava aqui — e o problema é lá atrás, não aqui.** Por
 * isso o distrator `NAO_AGRUPA_DEZENAS` importa: ele não diz "errou a centena",
 * diz "a dezena não está firme", e o resgate correto é para N2.01, não para
 * mais exercício desta ficha.
 *
 * ## O que cada ordem vale, e o que a criança confunde
 *
 * `IGNORA_VALOR` é somar placas com cubinhos como se fossem a mesma coisa —
 * três placas e quatro cubinhos virando "sete". `INVERTE_ORDENS` é ler 347
 * como 743. As duas são erros de valor posicional, não de contagem, e é por
 * isso que a tela mostra o material nas três ordens ao mesmo tempo.
 */
export const CentenaMisconception = {
  IGNORA_VALOR: "ignora-valor",
  INVERTE_ORDENS: "inverte-ordens",
  NAO_AGRUPA_DEZENAS: "nao-agrupa-dezenas",
} as const;
export type CentenaMisconceptionTag = typeof CentenaMisconception[keyof typeof CentenaMisconception];

export type CentenaModo = "agrupar-ate-199" | "ate-500" | "ate-999" | "ler-e-montar" | "decompor";

export interface CentenaF37Spec {
  nivel: number;
  modo: CentenaModo;
  centenas: number;
  dezenas: number;
  unidades: number;
  /** O número que as três ordens formam. */
  numero: number;
  /** No modo `ler-e-montar` e `decompor`, a pergunta parte do numeral escrito. */
  partirDoNumeral: boolean;
  /** No modo `decompor`, qual ordem se pergunta. */
  ordemPerguntada?: "centenas" | "dezenas" | "unidades";
  resposta: number;
  opcoes: Array<{ value: number; label: string; misconception?: CentenaMisconceptionTag }>;
}

interface CentenaShow {
  centenas: number;
  dezenas: number;
  unidades: number;
  destacarOrdem?: "centenas" | "dezenas" | "unidades";
  agrupar?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function opcoes(correta: number, erradas: Array<{ value: number; misconception: CentenaMisconceptionTag }>): CentenaF37Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value >= 0)
    .slice(0, 4);
}

export function construirCentenaSpec(level: number): CentenaF37Spec {
  const nivel = clamp(level);
  const CM = CentenaMisconception;

  // A escada é de alcance, e as faixas não se sobrepõem: L1 dentro de 199, L2
  // acima disso até 500, L3 acima de 500. Sem os pisos, o L3 sortearia 120 e o
  // degrau existiria só no papel.
  const centenas = nivel === 1 ? 1 : nivel === 2 ? ri(2, 4) : ri(5, 9);
  const dezenas = ri(1, 9);
  const unidades = ri(1, 9);
  const numero = centenas * 100 + dezenas * 10 + unidades;
  // Ler 347 como 743: as ordens trocadas de ponta a ponta.
  const invertido = unidades * 100 + dezenas * 10 + centenas;
  // Somar placas com cubinhos como se fossem a mesma coisa.
  const somaCega = centenas + dezenas + unidades;
  // A dezena não está firme: dez barras não viraram placa, e a criança conta
  // as dezenas soltas em vez de agrupá-las.
  const semAgrupar = centenas * 100 + (dezenas + 10) * 10 + unidades;

  if (nivel === 5) {
    // Decompor: dado o numeral, quantas de cada ordem?
    const ordens = ["centenas", "dezenas", "unidades"] as const;
    const ordemPerguntada = ordens[ri(0, 2)];
    const resposta = ordemPerguntada === "centenas" ? centenas : ordemPerguntada === "dezenas" ? dezenas : unidades;
    const outras = [centenas, dezenas, unidades].filter(v => v !== resposta);
    return {
      nivel, modo: "decompor", centenas, dezenas, unidades, numero,
      partirDoNumeral: true, ordemPerguntada, resposta,
      opcoes: opcoes(resposta, [
        // Leu a ordem errada do numeral.
        { value: outras[0], misconception: CM.INVERTE_ORDENS },
        { value: outras[1] ?? resposta + 1, misconception: CM.INVERTE_ORDENS },
        { value: somaCega, misconception: CM.IGNORA_VALOR },
      ]),
    };
  }

  const partirDoNumeral = nivel === 4;
  return {
    nivel,
    modo: nivel === 1 ? "agrupar-ate-199" : nivel === 2 ? "ate-500" : nivel === 3 ? "ate-999" : "ler-e-montar",
    centenas,
    dezenas,
    unidades,
    numero,
    partirDoNumeral,
    // No L4 a pergunta parte do numeral e a resposta é quantas PLACAS montar;
    // nos demais, o material está na mesa e a resposta é o número.
    resposta: partirDoNumeral ? centenas : numero,
    opcoes: partirDoNumeral
      ? opcoes(centenas, [
          { value: dezenas, misconception: CM.INVERTE_ORDENS },
          { value: unidades, misconception: CM.INVERTE_ORDENS },
          { value: somaCega, misconception: CM.IGNORA_VALOR },
        ])
      : opcoes(numero, [
          { value: invertido, misconception: CM.INVERTE_ORDENS },
          { value: somaCega, misconception: CM.IGNORA_VALOR },
          { value: semAgrupar, misconception: CM.NAO_AGRUPA_DEZENAS },
        ]),
  };
}

export function construirCentenaResolucao(spec: CentenaF37Spec): ResolucaoDeclarativa<CentenaShow, number, CentenaMisconceptionTag> {
  const cena: CentenaShow = { centenas: spec.centenas, dezenas: spec.dezenas, unidades: spec.unidades };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "dez-barras-uma-placa",
        say: "Dez cubinhos fazem uma barra. Dez barras fazem uma placa.",
        show: { ...cena, agrupar: true },
        corrige: [CentenaMisconception.NAO_AGRUPA_DEZENAS],
        parcial: spec.centenas,
      },
      {
        id: "cada-ordem-vale",
        say: "Cada placa vale cem, cada barra vale dez, cada cubinho vale um.",
        show: { ...cena, destacarOrdem: "centenas" },
        corrige: [CentenaMisconception.IGNORA_VALOR],
        parcial: spec.centenas * 100,
      },
      {
        id: "ler-na-ordem",
        say: "Leia da placa para o cubinho: centenas, dezenas, unidades.",
        show: { ...cena, destacarOrdem: "unidades" },
        corrige: [CentenaMisconception.INVERTE_ORDENS],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N2.04 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirCentenaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N2.04") throw new Error(`centenaContract recebeu ${ficha.id}.`);
  const spec = construirCentenaSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N2.04 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "decompor"
    ? `No número ${spec.numero}, quantas ${spec.ordemPerguntada} há?`
    : spec.modo === "ler-e-montar"
      ? `Para montar ${spec.numero}, quantas placas de cem você precisa?`
      : "Quanto vale este material?";
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "centena-f37",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirCentenaResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
