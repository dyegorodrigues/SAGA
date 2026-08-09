import { FichaCompetencia } from "../schema";
import { Question } from "../../types";

export type DistribuicaoGrupo = "normal" | "compacta" | "espalhada";

export interface GrupoQuantidadeSpec {
  quantidade: number;
  emoji: string;
  escalaItem: number;
  distribuicao: DistribuicaoGrupo;
  caixa: { largura: number; altura: number };
}

export interface ComparacaoQuantidadeSpec {
  /** Discriminante do modo alternativo do palco Grupo-backed de grandezas. */
  modo: "quantidade";
  nivel: number;
  grupos: [GrupoQuantidadeSpec, GrupoQuantidadeSpec];
  resposta: 0 | 1;
  mesmaIdentidade: boolean;
  armadilhaTamanho: boolean;
  armadilhaEspaco: boolean;
  pareamentoDisponivel: boolean;
  autoParearNoErro: true;
  enunciado: string;
  falado: string;
  howto: string;
  explain: string;
}

const CAIXA = { largura: 150, altura: 190 } as const;
const EMOJIS = ["🦕", "🐢", "⭐", "🚀", "🐟", "🍎", "⚽", "🌻"] as const;

function item<T>(lista: readonly T[], sorteio: () => number): T {
  return lista[Math.floor(sorteio() * lista.length) % lista.length];
}

function parDiferente(sorteio: () => number): [string, string] {
  const primeiro = item(EMOJIS, sorteio);
  let segundo = item(EMOJIS, sorteio);
  let guarda = 0;
  while (segundo === primeiro && guarda < EMOJIS.length + 1) {
    segundo = EMOJIS[(EMOJIS.indexOf(segundo as never) + 1) % EMOJIS.length];
    guarda += 1;
  }
  return [primeiro, segundo];
}

function quantidadesDoNivel(nivel: number, sorteio: () => number): [number, number] {
  switch (nivel) {
    case 1: return [2, 6];
    case 2: return [3, 5];
    case 3: return [4, 5];
    case 4: return [5, 6];
    default: {
      const menor = 5 + Math.floor(sorteio() * 5);
      return [menor, menor + 1];
    }
  }
}

function embaralharPar<T>(par: [T, T], sorteio: () => number): [T, T] {
  return sorteio() < 0.5 ? par : [par[1], par[0]];
}

export function construirComparacaoQuantidadeSpec(
  nivel: number,
  sorteio: () => number = Math.random,
): ComparacaoQuantidadeSpec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));
  const [menor, maior] = quantidadesDoNivel(clamped, sorteio);
  const mesmaIdentidade = clamped <= 3;
  const [emojiMenor, emojiMaior] = mesmaIdentidade
    ? (() => { const emoji = item(EMOJIS, sorteio); return [emoji, emoji] as [string, string]; })()
    : parDiferente(sorteio);
  const armadilhaTamanho = clamped === 4;
  const armadilhaEspaco = clamped === 5;

  const ordenados: [GrupoQuantidadeSpec, GrupoQuantidadeSpec] = [
    {
      quantidade: menor,
      emoji: emojiMenor,
      escalaItem: armadilhaTamanho ? 1.28 : 1,
      distribuicao: armadilhaEspaco ? "espalhada" : "normal",
      caixa: { ...CAIXA },
    },
    {
      quantidade: maior,
      emoji: emojiMaior,
      escalaItem: armadilhaTamanho ? 0.82 : 1,
      distribuicao: armadilhaEspaco ? "compacta" : "normal",
      caixa: { ...CAIXA },
    },
  ];

  const grupos = embaralharPar(ordenados, sorteio);
  const resposta = (grupos[0].quantidade > grupos[1].quantidade ? 0 : 1) as 0 | 1;
  return {
    modo: "quantidade",
    nivel: clamped,
    grupos,
    resposta,
    mesmaIdentidade,
    armadilhaTamanho,
    armadilhaEspaco,
    pareamentoDisponivel: clamped >= 2,
    autoParearNoErro: true,
    enunciado: "Qual grupo tem MAIS?",
    falado: "Qual grupo tem mais?",
    howto: "Faça um par de cada vez: um daqui, um dali. Quem sobrar tem mais.",
    explain: "Não olhe o tamanho do monte. Ligue um de cada lado e veja quem sobra.",
  };
}

function misconceptionDoNivel(nivel: number): string {
  if (nivel >= 5) return "CONSERVACAO_ESPACO";
  if (nivel === 4) return "CONFUNDE_TAMANHO_QUANTIDADE";
  return "COMPARA_SEM_CONTAR";
}

function microDoNivel(ficha: FichaCompetencia, nivel: number) {
  const microId = ficha.niveis?.[nivel]?.micro;
  return ficha.micros.find(micro => micro.id === microId);
}

export function construirComparacaoQuantidadeQuestion(
  ficha: FichaCompetencia,
  level: number,
): Question {
  const spec = construirComparacaoQuantidadeSpec(level);
  const misconception = misconceptionDoNivel(spec.nivel);
  const micro = microDoNivel(ficha, spec.nivel);
  const tutorial = Array.isArray(micro?.params?.tutorial)
    ? micro.params.tutorial.map(step => ({
        say: step.fala,
        ...(step.show != null ? { show: step.show } : {}),
      }))
    : undefined;
  return {
    kind: "grandeza",
    prompt: spec.enunciado,
    audioPrompt: spec.falado,
    howto: ficha.howto || spec.howto,
    explain: ficha.explain || spec.explain,
    tutorial,
    uiProps: spec,
    options: [0, 1].map(value => ({
      label: value === 0 ? "grupo da esquerda" : "grupo da direita",
      value,
      ...(value === spec.resposta ? {} : { misconception }),
    })),
    answer: spec.resposta,
    evaluate: answer => answer === spec.resposta,
  };
}