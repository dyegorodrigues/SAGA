import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

/**
 * F41 / N3.13 — cálculo mental e estimativa.
 *
 * ## A competência esquecida
 *
 * A criança que calcula `38 + 45` e responde 73 não percebe que está errado. Se
 * tivesse estimado — *"quarenta mais quarenta é oitenta, então dá uns oitenta e
 * poucos"* — teria detectado o erro sozinha.
 *
 * **Estimativa é o mecanismo de autocorreção.** É por isso que ela é uma
 * competência e não um enfeite: sem ela, todo erro de conta sobrevive até
 * alguém de fora apontar.
 *
 * ## Por que o L4 pergunta qual está errada
 *
 * `IGNORA_CONFLITO` é o erro mais interessante da ficha: a criança estima
 * oitenta, calcula setenta e três, e segue em frente sem notar que as duas
 * coisas não combinam. Um nível que só pede estimativa não pega isso — só pega
 * quem não sabe estimar. O nível que mostra respostas prontas e pergunta qual é
 * absurda cobra o uso da estimativa como ferramenta de checagem, que é para o
 * que ela serve.
 */
export const CalculoMentalMisconception = {
  NAO_ESTIMA: "nao-estima",
  ESTIMATIVA_ALEATORIA: "estimativa-aleatoria",
  IGNORA_CONFLITO: "ignora-conflito",
} as const;
export type CalculoMentalMisconceptionTag = typeof CalculoMentalMisconception[keyof typeof CalculoMentalMisconception];

export type CalculoMentalModo = "arredondar" | "estimar-soma" | "estimar-e-calcular" | "detectar-absurdo" | "mental-com-estrategia";

export interface CalculoMentalF41Spec {
  nivel: number;
  modo: CalculoMentalModo;
  a: number;
  b?: number;
  /** As parcelas arredondadas para a dezena — a estimativa em construção. */
  aRedondo: number;
  bRedondo?: number;
  estimativa: number;
  exato: number;
  /** No L4, as respostas oferecidas para julgar, uma delas absurda. */
  candidatas?: number[];
  /** No L4, qual das candidatas é a absurda. */
  absurda?: number;
  /**
   * A reta só aparece onde ela é a ferramenta.
   *
   * No L1 e no L2 a criança olha de qual dezena cada número está perto — é a
   * estratégia central da ficha, e é para isso que a reta serve. Do L3 em
   * diante ela calcula, e a ficha canônica nomeia a segunda primitiva como
   * `plain`: o modo simbólico.
   *
   * Manter a reta ali não era neutro. A CLASS-009 mediu: nos níveis de duas
   * parcelas a soma caía às vezes exatamente numa das dezenas marcadas, e a
   * tela passava a exibir a resposta por acidente do sorteio.
   */
  mostrarReta: boolean;
  resposta: number;
  opcoes: Array<{ value: number; label: string; misconception?: CalculoMentalMisconceptionTag }>;
}

interface CalculoMentalShow {
  a: number;
  b?: number;
  aRedondo: number;
  bRedondo?: number;
  destacarEstimativa?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/** Arredonda para a dezena, com o meio subindo. */
const paraDezena = (n: number) => Math.round(n / 10) * 10;

function opcoes(correta: number, erradas: Array<{ value: number; misconception: CalculoMentalMisconceptionTag }>): CalculoMentalF41Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value > 0)
    .slice(0, 4);
}

