import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

/**
 * F40 / N3.12 — a dezena desmonta.
 *
 * ## O espelho da N3.11, e por que é mais difícil
 *
 * Quando não há unidades suficientes para tirar, uma dezena pode ser
 * **desmontada em dez unidades**. Na adição a criança junta e o excesso é
 * evidente; na subtração ela precisa **perceber a falta antes de agir** —
 * olhar `42 − 17` e reconhecer que 2 não dá para tirar 7.
 *
 * ## O erro central tem nome e história
 *
 * `SUBTRAI_INVERTIDO` é fazer `7 − 2` nas unidades: inverter para escapar do
 * impasse. É o mesmo erro que a F34 pega na reta, agora na conta armada — e
 * aqui ele custa caro, porque a criança que inverte chega a um resultado
 * plausível e segue sem perceber.
 *
 * `NAO_OPEROU` é o outro lado: travar no impasse e devolver o minuendo. Um erra
 * agindo, o outro erra não agindo, e os dois pedem resgates diferentes.
 *
 * ## O nível cinco é o caso mais difícil da aritmética elementar
 *
 * Emprestar de uma coluna que tem zero — `403 − 158` — exige encadear duas
 * quebras: a centena vira dez dezenas, e uma delas vira dez unidades. É por
 * isso que ele é o último, e é por isso que o zero no meio é obrigatório ali em
 * vez de sorteado.
 */
export const DezenaDesmontaMisconception = {
  SUBTRAI_INVERTIDO: "subtrai-invertido",
  NAO_PAGA_EMPRESTIMO: "nao-paga-emprestimo",
  NAO_OPEROU: "nao-operou",
} as const;
export type DezenaDesmontaMisconceptionTag = typeof DezenaDesmontaMisconception[keyof typeof DezenaDesmontaMisconception];

export type DezenaDesmontaModo = "quebra-guiada" | "crianca-quebra" | "duas-ordens-com-material" | "so-a-conta" | "zero-no-meio";

export interface DezenaDesmontaF40Spec {
  nivel: number;
  modo: DezenaDesmontaModo;
  topo: number;
  base: number;
  resposta: number;
  /** L1 a L3 mostram o material dourado ao lado da conta. */
  mostrarMaterial: boolean;
  /** L5: o zero no meio exige encadear duas quebras. */
  zeroNoMeio: boolean;
  opcoes: Array<{ value: number; label: string; misconception?: DezenaDesmontaMisconceptionTag }>;
}

interface DezenaDesmontaShow {
  topo: number;
  base: number;
  quebrarDezena?: boolean;
  destacarFalta?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function opcoes(correta: number, erradas: Array<{ value: number; misconception: DezenaDesmontaMisconceptionTag }>): DezenaDesmontaF40Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value >= 0)
    .slice(0, 4);
}

/**
 * O erro de inverter as unidades, calculado como a criança o produz.
 *
 * Ela faz a coluna das unidades ao contrário — `|u_base − u_topo|` — e as
 * dezenas normalmente, sem pagar empréstimo nenhum. O resultado é plausível, e
 * é por isso que este erro passa despercebido sem um distrator que o nomeie.
 */
function invertendoAsUnidades(topo: number, base: number): number {
  const unidades = Math.abs((base % 10) - (topo % 10));
  const dezenas = Math.floor(topo / 10) - Math.floor(base / 10);
  return dezenas * 10 + unidades;
}

