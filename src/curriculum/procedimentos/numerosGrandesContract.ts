import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F65 / N2.05 — números grandes e arredondamento.
 *
 * ## Arredondar é competência, não truque
 *
 * Arredondar é decidir **qual precisão importa**. É a base da estimativa, da
 * checagem de resultado e do senso numérico — e é por isso que o L4 pergunta
 * para QUAL ordem arredondar, em vez de mandar arredondar para uma ordem dada.
 *
 * ## A regra que deixa de ser arbitrária
 *
 * Na reta, arredondar é ver de qual marca o número está mais perto. O "cinco
 * arredonda para cima" para de ser regra decorada quando a criança vê que ali o
 * número está exatamente no meio — e que a escolha é uma convenção, não uma
 * distância.
 *
 * Por isso o caso do meio exato tem família própria: quem só praticou números
 * claramente mais perto de uma das marcas nunca encontrou a convenção, e é
 * justamente nela que o `ARREDONDA_SEMPRE_BAIXO` aparece.
 */
export const NumerosGrandesMisconception = {
  ARREDONDA_SEMPRE_BAIXO: "arredonda-sempre-baixo",
  IGNORA_DISTANCIA: "ignora-distancia",
  ORDEM_ERRADA: "ordem-errada",
} as const;
export type NumerosGrandesMisconceptionTag = typeof NumerosGrandesMisconception[keyof typeof NumerosGrandesMisconception];

export type NumerosGrandesModo = "dezena" | "centena" | "milhar" | "escolher-precisao" | "estimar-operacao";
export type FamiliaDaMarca = "mais-perto-de-uma" | "bem-no-meio";

export interface NumerosGrandesF65Spec {
  nivel: number;
  modo: NumerosGrandesModo;
  /** O número a arredondar, ou o primeiro operando na estimativa. */
  numero: number;
  /** A ordem para a qual se arredonda: 10, 100 ou 1000. */
  ordem: number;
  /** As duas marcas que cercam o número na reta. */
  marcaAbaixo: number;
  marcaAcima: number;
  /** O número está exatamente no meio entre as marcas? */
  bemNoMeio: boolean;
  /** No L5, o segundo operando da estimativa. */
  segundo?: number;
  resposta: number;
  familia: FamiliaDaMarca;
  opcoes: Array<{ value: number; label: string; misconception?: NumerosGrandesMisconceptionTag }>;
}

interface NumerosGrandesShow {
  numero: number;
  marcaAbaixo: number;
  marcaAcima: number;
  destacarMeio?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function opcoes(correta: number, erradas: Array<{ value: number; misconception: NumerosGrandesMisconceptionTag }>): NumerosGrandesF65Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value >= 0)
    .slice(0, 4);
}

/** Arredonda pela distância, com o meio exato subindo — a convenção. */
function arredondar(numero: number, ordem: number): number {
  const abaixo = Math.floor(numero / ordem) * ordem;
  const resto = numero - abaixo;
  return resto * 2 >= ordem ? abaixo + ordem : abaixo;
}