export function construirCalculoMentalSpec(level: number): CalculoMentalF41Spec {
  const nivel = clamp(level);
  const CM = CalculoMentalMisconception;

  // Números que não caem na dezena: arredondar precisa ter o que fazer.
  const sortearNaoRedondo = (min: number, max: number) => {
    for (let tentativa = 0; tentativa < 50; tentativa += 1) {
      const n = ri(min, max);
      if (n % 10 !== 0) return n;
    }
    return min + 3;
  };

  if (nivel === 1) {
    // Estimar a dezena mais próxima de um número só.
    const a = sortearNaoRedondo(11, 99);
    const aRedondo = paraDezena(a);
    return {
      nivel, modo: "arredondar", a, aRedondo, estimativa: aRedondo, exato: a, resposta: aRedondo,
      mostrarReta: true,
      // A sonda achou o buraco: quando o número arredonda para BAIXO, "cortou
      // o algarismo e desceu" dá exatamente a resposta certa, e os outros dois
      // distratores eram o mesmo valor. Sobravam duas alternativas.
      //
      // A outra marca da vizinhança é sempre distinta da resposta, e recebe a
      // etiqueta certa conforme o caso: se ela é a truncagem, o erro é ter
      // cortado o algarismo; se não, é ter ido para a marca errada sem medir.
      opcoes: opcoes(aRedondo, [
        {
          value: aRedondo === Math.floor(a / 10) * 10 ? aRedondo + 10 : Math.floor(a / 10) * 10,
          misconception: aRedondo === Math.floor(a / 10) * 10 ? CM.ESTIMATIVA_ALEATORIA : CM.NAO_ESTIMA,
        },
        { value: aRedondo + 20, misconception: CM.ESTIMATIVA_ALEATORIA },
        { value: aRedondo - 20, misconception: CM.ESTIMATIVA_ALEATORIA },
      ]),
    };
  }

  // O piso de 25 nas parcelas não é estético: com a reta mostrando as dezenas
  // ao redor delas, uma soma de parcelas pequenas cai DENTRO da reta e a
  // estimativa aparece marcada na tela. Com as duas a partir de 25, a soma
  // arredondada é sempre maior que a última marca desenhada.
  /**
   * As duas parcelas, recusando o caso em que a estimativa dá o exato.
   *
   * Os erros de arredondamento se cancelam quando um número sobe o mesmo tanto
   * que o outro desce — `62 + 68` estima 130 e vale 130. O teste nominal pegou
   * isso: num caso desses a ficha não tem o que ensinar, porque a distinção
   * entre "mais ou menos" e "exatamente" é justamente o que ela existe para
   * mostrar. E o distrator que oferece a outra das duas coisas colapsa em cima
   * da resposta, deixando o nível com menos alternativa.
   */
  const sortearParcelas = () => {
    for (let tentativa = 0; tentativa < 200; tentativa += 1) {
      const a = sortearNaoRedondo(25, 89);
      const b = sortearNaoRedondo(25, 89);
      if (paraDezena(a) + paraDezena(b) !== a + b) return { a, b };
    }
    return { a: 28, b: 34 };
  };

  const { a, b } = sortearParcelas();
  const aRedondo = paraDezena(a);
  const bRedondo = paraDezena(b);
  const estimativa = aRedondo + bRedondo;
  const exato = a + b;

  if (nivel === 4) {
    // Detectar o absurdo: três respostas, uma delas longe demais da estimativa.
    // "Longe demais" é objetivo aqui — mais de uma dezena e meia fora — e não
    // uma impressão: a criança precisa poder decidir comparando, não achando.
    // O desvio nunca leva a valor negativo. A CLASS-006 achou isto antes da
    // promoção: com parcelas pequenas, `exato − 60` dava zero ou menos, o
    // filtro de valores positivos descartava a alternativa, e o que caía fora
    // da barra era A RESPOSTA CERTA. O gate não disse "opção estranha", disse
    // "perdeu o gabarito durante a serialização" — que é exatamente o que era.
    const desvio = ri(30, 60);
    const absurda = exato - desvio > 0 && Math.random() < 0.5 ? exato - desvio : exato + desvio;
    const candidatas = [exato, estimativa, absurda]
      .map((valor, indice) => ({ valor, indice }))
      .sort((x, y) => (x.valor === absurda ? 1 : y.valor === absurda ? -1 : x.indice - y.indice))
      .map(x => x.valor);
    return {
      nivel, modo: "detectar-absurdo", a, b, aRedondo, bRedondo, estimativa, exato,
      candidatas, absurda, resposta: absurda, mostrarReta: false,
      opcoes: opcoes(absurda, [
        // Apontou o resultado exato como se fosse o errado: não usou a
        // estimativa para comparar.
        { value: exato, misconception: CM.IGNORA_CONFLITO },
        { value: estimativa, misconception: CM.IGNORA_CONFLITO },
      ]),
    };
  }

  // L2 estima; L3 estima e calcula; L5 calcula de cabeça.
  const pedeExato = nivel >= 3;
  const resposta = pedeExato ? exato : estimativa;
  return {
    nivel,
    modo: nivel === 2 ? "estimar-soma" : nivel === 3 ? "estimar-e-calcular" : "mental-com-estrategia",
    a,
    b,
    aRedondo,
    bRedondo,
    estimativa,
    exato,
    resposta,
    // A reta é do L2; do L3 em diante a ficha pede cálculo, no modo simbólico.
    mostrarReta: nivel === 2,
    opcoes: opcoes(resposta, [
      // Trocou estimativa por exato ou vice-versa: não distingue as duas coisas.
      { value: pedeExato ? estimativa : exato, misconception: CM.IGNORA_CONFLITO },
      // Somou só as dezenas e largou as unidades.
      { value: Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10, misconception: CM.NAO_ESTIMA },
      // Uma dezena fora, sem critério — para os dois lados, porque com um só
      // as colisões entre os outros distratores deixavam o nível com duas
      // alternativas, e duas alternativas são cara ou coroa.
      { value: resposta + 10, misconception: CM.ESTIMATIVA_ALEATORIA },
      { value: resposta - 10, misconception: CM.ESTIMATIVA_ALEATORIA },
    ]),
  };
}