export function construirDezenaDesmontaSpec(level: number): DezenaDesmontaF40Spec {
  const nivel = clamp(level);
  const DM = DezenaDesmontaMisconception;

  if (nivel === 5) {
    // Zero no meio: a centena precisa quebrar para que a dezena possa quebrar.
    const centenas = ri(2, 9);
    const unidadesTopo = ri(0, 5);
    const topo = centenas * 100 + unidadesTopo;
    // A base tem unidade maior que a do topo (força o empréstimo) e dezena que
    // não cabe no zero (força a segunda quebra).
    const unidadesBase = ri(unidadesTopo + 1, 9);
    const dezenasBase = ri(1, 9);
    const base = (centenas - 1) * 100 + dezenasBase * 10 + unidadesBase;
    const resposta = topo - base;
    return {
      nivel, modo: "zero-no-meio", topo, base, resposta,
      mostrarMaterial: false, zeroNoMeio: true,
      opcoes: opcoes(resposta, [
        { value: invertendoAsUnidades(topo, base), misconception: DM.SUBTRAI_INVERTIDO },
        // Quebrou e não descontou: a dezena emprestada continuou lá.
        { value: resposta + 10, misconception: DM.NAO_PAGA_EMPRESTIMO },
        { value: topo, misconception: DM.NAO_OPEROU },
      ]),
    };
  }

  // L1 e L2: dois dígitos menos um dígito. L3 e L4: dois menos dois.
  const doisDigitos = nivel >= 3;

  /**
   * Sorteia o par recusando os casos em que os diagnósticos se confundem.
   *
   * O teste nominal cobrou isto antes da promoção: quando a diferença das
   * unidades é igual à unidade do topo, o resultado de INVERTER as unidades cai
   * exatamente sobre o minuendo. Aí o mesmo número na barra significaria duas
   * coisas — "inverteu para escapar" e "travou e devolveu o de cima" — e um
   * distrator que quer dizer dois erros não diagnostica nenhum.
   *
   * A recusa também cobre o caso em que inverter dá a resposta certa: ali o
   * erro central acertaria por acidente, que é pior que não medi-lo.
   */
  const sortear = () => {
    for (let tentativa = 0; tentativa < 200; tentativa += 1) {
      const dezenasTopo = ri(2, 9);
      const unidadesTopo = ri(0, 6);
      const topo = dezenasTopo * 10 + unidadesTopo;
      // A unidade da base é MAIOR que a do topo: é o impasse que a ficha ensina
      // a resolver. Sem ele não há empréstimo, e o nível vira N3.09 outra vez.
      const unidadesBase = ri(unidadesTopo + 1, 9);
      const dezenasBase = doisDigitos ? ri(1, dezenasTopo - 1) : 0;
      const base = dezenasBase * 10 + unidadesBase;
      const resposta = topo - base;
      const invertido = invertendoAsUnidades(topo, base);
      if (invertido === topo || invertido === resposta) continue;
      if (resposta + 10 === topo) continue;
      return { topo, base, resposta };
    }
    // Construção direta, mantendo o impasse e os três diagnósticos separados.
    const topo = doisDigitos ? 52 : 52;
    const base = doisDigitos ? 17 : 7;
    return { topo, base, resposta: topo - base };
  };

  const { topo, base, resposta } = sortear();

  return {
    nivel,
    modo: nivel === 1 ? "quebra-guiada" : nivel === 2 ? "crianca-quebra" : nivel === 3 ? "duas-ordens-com-material" : "so-a-conta",
    topo,
    base,
    resposta,
    mostrarMaterial: nivel <= 3,
    zeroNoMeio: false,
    opcoes: opcoes(resposta, [
      // O erro central: inverteu as unidades para escapar do impasse.
      { value: invertendoAsUnidades(topo, base), misconception: DM.SUBTRAI_INVERTIDO },
      // Quebrou a dezena e não a descontou.
      { value: resposta + 10, misconception: DM.NAO_PAGA_EMPRESTIMO },
      // Travou no impasse e devolveu o minuendo.
      { value: topo, misconception: DM.NAO_OPEROU },
    ]),
  };
}

export function construirDezenaDesmontaResolucao(spec: DezenaDesmontaF40Spec): ResolucaoDeclarativa<DezenaDesmontaShow, number, DezenaDesmontaMisconceptionTag> {
  const cena: DezenaDesmontaShow = { topo: spec.topo, base: spec.base };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "ver-a-falta",
        say: `Nas unidades: ${spec.topo % 10} não dá para tirar ${spec.base % 10}.`,
        show: { ...cena, destacarFalta: true },
        corrige: [DezenaDesmontaMisconception.SUBTRAI_INVERTIDO],
        parcial: spec.topo % 10,
      },
      {
        id: "quebrar",
        say: "Desmonte uma dezena: ela vira dez unidades.",
        show: { ...cena, quebrarDezena: true },
        corrige: [DezenaDesmontaMisconception.NAO_OPEROU],
        parcial: (spec.topo % 10) + 10,
      },
      {
        id: "pagar-o-emprestimo",
        say: "A dezena que quebrou não está mais lá: desconte uma.",
        show: { ...cena, quebrarDezena: true },
        corrige: [DezenaDesmontaMisconception.NAO_PAGA_EMPRESTIMO],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.12 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirDezenaDesmontaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.12") throw new Error(`dezenaDesmontaContract recebeu ${ficha.id}.`);
  const spec = construirDezenaDesmontaSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.12 sem micro L${spec.nivel}.`);

  const prompt = `${spec.topo} menos ${spec.base}.`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "dezena-desmonta-f40",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirDezenaDesmontaResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
