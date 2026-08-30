import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F16 / N3.05 — a família de fatos aditiva.
 *
 * ## O que a ficha reduz pela metade
 *
 * Três, quatro e sete são **uma relação**, e dela saem quatro contas:
 * `3+4=7`, `4+3=7`, `7−3=4`, `7−4=3`. Quem entende a família não decora
 * subtração separadamente: sabendo `3+4=7`, deduz `7−4=3`.
 *
 * O que trava é tratar adição e subtração como assuntos diferentes, aprendidos
 * em capítulos diferentes — o dobro do trabalho, e sem enxergar a ligação. É o
 * erro que a ficha chama `SEPARA_OPERACOES`, e o alvo dela é o `NAO_USA_FAMILIA`:
 * refazer a conta em vez de deduzir.
 *
 * ## O triângulo e o vértice que não sabe a resposta
 *
 * O todo no topo, as partes embaixo. Cobrir o topo pede uma adição; cobrir uma
 * parte pede uma subtração. A mesma figura gera as quatro contas.
 *
 * O vértice perguntado recebe `'?'` **literalmente** — o valor não chega ao
 * componente, então ele não tem como mostrar a resposta nem por acidente. É a
 * mesma regra do triângulo multiplicativo da N4.06, e existe porque um número
 * passado "só para o layout" é um gabarito esperando um bug de renderização.
 *
 * ## As contas de apoio vêm mascaradas
 *
 * As outras frases da família aparecem para ensinar a ESTRUTURA — os mesmos três
 * números fazem quatro contas —, mas com o resultado escondido. Escrever
 * `4 + 3 = 7` ao lado de `3 + 4 = ?` seria entregar o gabarito em outra ordem.
 */
export const FamiliaAditivaMisconception = {
  RESPONDE_O_TODO: "responde-o-todo",
  INVERTE_PARTES: "inverte-partes",
} as const;
export type FamiliaAditivaMisconceptionTag = typeof FamiliaAditivaMisconception[keyof typeof FamiliaAditivaMisconception];

export type FamiliaAditivaModo = "somas-ate-cinco" | "somas-ate-dez" | "soma-e-subtracao" | "quatro-contas" | "descobrir-o-trio";
export type VerticeOculto = "todo" | "parte1" | "parte2";
export type FamiliaAditivaFamilia = "adicao" | "subtracao";

export interface FamiliaAditivaF16Spec {
  nivel: number;
  modo: FamiliaAditivaModo;
  /** As duas partes e o todo. O oculto NÃO viaja como número. */
  parte1: number;
  parte2: number;
  todo: number;
  oculto: VerticeOculto;
  /** O triângulo como o componente o recebe: o vértice perguntado é `'?'`. */
  triangulo: { topo: number | "?"; esquerda: number | "?"; direita: number | "?" };
  /** As outras contas da família, com o resultado sempre mascarado. */
  apoio: string[];
  /** A conta que está sendo perguntada, escrita. */
  contaEmAberto: string;
  /**
   * L5 esconde a conta escrita: sobra o triângulo com um círculo vazio.
   *
   * É a inversão que a ficha canônica chama de raciocínio maduro — em vez de
   * completar uma conta dada, a criança lê a figura e descobre qual operação a
   * relação pede. Sem isso o L5 seria o L4 outra vez, com os mesmos números e a
   * mesma tela: CLASS-001 na origem.
   */
  mostrarConta: boolean;
  familia: FamiliaAditivaFamilia;
  resposta: number;
  opcoes: Array<{ value: number; label: string; misconception?: FamiliaAditivaMisconceptionTag }>;
}

interface FamiliaAditivaShow {
  parte1: number;
  parte2: number;
  todo: number;
  oculto: VerticeOculto;
  acenderLinhas?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function opcoes(correta: number, erradas: Array<{ value: number; misconception: FamiliaAditivaMisconceptionTag }>): FamiliaAditivaF16Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value >= 0)
    .slice(0, 4);
}

/**
 * As outras contas da família, com o resultado E o vértice oculto escondidos.
 *
 * Mascarar só o resultado não bastava, e a sonda mostrou por quê: perguntado o
 * todo de `1 + 2`, o apoio saía como `3 − 1 = ?` e `3 − 2 = ?`. O três que o
 * triângulo escondia estava escrito ali do lado, duas vezes. A criança não
 * precisava somar nada — bastava ler.
 *
 * É a CLASS-009 pela porta dos fundos: a tela não declara a resposta no lugar
 * da resposta, declara no apoio. Então o número oculto vira `?` em toda parte,
 * e o apoio passa a ensinar só o que devia ensinar — que os mesmos três números
 * fazem quatro frases.
 */
function apoioMascarado(parte1: number, parte2: number, todo: number, oculto: VerticeOculto, emAberto: string): string[] {
  const v = (valor: number, qual: VerticeOculto) => (oculto === qual ? "?" : String(valor));
  const t = v(todo, "todo");
  const p1 = v(parte1, "parte1");
  const p2 = v(parte2, "parte2");
  return [
    `${p1} + ${p2} = ?`,
    `${p2} + ${p1} = ?`,
    `${t} − ${p1} = ?`,
    `${t} − ${p2} = ?`,
  ].filter(conta => conta !== emAberto);
}