export function construirCalculoMentalResolucao(spec: CalculoMentalF41Spec): ResolucaoDeclarativa<CalculoMentalShow, number, CalculoMentalMisconceptionTag> {
  const cena: CalculoMentalShow = { a: spec.a, b: spec.b, aRedondo: spec.aRedondo, bRedondo: spec.bRedondo };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "arredondar",
        say: spec.b === undefined
          ? `Arredonde ${spec.a} para a dezena mais perto.`
          : `${spec.a} é perto de ${spec.aRedondo}. ${spec.b} é perto de ${spec.bRedondo}.`,
        show: cena,
        corrige: [CalculoMentalMisconception.NAO_ESTIMA],
        parcial: spec.aRedondo,
      },
      {
        id: "estimar",
        say: spec.b === undefined
          ? "Essa é a dezena mais próxima."
          : `Então a resposta é perto de ${spec.estimativa}.`,
        show: { ...cena, destacarEstimativa: true },
        corrige: [CalculoMentalMisconception.ESTIMATIVA_ALEATORIA],
        parcial: spec.estimativa,
      },
      {
        id: "conferir",
        say: "Se a conta der muito longe disso, alguma coisa está errada.",
        show: { ...cena, destacarEstimativa: true },
        corrige: [CalculoMentalMisconception.IGNORA_CONFLITO],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.13 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirCalculoMentalQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.13") throw new Error(`calculoMentalContract recebeu ${ficha.id}.`);
  const spec = construirCalculoMentalSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.13 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "arredondar"
    ? `Qual é a dezena mais perto de ${spec.a}?`
    : spec.modo === "estimar-soma"
      ? `Mais ou menos quanto dá ${spec.a} + ${spec.b}?`
      : spec.modo === "detectar-absurdo"
        ? `Uma destas respostas para ${spec.a} + ${spec.b} não pode estar certa. Qual?`
        : `Quanto é ${spec.a} + ${spec.b}?`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "calculo-mental-f41",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirCalculoMentalResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
