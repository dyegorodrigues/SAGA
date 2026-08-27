import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const MapaTesouroMisconception = {
  INVERTE_COORDENADAS: "inverte-coordenadas",
  SO_UMA_COORDENADA: "so-uma-coordenada",
  CONFUNDE_LINHA_COLUNA: "confunde-linha-coluna",
} as const;
export type MapaTesouroMisconceptionTag = typeof MapaTesouroMisconception[keyof typeof MapaTesouroMisconception];
export type MapaTesouroModo = "achar-objeto" | "dizer-coordenada" | "colocar-objeto" | "descrever-caminho" | "pre-cartesiano";

export interface MapaTesouroOpcao { value: number; label: string; misconception?: MapaTesouroMisconceptionTag }
export interface MapaTesouroF60Spec {
  nivel: number;
  modo: MapaTesouroModo;
  gradeSize: number;
  colunas: string[];
  linhas: string[];
  alvoColuna: number;
  alvoLinha: number;
  /** A casa de partida do caminho de L4. Os outros níveis não têm origem. */
  origemColuna?: number;
  origemLinha?: number;
  objetivo: string;
  resposta: number;
  opcoes: MapaTesouroOpcao[];
}
interface MapaTesouroShow {
  gradeSize: number;
  coluna: number;
  linha: number;
  destacarColuna?: boolean;
  destacarLinha?: boolean;
  piscarIntersecao?: boolean;
}

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

/** Um número por casa: coluna nas dezenas, linha nas unidades. */
const casa = (coluna: number, linha: number) => coluna * 10 + linha;

const LETRAS = ["A", "B", "C", "D", "E"] as const;
const NUMEROS = ["1", "2", "3", "4", "5"] as const;

/** Sorteia um valor no intervalo evitando os que já estão em uso. */
function outro(maximo: number, ...evitar: number[]): number {
  const livres = Array.from({ length: maximo }, (_, i) => i + 1).filter(valor => !evitar.includes(valor));
  return livres[ri(0, livres.length - 1)];
}

/**
 * CLASS-003 — o tesouro muda de casa, a escada não.
 *
 * Estava sempre no mesmo lugar: B2, C4, D2, D2 e (3,2). Decorar cinco rótulos
 * vencia a competência inteira sem a criança cruzar coluna com linha uma vez.
 *
 * O que continua fixo é o degrau: o tamanho da grade, se os eixos são
 * letra/número ou número/número, e o que o nível pede — achar, dizer, colocar,
 * descrever o caminho, ler os dois eixos numéricos.
 *
 * Coluna e linha nunca saem iguais. Numa casa da diagonal, trocar uma pela
 * outra devolve a MESMA casa: o distrator de inversão viraria uma segunda
 * alternativa certa, e a deduplicação o apagaria — o erro que a ficha mais
 * nomeia sumiria da tela justamente onde ele é invisível.
 */