export function construirFamiliaAditivaSpec(level: number, verticePedido?: VerticeOculto): FamiliaAditivaF16Spec {
  const nivel = clamp(level);
  const FM = FamiliaAditivaMisconception;

  // A escada é de tamanho do todo e de que operações o nível pede.
  const todoMax = nivel === 1 ? 5 : nivel <= 3 ? 10 : 20;
  const todoMin = nivel === 1 ? 3 : nivel <= 3 ? 6 : 11;
  const todo = ri(todoMin, todoMax);
  // Partes distintas: com `3 + 3 = 6` as duas subtrações da família viram a
  // mesma conta, e o trio deixa de gerar quatro frases diferentes.
  let parte1 = ri(1, todo - 1);
  if (parte1 * 2 === todo) parte1 = parte1 === 1 ? 2 : parte1 - 1;
  const parte2 = todo - parte1;

  // L1 e L2 só pedem soma — o vértice oculto é sempre o todo. Do L3 em diante a
  // subtração entra, e é ela que prova a dedução.
  const oculto: VerticeOculto = nivel <= 2
    ? "todo"
    : verticePedido ?? (Math.random() < 0.5 ? "todo" : (Math.random() < 0.5 ? "parte1" : "parte2"));

  const resposta = oculto === "todo" ? todo : oculto === "parte1" ? parte1 : parte2;
  const outraParte = oculto === "parte1" ? parte2 : parte1;
  const contaEmAberto = oculto === "todo"
    ? `${parte1} + ${parte2} = ?`
    : `${todo} − ${outraParte} = ?`;
  // A conta em aberto nunca contém o vértice oculto: quando se pergunta o todo,
  // ela é a soma das partes; quando se pergunta uma parte, é o todo menos a
  // outra. Em nenhum dos dois casos o número perguntado aparece escrito.

  return {
    nivel,
    modo: nivel === 1 ? "somas-ate-cinco" : nivel === 2 ? "somas-ate-dez" : nivel === 3 ? "soma-e-subtracao" : nivel === 4 ? "quatro-contas" : "descobrir-o-trio",
    parte1,
    parte2,
    todo,
    oculto,
    triangulo: {
      topo: oculto === "todo" ? "?" : todo,
      esquerda: oculto === "parte1" ? "?" : parte1,
      direita: oculto === "parte2" ? "?" : parte2,
    },
    apoio: apoioMascarado(parte1, parte2, todo, oculto, contaEmAberto),
    contaEmAberto,
    mostrarConta: nivel <= 4,
    familia: oculto === "todo" ? "adicao" : "subtracao",
    resposta,
    opcoes: opcoes(resposta, [
      // Na subtração, respondeu o todo: não entendeu a direção da operação.
      ...(oculto === "todo" ? [] : [{ value: todo, misconception: FM.RESPONDE_O_TODO }]),
      // Trocou as partes: `7 − 3` respondido como 3.
      ...(oculto === "todo" ? [] : [{ value: outraParte, misconception: FM.INVERTE_PARTES }]),
      // Na adição, os erros possíveis são somar uma parte só ou trocar a
      // operação — os dois são a família não sendo vista como relação.
      // Na adição: responder uma das partes é não ter juntado; responder a
      // diferença é ter trocado a operação. As duas partes entram porque com
      // trios pequenos — `1 + 2` — a diferença coincide com uma delas, e sem a
      // terceira o nível ficava com duas alternativas, que é cara ou coroa.
      ...(oculto === "todo" ? [
        { value: parte1, misconception: FM.INVERTE_PARTES },
        { value: parte2, misconception: FM.INVERTE_PARTES },
        { value: Math.abs(parte1 - parte2), misconception: FM.RESPONDE_O_TODO },
      ] : []),
    ]),
  };
}

export function construirFamiliaAditivaResolucao(spec: FamiliaAditivaF16Spec): ResolucaoDeclarativa<FamiliaAditivaShow, number, FamiliaAditivaMisconceptionTag> {
  const cena: FamiliaAditivaShow = { parte1: spec.parte1, parte2: spec.parte2, todo: spec.todo, oculto: spec.oculto };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "ler-o-triangulo",
        say: "O de cima é o todo. Os de baixo são as partes.",
        show: cena,
        corrige: [FamiliaAditivaMisconception.RESPONDE_O_TODO],
        parcial: spec.todo,
      },
      {
        id: "juntar-ou-tirar",
        say: spec.familia === "adicao"
          ? "As partes juntas fazem o todo."
          : "Tirando uma parte do todo, sobra a outra.",
        show: { ...cena, acenderLinhas: true },
        corrige: [FamiliaAditivaMisconception.INVERTE_PARTES],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.05 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    // CLASS-008: o §9 pede pelo menos uma subtração DEDUZIDA. A exigência
    // precisa viajar com a questão, senão a ficha pede e o motor não cobra.
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirFamiliaAditivaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.05") throw new Error(`familiaAditivaContract recebeu ${ficha.id}.`);
  const spec = construirFamiliaAditivaSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.05 sem micro L${spec.nivel}.`);

  const prompt = spec.familia === "adicao"
    ? `As duas partes juntas: quanto dá?`
    : `Tirando uma parte do todo: o que sobra?`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "familia-aditiva-f16",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirFamiliaAditivaResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, spec.familia),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