export function construirNumerosGrandesSpec(level: number, familiaPedida?: FamiliaDaMarca): NumerosGrandesF65Spec {
  const nivel = clamp(level);
  const NM = NumerosGrandesMisconception;

  const ordem = nivel === 1 ? 10 : nivel === 2 ? 100 : 1000;
  // O meio exato é onde a convenção mora, e por isso é sorteado de propósito em
  // vez de aparecer por acaso: com números sempre claramente mais perto de uma
  // marca, a criança nunca encontra a regra do cinco.
  const familia: FamiliaDaMarca = familiaPedida ?? (Math.random() < 0.35 ? "bem-no-meio" : "mais-perto-de-uma");

  if (nivel === 4) {
    // Escolher a precisão: o número é o mesmo, e o que se pergunta é para qual
    // ordem arredondar faz sentido no contexto.
    const numero = ri(1200, 9800);
    const paraMilhar = arredondar(numero, 1000);
    return {
      nivel, modo: "escolher-precisao", numero, ordem: 1000,
      marcaAbaixo: Math.floor(numero / 1000) * 1000,
      marcaAcima: Math.floor(numero / 1000) * 1000 + 1000,
      bemNoMeio: false, resposta: paraMilhar, familia: "mais-perto-de-uma",
      opcoes: opcoes(paraMilhar, [
        // Arredondou para a ordem errada: deu a centena quando se pedia milhar.
        { value: arredondar(numero, 100), misconception: NM.ORDEM_ERRADA },
        { value: arredondar(numero, 10), misconception: NM.ORDEM_ERRADA },
        { value: Math.floor(numero / 1000) * 1000, misconception: NM.ARREDONDA_SEMPRE_BAIXO },
      ]),
    };
  }

  if (nivel === 5) {
    // Estimar a operação: arredondar os dois e somar. O que se mede é a
    // estimativa, não a conta exata.
    // As duas parcelas, recusando o caso em que a estimativa dá o exato.
    //
    // Os erros de arredondamento se cancelam quando um número sobe o mesmo
    // tanto que o outro desce, e aí "mais ou menos quanto dá" e "quanto dá"
    // viram a mesma pergunta — justamente a distinção que o nível existe para
    // ensinar. Foi esta a falha intermitente que apareceu uma vez na suíte
    // completa e não voltou nas duas execuções seguintes: ela dependia do
    // sorteio, e o teste nominal desta ficha é que a pegou.
    const sortearParcelas = () => {
      for (let tentativa = 0; tentativa < 200; tentativa += 1) {
        const p1 = ri(120, 890);
        const p2 = ri(120, 890);
        if (arredondar(p1, 100) + arredondar(p2, 100) !== p1 + p2) return { p1, p2 };
      }
      return { p1: 180, p2: 240 };
    };
    const { p1: primeiro, p2: segundo } = sortearParcelas();
    const estimativa = arredondar(primeiro, 100) + arredondar(segundo, 100);
    return {
      nivel, modo: "estimar-operacao", numero: primeiro, segundo, ordem: 100,
      marcaAbaixo: Math.floor(primeiro / 100) * 100,
      marcaAcima: Math.floor(primeiro / 100) * 100 + 100,
      bemNoMeio: false, resposta: estimativa, familia: "mais-perto-de-uma",
      opcoes: opcoes(estimativa, [
        // Arredondou os dois para baixo.
        { value: Math.floor(primeiro / 100) * 100 + Math.floor(segundo / 100) * 100, misconception: NM.ARREDONDA_SEMPRE_BAIXO },
        // Arredondou na ordem errada.
        { value: arredondar(primeiro, 10) + arredondar(segundo, 10), misconception: NM.ORDEM_ERRADA },
        // Uma centena fora, para os dois lados: com um só, quando as duas
        // parcelas arredondam para baixo o distrator de baixo colapsa em cima
        // da resposta e o nível podia ficar com duas alternativas.
        { value: estimativa + 100, misconception: NM.IGNORA_DISTANCIA },
        { value: estimativa - 100, misconception: NM.IGNORA_DISTANCIA },
      ]),
    };
  }

  // L1 a L3: arredondar para a ordem do nível.
  const blocos = nivel === 1 ? ri(2, 9) : nivel === 2 ? ri(2, 9) : ri(2, 9);
  const marcaAbaixo = blocos * ordem;
  const marcaAcima = marcaAbaixo + ordem;
  // No meio exato, o resto é metade da ordem. Fora dele, qualquer outro resto.
  const meio = ordem / 2;
  const resto = familia === "bem-no-meio"
    ? meio
    : (Math.random() < 0.5 ? ri(1, meio - 1) : ri(meio + 1, ordem - 1));
  const numero = marcaAbaixo + resto;
  const resposta = arredondar(numero, ordem);

  return {
    nivel,
    modo: nivel === 1 ? "dezena" : nivel === 2 ? "centena" : "milhar",
    numero,
    ordem,
    marcaAbaixo,
    marcaAcima,
    bemNoMeio: familia === "bem-no-meio",
    resposta,
    familia,
    opcoes: opcoes(resposta, [
      // Arredondou sempre para baixo, sem olhar a distância.
      { value: marcaAbaixo, misconception: NM.ARREDONDA_SEMPRE_BAIXO },
      // Foi para a marca errada apesar da distância.
      { value: resposta === marcaAbaixo ? marcaAcima : marcaAbaixo, misconception: NM.IGNORA_DISTANCIA },
      // Arredondou para a ordem de baixo.
      { value: arredondar(numero, Math.max(10, ordem / 10)), misconception: NM.ORDEM_ERRADA },
    ]),
  };
}

export function construirNumerosGrandesResolucao(spec: NumerosGrandesF65Spec): ResolucaoDeclarativa<NumerosGrandesShow, number, NumerosGrandesMisconceptionTag> {
  const cena: NumerosGrandesShow = { numero: spec.numero, marcaAbaixo: spec.marcaAbaixo, marcaAcima: spec.marcaAcima };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "as-duas-marcas",
        say: `Olhe as duas marcas ao redor: ${spec.marcaAbaixo} e ${spec.marcaAcima}.`,
        show: cena,
        corrige: [NumerosGrandesMisconception.ORDEM_ERRADA],
        parcial: spec.marcaAbaixo,
      },
      {
        id: "qual-esta-mais-perto",
        say: spec.bemNoMeio
          ? "Este está bem no meio. Quando empata, a regra manda subir."
          : "Veja de qual marca o número está mais perto.",
        show: { ...cena, destacarMeio: spec.bemNoMeio },
        corrige: [NumerosGrandesMisconception.ARREDONDA_SEMPRE_BAIXO, NumerosGrandesMisconception.IGNORA_DISTANCIA],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N2.05 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirNumerosGrandesQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N2.05") throw new Error(`numerosGrandesContract recebeu ${ficha.id}.`);
  const spec = construirNumerosGrandesSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N2.05 sem micro L${spec.nivel}.`);

  const nomeDaOrdem = spec.ordem === 10 ? "dezena" : spec.ordem === 100 ? "centena" : "milhar";
  const prompt = spec.modo === "estimar-operacao"
    ? `Mais ou menos quanto dá ${spec.numero} + ${spec.segundo}?`
    : `Arredonde ${spec.numero} para a ${nomeDaOrdem} mais próxima.`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "numeros-grandes-f65",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirNumerosGrandesResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    // A família da marca só existe nos níveis que arredondam um número: no L4 a
    // pergunta é de precisão e no L5 é de estimativa, e nenhum dos dois coloca
    // a criança diante do empate.
    ...(spec.nivel <= 3 ? { evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, spec.familia) } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
