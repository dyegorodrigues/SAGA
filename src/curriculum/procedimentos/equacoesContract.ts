import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import {
  EQUACOES_L3_MAIS_EVIDENCIA,
  EquacoesMisconception,
  type EquacoesMisconceptionTag,
} from "../../constants/equacoesMisconceptions";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export { EquacoesMisconception } from "../../constants/equacoesMisconceptions";
export type { EquacoesMisconceptionTag } from "../../constants/equacoesMisconceptions";

export type EquacoesF90Modo = "soma" | "subtracao" | "multiplicacao" | "dois-passos" | "incognita-dois-lados";

export interface EquacoesF90Lado {
  coefX: number;
  constante: number;
}

export interface EquacoesF90Opcao extends Option {
  value: string;
  label: string;
  misconception?: EquacoesMisconceptionTag;
  preview: {
    esquerda: number;
    direita: number;
    preservaEquilibrio: boolean;
    descricao: string;
  };
}

export interface EquacoesF90Spec {
  ficha: "F90";
  nivel: number;
  modo: EquacoesF90Modo;
  caso: string;
  primitivas: ["Balanca"];
  equilibrioFisico: true;
  equacao: string;
  esquerda: EquacoesF90Lado;
  direita: EquacoesF90Lado;
  solucao: number;
  resposta: string;
  finalEsquerda: EquacoesF90Lado;
  finalDireita: EquacoesF90Lado;
  equacaoFinal: string;
  passosCorretos: string[];
  opcoes: EquacoesF90Opcao[];
  acessibilidade: {
    alvoMinPx: 80;
    toqueAlternativo: true;
    semArrastoObrigatorio: true;
    erroMotorNaoTag: true;
  };
}

interface EquacoesF90Show {
  equacao: string;
  operacao?: string;
  aplicarNosDois?: boolean;
  equilibrio?: boolean;
  isolandoX?: boolean;
}

type CasoF90 = {
  id: string;
  esquerda: EquacoesF90Lado;
  direita: EquacoesF90Lado;
  equacao: string;
};

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const acessibilidade = {
  alvoMinPx: 80 as const,
  toqueAlternativo: true as const,
  semArrastoObrigatorio: true as const,
  erroMotorNaoTag: true as const,
};

function escolher<T>(itens: readonly T[], rng: () => number): T {
  const raw = rng();
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999, raw)) : 0;
  return itens[Math.floor(safe * itens.length)] ?? itens[0];
}

const CASOS: Record<number, readonly CasoF90[]> = {
  1: [
    { id: "x-mais-3-igual-8", esquerda: { coefX: 1, constante: 3 }, direita: { coefX: 0, constante: 8 }, equacao: "x + 3 = 8" },
    { id: "x-mais-4-igual-10", esquerda: { coefX: 1, constante: 4 }, direita: { coefX: 0, constante: 10 }, equacao: "x + 4 = 10" },
    { id: "x-mais-2-igual-9", esquerda: { coefX: 1, constante: 2 }, direita: { coefX: 0, constante: 9 }, equacao: "x + 2 = 9" },
  ],
  2: [
    { id: "x-menos-2-igual-5", esquerda: { coefX: 1, constante: -2 }, direita: { coefX: 0, constante: 5 }, equacao: "x − 2 = 5" },
    { id: "x-menos-3-igual-4", esquerda: { coefX: 1, constante: -3 }, direita: { coefX: 0, constante: 4 }, equacao: "x − 3 = 4" },
    { id: "x-menos-4-igual-6", esquerda: { coefX: 1, constante: -4 }, direita: { coefX: 0, constante: 6 }, equacao: "x − 4 = 6" },
  ],
  3: [
    { id: "2x-igual-10", esquerda: { coefX: 2, constante: 0 }, direita: { coefX: 0, constante: 10 }, equacao: "2x = 10" },
    { id: "3x-igual-12", esquerda: { coefX: 3, constante: 0 }, direita: { coefX: 0, constante: 12 }, equacao: "3x = 12" },
    { id: "4x-igual-20", esquerda: { coefX: 4, constante: 0 }, direita: { coefX: 0, constante: 20 }, equacao: "4x = 20" },
  ],
  4: [
    { id: "2x-mais-1-igual-9", esquerda: { coefX: 2, constante: 1 }, direita: { coefX: 0, constante: 9 }, equacao: "2x + 1 = 9" },
    { id: "3x-mais-2-igual-14", esquerda: { coefX: 3, constante: 2 }, direita: { coefX: 0, constante: 14 }, equacao: "3x + 2 = 14" },
    { id: "2x-mais-3-igual-13", esquerda: { coefX: 2, constante: 3 }, direita: { coefX: 0, constante: 13 }, equacao: "2x + 3 = 13" },
  ],
  5: [
    { id: "x-mais-5-igual-2x-mais-1", esquerda: { coefX: 1, constante: 5 }, direita: { coefX: 2, constante: 1 }, equacao: "x + 5 = 2x + 1" },
    { id: "x-mais-7-igual-2x-mais-2", esquerda: { coefX: 1, constante: 7 }, direita: { coefX: 2, constante: 2 }, equacao: "x + 7 = 2x + 2" },
    { id: "x-mais-4-igual-2x-mais-1", esquerda: { coefX: 1, constante: 4 }, direita: { coefX: 2, constante: 1 }, equacao: "x + 4 = 2x + 1" },
  ],
};