export function construirMapaTesouroF60Spec(level: number): MapaTesouroF60Spec {
  const nivel = clamp(level);
  const gradeSize = nivel === 1 ? 3 : 5;
  const eixoHorizontalNumerico = nivel === 5;
  const colunas = [...(eixoHorizontalNumerico ? NUMEROS : LETRAS)].slice(0, gradeSize);
  const linhas = [...NUMEROS].slice(0, gradeSize);

  const alvoColuna = ri(1, gradeSize);
  const alvoLinha = outro(gradeSize, alvoColuna);
  const nomeCasa = (coluna: number, linha: number) =>
    eixoHorizontalNumerico ? `(${colunas[coluna - 1]}, ${linhas[linha - 1]})` : `${colunas[coluna - 1]}${linhas[linha - 1]}`;

  const inverte = { value: casa(alvoLinha, alvoColuna), label: nomeCasa(alvoLinha, alvoColuna), misconception: MapaTesouroMisconception.INVERTE_COORDENADAS };
  const base = { nivel, gradeSize, colunas, linhas, alvoColuna, alvoLinha };

  if (nivel === 4) {
    // O caminho sobe e vai para a direita: a origem fica à esquerda e mais
    // embaixo. `dx` e `dy` precisam diferir, senão "3 à direita, 3 para cima" e
    // a versão invertida dizem a mesma coisa e o distrator some.
    for (;;) {
      const origemColuna = ri(1, gradeSize - 1);
      const destinoColuna = ri(origemColuna + 1, gradeSize);
      const destinoLinha = ri(1, gradeSize - 1);
      const origemLinha = ri(destinoLinha + 1, gradeSize);
      const dx = destinoColuna - origemColuna;
      const dy = origemLinha - destinoLinha;
      if (dx === dy || destinoColuna === destinoLinha) continue;
      return {
        ...base, modo: "descrever-caminho", alvoColuna: destinoColuna, alvoLinha: destinoLinha, origemColuna, origemLinha,
        objetivo: `Saia de ${nomeCasa(origemColuna, origemLinha)} e chegue a ${nomeCasa(destinoColuna, destinoLinha)}.`,
        resposta: 1,
        opcoes: [
          { value: 1, label: `${dx} à direita, ${dy} para cima` },
          { value: 2, label: `${dy} à direita, ${dx} para cima`, misconception: MapaTesouroMisconception.INVERTE_COORDENADAS },
          { value: 3, label: `${dx} à direita`, misconception: MapaTesouroMisconception.SO_UMA_COORDENADA },
          { value: 4, label: `${dx} à esquerda, ${dy} para baixo`, misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA },
        ],
      };
    }
  }

  if (nivel === 1) {
    const outraColuna = outro(gradeSize, alvoColuna, alvoLinha);
    const outraLinha = outro(gradeSize, alvoLinha, alvoColuna);
    return {
      ...base, modo: "achar-objeto",
      objetivo: `Ache a coluna ${colunas[alvoColuna - 1]} e depois a linha ${linhas[alvoLinha - 1]}.`,
      resposta: casa(alvoColuna, alvoLinha),
      opcoes: [
        { value: casa(alvoColuna, alvoLinha), label: nomeCasa(alvoColuna, alvoLinha) },
        { value: casa(outraColuna, alvoLinha), label: nomeCasa(outraColuna, alvoLinha), misconception: MapaTesouroMisconception.SO_UMA_COORDENADA },
        { value: casa(alvoColuna, outraLinha), label: nomeCasa(alvoColuna, outraLinha), misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA },
        inverte,
      ],
    };
  }

  if (nivel === 3) {
    const outraLinha = outro(gradeSize, alvoLinha, alvoColuna);
    return {
      ...base, modo: "colocar-objeto",
      objetivo: `Coloque o tesouro em ${nomeCasa(alvoColuna, alvoLinha)}.`,
      resposta: casa(alvoColuna, alvoLinha),
      opcoes: [
        { value: casa(alvoColuna, alvoLinha), label: nomeCasa(alvoColuna, alvoLinha) },
        inverte,
        { value: casa(alvoColuna, outraLinha), label: nomeCasa(alvoColuna, outraLinha), misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA },
        // Linha sem coluna: a casa não existe, e é esse o ponto — quem usa uma
        // coordenada só não aponta lugar nenhum.
        { value: alvoLinha * 10, label: `linha ${linhas[alvoLinha - 1]}`, misconception: MapaTesouroMisconception.SO_UMA_COORDENADA },
      ],
    };
  }

  const outraColuna = outro(gradeSize, alvoColuna, alvoLinha);
  return {
    ...base, modo: nivel === 2 ? "dizer-coordenada" : "pre-cartesiano",
    objetivo: nivel === 2 ? "Diga a coordenada do tesouro." : "Use os dois eixos numéricos.",
    resposta: casa(alvoColuna, alvoLinha),
    opcoes: [
      { value: casa(alvoColuna, alvoLinha), label: nomeCasa(alvoColuna, alvoLinha) },
      inverte,
      { value: alvoColuna * 10, label: colunas[alvoColuna - 1], misconception: MapaTesouroMisconception.SO_UMA_COORDENADA },
      { value: casa(outraColuna, alvoLinha), label: nomeCasa(outraColuna, alvoLinha), misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA },
    ],
  };
}

export function construirMapaTesouroResolucao(spec: MapaTesouroF60Spec): ResolucaoDeclarativa<MapaTesouroShow, number, MapaTesouroMisconceptionTag> {
  const base = { gradeSize: spec.gradeSize, coluna: spec.alvoColuna, linha: spec.alvoLinha };
  return {
    estadoInicial: base,
    passos: [
      { id: "localizar-coluna", say: `Primeiro ache a coluna ${spec.colunas[spec.alvoColuna - 1]}.`, show: { ...base, destacarColuna: true }, corrige: [MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA, MapaTesouroMisconception.INVERTE_COORDENADAS], parcial: spec.resposta },
      { id: "localizar-linha", say: `Agora ache a linha ${spec.linhas[spec.alvoLinha - 1]}.`, show: { ...base, destacarColuna: true, destacarLinha: true }, corrige: [MapaTesouroMisconception.SO_UMA_COORDENADA], parcial: spec.resposta },
      { id: "cruzar-informacoes", say: "A posição é a célula onde as duas faixas se cruzam.", show: { ...base, destacarColuna: true, destacarLinha: true, piscarIntersecao: true }, corrige: [MapaTesouroMisconception.INVERTE_COORDENADAS], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.05 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirMapaTesouroQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.05") throw new Error(`mapaTesouroContract recebeu ${ficha.id}.`);
  const spec = construirMapaTesouroF60Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.05 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "colocar-objeto" ? spec.objetivo : spec.modo === "descrever-caminho" ? `${spec.objetivo} Qual caminho funciona?` : spec.modo === "pre-cartesiano" ? "Onde está o tesouro? Responda na ordem horizontal, vertical." : "Onde está o tesouro? Primeiro a coluna, depois a linha.";
  const options: Option[] = spec.opcoes;
  return {
    kind: "mapa-tesouro-f60",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirMapaTesouroResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