function valor(lado: EquacoesF90Lado, x: number): number {
  return lado.coefX * x + lado.constante;
}

function solucao(caso: CasoF90): number {
  const denominador = caso.esquerda.coefX - caso.direita.coefX;
  if (denominador === 0) throw new Error(`F90 caso sem solução única: ${caso.id}`);
  const x = (caso.direita.constante - caso.esquerda.constante) / denominador;
  if (!Number.isFinite(x) || x <= 0) throw new Error(`F90 caso fora do domínio pedagógico: ${caso.id}`);
  return x;
}

function sinal(n: number): string {
  return n >= 0 ? `+${n}` : `−${Math.abs(n)}`;
}

function construirTransformacao(nivel: number, caso: CasoF90, x: number) {
  if (nivel === 1) {
    const a = caso.esquerda.constante;
    return {
      correta: `−${a} nos dois lados`,
      inversaErrada: `+${a} nos dois lados`,
      unilateral: `−${a} só no lado esquerdo`,
      quebra: `−${a} à esquerda e −${Math.max(1, a - 1)} à direita`,
      todo: `O total ${caso.direita.constante} já é x`,
      passos: [`retirar ${a} dos dois lados`],
      finalEsquerda: { coefX: 1, constante: 0 }, finalDireita: { coefX: 0, constante: x }, equacaoFinal: `x = ${x}`,
    };
  }
  if (nivel === 2) {
    const a = Math.abs(caso.esquerda.constante);
    return {
      correta: `+${a} nos dois lados`,
      inversaErrada: `−${a} nos dois lados`,
      unilateral: `+${a} só no lado esquerdo`,
      quebra: `+${a} à esquerda e +${a + 1} à direita`,
      todo: `O total ${caso.direita.constante} já é x`,
      passos: [`adicionar ${a} aos dois lados`],
      finalEsquerda: { coefX: 1, constante: 0 }, finalDireita: { coefX: 0, constante: x }, equacaoFinal: `x = ${x}`,
    };
  }
  if (nivel === 3) {
    const k = caso.esquerda.coefX;
    return {
      correta: `÷${k} nos dois lados`,
      inversaErrada: `×${k} nos dois lados`,
      unilateral: `÷${k} só no lado esquerdo`,
      quebra: `÷${k} à esquerda e ÷${k + 1} à direita`,
      todo: `O total ${caso.direita.constante} já é x`,
      passos: [`dividir os dois lados por ${k}`],
      finalEsquerda: { coefX: 1, constante: 0 }, finalDireita: { coefX: 0, constante: x }, equacaoFinal: `x = ${x}`,
    };
  }
  if (nivel === 4) {
    const b = caso.esquerda.constante;
    const k = caso.esquerda.coefX;
    return {
      correta: `−${b} nos dois lados; depois ÷${k} nos dois lados`,
      inversaErrada: `+${b} nos dois lados; depois ×${k}`,
      unilateral: `−${b} só no lado esquerdo`,
      quebra: `−${b} à esquerda e −${b + 1} à direita`,
      todo: `O total ${caso.direita.constante} já é x`,
      passos: [`retirar ${b} dos dois lados`, `dividir os dois lados por ${k}`],
      finalEsquerda: { coefX: 1, constante: 0 }, finalDireita: { coefX: 0, constante: x }, equacaoFinal: `x = ${x}`,
    };
  }
  const bEsquerda = caso.esquerda.constante;
  const bDireita = caso.direita.constante;
  return {
    correta: `−x nos dois lados; depois −${bDireita} nos dois lados`,
    inversaErrada: `+x nos dois lados`,
    unilateral: `−x só no lado direito`,
    quebra: `−x à direita e −1 à esquerda`,
    todo: `O termo ${bEsquerda} já é x`,
    passos: ["retirar a mesma quantidade x dos dois lados", `retirar ${bDireita} dos dois lados`],
    finalEsquerda: { coefX: 0, constante: x }, finalDireita: { coefX: 1, constante: 0 }, equacaoFinal: `${x} = x`,
  };
}

export function construirEquacoesF90Spec(level: number, rng: () => number = Math.random): EquacoesF90Spec {
  const nivel = clamp(level);
  const modo = ["soma", "subtracao", "multiplicacao", "dois-passos", "incognita-dois-lados"][nivel - 1] as EquacoesF90Modo;
  const caso = escolher(CASOS[nivel], rng);
  const x = solucao(caso);
  const total = valor(caso.esquerda, x);
  if (Math.abs(total - valor(caso.direita, x)) > 1e-9) throw new Error(`F90 caso não nasce equilibrado: ${caso.id}`);
  const t = construirTransformacao(nivel, caso, x);
  const resposta = `f90-correta-${caso.id}`;

  const distratores: EquacoesF90Opcao[] = [
    { value: `f90-inversa-${caso.id}`, label: t.inversaErrada, misconception: EquacoesMisconception.OPERACAO_INVERSA_ERRADA, preview: { esquerda: total + 2, direita: total + 2, preservaEquilibrio: true, descricao: "A balança continua horizontal, mas esta operação não desfaz o que prende x." } },
    { value: `f90-um-lado-${caso.id}`, label: t.unilateral, misconception: EquacoesMisconception.NAO_APLICA_AOS_DOIS, preview: { esquerda: total - 1, direita: total, preservaEquilibrio: false, descricao: "Só um prato mudou; a igualdade deixou de ser preservada." } },
    { value: `f90-quebra-${caso.id}`, label: t.quebra, misconception: EquacoesMisconception.QUEBRA_EQUILIBRIO, preview: { esquerda: total - 1, direita: total - 2, preservaEquilibrio: false, descricao: "Os pratos receberam transformações diferentes e a balança inclinou." } },
    { value: `f90-todo-${caso.id}`, label: t.todo, misconception: EquacoesMisconception.RESPONDE_O_TODO, preview: { esquerda: total + Math.max(1, x), direita: total, preservaEquilibrio: false, descricao: "O total visível não pode substituir x sem considerar os outros termos do lado." } },
  ];
  const omitidaPorNivel: Record<number, EquacoesMisconceptionTag> = {
    1: EquacoesMisconception.OPERACAO_INVERSA_ERRADA,
    2: EquacoesMisconception.NAO_APLICA_AOS_DOIS,
    3: EquacoesMisconception.RESPONDE_O_TODO,
    4: EquacoesMisconception.QUEBRA_EQUILIBRIO,
    5: EquacoesMisconception.OPERACAO_INVERSA_ERRADA,
  };
  const opcoes: EquacoesF90Opcao[] = [
    { value: resposta, label: t.correta, preview: { esquerda: x, direita: x, preservaEquilibrio: true, descricao: "A mesma transformação ocorreu nos dois pratos e x ficou mais isolado." } },
    ...distratores.filter(opcao => opcao.misconception !== omitidaPorNivel[nivel]),
  ];

  return {
    ficha: "F90",
    nivel,
    modo,
    caso: caso.id,
    primitivas: ["Balanca"],
    equilibrioFisico: true,
    equacao: caso.equacao,
    esquerda: caso.esquerda,
    direita: caso.direita,
    solucao: x,
    resposta,
    finalEsquerda: t.finalEsquerda,
    finalDireita: t.finalDireita,
    equacaoFinal: t.equacaoFinal,
    passosCorretos: t.passos,
    opcoes,
    acessibilidade,
  };
}

export function construirEquacoesF90Resolucao(
  spec: EquacoesF90Spec,
): ResolucaoDeclarativa<EquacoesF90Show, string, EquacoesMisconceptionTag> {
  const primeira = spec.passosCorretos[0];
  const segunda = spec.passosCorretos[1];
  const passos: Array<ResolucaoDeclarativa<EquacoesF90Show, string, EquacoesMisconceptionTag>["passos"][number]> = [
    {
      id: "identificar-operacao",
      say: `Observe a operação que ainda envolve x em ${spec.equacao}. Antes de calcular, descubra qual transformação precisa ser desfeita.`,
      show: { equacao: spec.equacao, equilibrio: true },
      corrige: [EquacoesMisconception.RESPONDE_O_TODO],
      parcial: "identificar",
    },
    {
      id: "selecionar-inversa",
      say: `Escolha a operação inversa: a meta é desfazer a operação junto de x, não trocar um termo de lado por uma regra decorada.`,
      show: { equacao: spec.equacao, operacao: primeira, equilibrio: true },
      corrige: [EquacoesMisconception.OPERACAO_INVERSA_ERRADA],
      parcial: "inversa",
    },
    {
      id: "aplicar-aos-dois-lados",
      say: `Aplique ${primeira} mantendo os dois pratos vinculados. Qualquer mudança feita num lado precisa acontecer no outro para a igualdade continuar verdadeira.`,
      show: { equacao: spec.equacao, operacao: primeira, aplicarNosDois: true, equilibrio: true },
      corrige: [EquacoesMisconception.NAO_APLICA_AOS_DOIS, EquacoesMisconception.QUEBRA_EQUILIBRIO],
      parcial: "dois-lados",
    },
  ];

  if (segunda) {
    passos.push({
      id: "segundo-passo",
      say: `Ainda há uma operação envolvendo x. Faça o segundo passo, ${segunda}, novamente nos dois lados da igualdade.`,
      show: { equacao: spec.equacao, operacao: segunda, aplicarNosDois: true, equilibrio: true, isolandoX: true },
      corrige: [EquacoesMisconception.OPERACAO_INVERSA_ERRADA, EquacoesMisconception.NAO_APLICA_AOS_DOIS],
      parcial: "segundo-passo",
    });
  }

  passos.push({
    id: "isolar-e-concluir",
    say: "Com x isolado e a balança ainda em equilíbrio, conclua apenas a aritmética restante. O valor de x vem da igualdade preservada, não de uma troca de sinal decorada.",
    show: { equacao: spec.equacao, equilibrio: true, isolandoX: true },
    corrige: [EquacoesMisconception.RESPONDE_O_TODO],
    parcial: "concluir",
  });

  return { estadoInicial: { equacao: spec.equacao, equilibrio: true }, passos, fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.08 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: { ...micro.dominio.evidenciasDistintas } } : {}),
  };
}

export function construirEquacoesQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "AL.08") throw new Error(`equacoesContract recebeu ${ficha.id}.`);
  const spec = construirEquacoesF90Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.08 sem micro L${spec.nivel}.`);

  const prompt = spec.nivel === 1
    ? `A balança representa ${spec.equacao}. Qual transformação remove a soma sem quebrar a igualdade?`
    : spec.nivel === 2
      ? `A balança representa ${spec.equacao}. Qual operação inversa preserva os dois lados?`
      : spec.nivel === 3
        ? `A balança representa ${spec.equacao}. Como desfazer o coeficiente sem alterar a igualdade?`
        : spec.nivel === 4
          ? `A balança representa ${spec.equacao}. Qual sequência de dois passos preserva a igualdade e isola x?`
          : `A balança representa ${spec.equacao}. Qual sequência mantém os dois lados equivalentes enquanto reúne a incógnita?`;

  return {
    kind: "equacoes-f90",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirEquacoesF90Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    exigeEvidencia: spec.nivel >= 3 ? EQUACOES_L3_MAIS_EVIDENCIA : undefined,
    uiProps: spec,
    options: spec.opcoes,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}