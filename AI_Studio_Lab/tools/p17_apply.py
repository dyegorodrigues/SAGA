from pathlib import Path
import re


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: ancora esperada 1x, encontrada {count}x")
    p.write_text(text.replace(old, new))


def regex_once(path: str, pattern: str, repl: str) -> None:
    p = Path(path)
    text = p.read_text()
    out, count = re.subn(pattern, repl, text, flags=re.S)
    if count != 1:
        raise SystemExit(f"{path}: regex esperada 1x, encontrada {count}x")
    p.write_text(out)


# 1) Contrato de pergunta / save: a regra de dominio da ficha viaja com a questao.
replace_once(
    "src/types.ts",
    "export interface Question {",
    """export interface MasteryRule {
  /** Quantos acertos a ficha exige dentro da janela da sessao. */
  acertos: number;
  /** Tamanho da janela de tentativas da sessao. */
  de: number;
  /** Quantas sessoes maduras e espacadas a ficha exige. */
  sessoes: number;
}

export interface Question {""",
)
replace_once(
    "src/types.ts",
    "  exigeEvidencia?: string;\n",
    """  exigeEvidencia?: string;
  /** Regra de dominio da micro que gerou esta questao. */
  masteryRule?: MasteryRule;
""",
)
replace_once(
    "src/types.ts",
    "  evidenciasVistas?: string[];\n",
    """  evidenciasVistas?: string[];
  /** Regra de dominio que governa a sessao de maestria atual. */
  masteryRule?: MasteryRule;
  /** Janela acerto/erro no L5 dentro da sessao corrente. */
  comprehensionWindow?: boolean[];
  /** Dia da sessao de maestria corrente. */
  sessionDay?: string;
  /** Dias em que a sessao cumpriu acertos/de, independencia e evidencia. */
  passedSessionDays?: string[];
""",
)

# 2) Parametros tipados para NumberBond e complemento simbolico.
replace_once(
    "src/curriculum/fichaQuestionContract.ts",
    "  soma_max?: number;\n",
    """  soma_max?: number;
  whole_fixed?: number;
  whole_min?: number;
""",
)
replace_once(
    "src/curriculum/fichaQuestionContract.ts",
    "  interativo?: boolean;\n",
    """  interativo?: boolean;
  /** Forma abstrata da F28: n + caixa = 10. */
  complemento_dez?: boolean;
""",
)
replace_once(
    "src/curriculum/fichaQuestionContract.ts",
    '  "soma_max", "dezenas_max", "unidades_max", "minutos_step",\n',
    '  "soma_max", "whole_fixed", "whole_min", "dezenas_max", "unidades_max", "minutos_step",\n',
)
replace_once(
    "src/curriculum/fichaQuestionContract.ts",
    '  "interactive_count", "tem_sobra", "apenas_horas_exatas", "interativo",\n',
    '  "interactive_count", "tem_sobra", "apenas_horas_exatas", "interativo", "complemento_dez",\n',
)

# 3) Tags que a F28 canonica declarava, mas o catalogo central ainda nao tinha.
replace_once(
    "src/constants/misconceptions.ts",
    '  /** Moldura relâmpago: disse quantas fichas HÁ, não quantas faltam. */\n',
    '''  /** Parte-todo/amigos do 10: repetiu a parte que ja estava dada. */
  REPETE_A_PARTE: "repete-a-parte",

  /**
   * Amigos do 10: funciona em material/diagrama, mas ainda nao transferiu para
   * a sentenca simbolica. E diagnostico longitudinal, nunca de um clique so.
   */
  SO_FUNCIONA_VISUAL: "so-funciona-visual",

  /** Moldura relâmpago: disse quantas fichas HÁ, não quantas faltam. */
''',
)

# 4) Composer: preserva tag especifica, cria bond formal e n + caixa = 10.
replace_once(
    "src/curriculum/Composer.ts",
    '''  return options.map(option => {
    const tag = typeof option.value === "number" ? taggedValues.get(option.value) : undefined;
    return tag ? { ...option, misconception: tag } : option;
  });''',
    '''  return options.map(option => {
    // O builder pode conhecer uma hipotese mais especifica que n+/-1. O
    // generico nunca apaga esse diagnostico.
    if (option.misconception) return option;
    const tag = typeof option.value === "number" ? taggedValues.get(option.value) : undefined;
    return tag ? { ...option, misconception: tag } : option;
  });''',
)
regex_once(
    "src/curriculum/Composer.ts",
    r'''      case "bond": \{\n.*?        break;\n      \}\n      \n      case "draggroup": \{''',
    '''      case "bond": {
        const maxSum = params.soma_max || 10;
        const minWhole = Math.max(2, Math.min(params.whole_min || 2, maxSum));
        const whole = params.whole_fixed ?? randomInt(minWhole, maxSum);
        if (!Number.isInteger(whole) || whole < 2 || whole > maxSum) {
          throw new Error(`Todo invalido no NumberBond de ${ficha.id}/${micro.id}.`);
        }
        const part1 = randomInt(1, whole - 1);
        const part2 = whole - part1;

        if (params.interactive === "whole") {
          uiProps = { whole: '?', part1, part2, interactivePart: 'whole' };
          evaluate = (ans) => ans === whole;
          answer = whole;
          options = numericOptions(whole, Math.max(1, whole - 2), whole + 2);
        } else {
          const hide1 = Math.random() > 0.5;
          const visible = hide1 ? part2 : part1;
          uiProps = {
            whole,
            part1: hide1 ? '?' : part1,
            part2: hide1 ? part2 : '?',
            interactivePart: hide1 ? 'part1' : 'part2',
          };
          evaluate = (ans) => ans === (hide1 ? part1 : part2);
          answer = hide1 ? part1 : part2;

          const candidatos: Option[] = [
            { label: String(answer), value: answer },
            ...(visible !== answer ? [{
              label: String(visible), value: visible,
              misconception: MisconceptionTag.REPETE_A_PARTE,
            }] : []),
            ...(whole !== answer && whole !== visible ? [{
              label: String(whole), value: whole,
              misconception: MisconceptionTag.RESPONDE_O_TODO,
            }] : []),
            { label: String(Number(answer) + 1), value: Number(answer) + 1, misconception: MisconceptionTag.OFF_BY_ONE },
            ...(Number(answer) > 1 ? [{
              label: String(Number(answer) - 1), value: Number(answer) - 1,
              misconception: MisconceptionTag.OFF_BY_ONE,
            }] : []),
          ];
          options = [...new Map(candidatos.map(o => [String(o.value), o])).values()]
            .slice(0, 4)
            .sort(() => Math.random() - 0.5);
        }
        break;
      }
      
      case "draggroup": {''',
)
replace_once(
    "src/curriculum/Composer.ts",
    '      case "plain": {\n        if (typeof params.dezenas_max === "number") {',
    '''      case "plain": {
        if (params.complemento_dez) {
          const parte = randomInt(1, 9);
          answer = 10 - parte;
          uiProps = { text: `${parte} + □ = 10` };
          const candidatos: Option[] = [
            { label: String(answer), value: answer },
            ...(parte !== answer ? [{
              label: String(parte), value: parte,
              misconception: MisconceptionTag.REPETE_A_PARTE,
            }] : []),
            { label: "10", value: 10, misconception: MisconceptionTag.RESPONDE_O_TODO },
            { label: String(Number(answer) + 1), value: Number(answer) + 1, misconception: MisconceptionTag.OFF_BY_ONE },
            ...(Number(answer) > 1 ? [{
              label: String(Number(answer) - 1), value: Number(answer) - 1,
              misconception: MisconceptionTag.OFF_BY_ONE,
            }] : []),
          ];
          options = [...new Map(candidatos.map(o => [String(o.value), o])).values()]
            .slice(0, 4)
            .sort(() => Math.random() - 0.5);
          evaluate = ans => Number(ans) === answer;
          promptOverride = `${parte} mais quanto da dez?`;
        } else if (typeof params.dezenas_max === "number") {''',
)
replace_once(
    "src/curriculum/Composer.ts",
    '      ...(micro.dominio?.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),\n',
    '''      ...(micro.dominio?.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),
      masteryRule: {
        acertos: micro.dominio.acertos,
        de: micro.dominio.de,
        sessoes: micro.dominio.sessoes,
      },
''',
)

# 5) Motor de maestria: acertos/de em cada sessao, e sessoes realmente separadas.
replace_once(
    "src/curriculum/motores/progressEngine.ts",
    'import { MasteryEvidence, Progress } from "../../types";',
    'import { MasteryEvidence, MasteryRule, Progress } from "../../types";',
)
replace_once(
    "src/curriculum/motores/progressEngine.ts",
    "  exigeEvidencia?: string;\n",
    """  exigeEvidencia?: string;
  /** Regra de dominio da micro que gerou a questao. */
  masteryRule?: MasteryRule;
""",
)
regex_once(
    "src/curriculum/motores/progressEngine.ts",
    r'''export function faltaParaCoroa\(\n.*?\n\}\n\nexport function migrateLegacyCrown''',
    '''const REGRA_PADRAO: MasteryRule = { acertos: 3, de: 3, sessoes: 2 };

function regraValida(rule?: MasteryRule): MasteryRule {
  const acertos = Math.max(1, Math.floor(rule?.acertos ?? REGRA_PADRAO.acertos));
  const de = Math.max(acertos, Math.floor(rule?.de ?? REGRA_PADRAO.de));
  const sessoes = Math.max(1, Math.floor(rule?.sessoes ?? REGRA_PADRAO.sessoes));
  return { acertos, de, sessoes };
}

function compreensaoDaSessaoPronta(evidence: MasteryEvidence): boolean {
  const rule = regraValida(evidence.masteryRule);
  const janela = evidence.comprehensionWindow ?? [];
  return janela.length >= rule.de && janela.filter(Boolean).length >= rule.acertos;
}

function sessoesPassadas(evidence: MasteryEvidence): string[] {
  if (evidence.passedSessionDays?.length) return evidence.passedSessionDays;
  // Migracao sem perda: a versao anterior ja guardava o primeiro dia maduro.
  return evidence.candidateDay ? [evidence.candidateDay] : [];
}

export function faltaParaCoroa(
  evidence: MasteryEvidence | undefined,
  descricaoDaEvidencia?: string,
): string | null {
  if (!evidence || evidence.crownedBy) return null;
  const rule = regraValida(evidence.masteryRule);
  if (!compreensaoDaSessaoPronta(evidence)) {
    return rule.acertos === rule.de
      ? `Acertar ${rule.acertos} seguidas no ultimo nivel, na mesma sessao.`
      : `Acertar ${rule.acertos} de ${rule.de} tentativas recentes no ultimo nivel.`;
  }
  if (evidence.independenceStreak < Math.min(3, rule.acertos)) {
    return "Conseguir sem pedir dica.";
  }
  if (evidence.evidenciaDaFicha === false) {
    return descricaoDaEvidencia ?? "Acertar uma vez na condicao mais dificil da competencia.";
  }
  const requeridas = Math.max(2, rule.sessoes);
  const faltam = requeridas - sessoesPassadas(evidence).length;
  if (faltam > 0) {
    return faltam === 1
      ? "Confirmar o dominio em mais uma sessao, depois de alguns dias."
      : `Confirmar o dominio em mais ${faltam} sessoes espacadas.`;
  }
  return null;
}

export function migrateLegacyCrown''',
)
regex_once(
    "src/curriculum/motores/progressEngine.ts",
    r'''function updateMasteryEvidence\(\n.*\n\}\n$''',
    '''function updateMasteryEvidence(
  before: Progress,
  right: boolean,
  attempt: MasteryAttempt,
): MasteryEvidence {
  if (before.dom) return before.masteryEvidence || legacyMasteryEvidence();

  const anterior = before.masteryEvidence;
  const rule = regraValida(attempt.masteryRule ?? anterior?.masteryRule);
  const janelaHerdada = anterior?.comprehensionWindow
    ? [...anterior.comprehensionWindow]
    : Array(Math.min(anterior?.comprehensionStreak || 0, rule.de)).fill(true);
  const passedDays = [...(anterior?.passedSessionDays
    ?? (anterior?.candidateDay ? [anterior.candidateDay] : []))];

  const evidence: MasteryEvidence = {
    schemaVersion: 1,
    comprehensionStreak: anterior?.comprehensionStreak || 0,
    independenceStreak: anterior?.independenceStreak || 0,
    fluencyStreak: anterior?.fluencyStreak || 0,
    retentionPasses: Math.max(0, passedDays.length - 1),
    candidateDay: anterior?.candidateDay,
    crownedBy: anterior?.crownedBy,
    evidenciaDaFicha: anterior?.evidenciaDaFicha,
    evidenciasVistas: [...(anterior?.evidenciasVistas || [])],
    masteryRule: rule,
    comprehensionWindow: janelaHerdada,
    sessionDay: anterior?.sessionDay,
    passedSessionDays: passedDays,
  };

  // A evidencia especifica da ficha e historica e pode ser colhida antes do L5.
  if (right && attempt.evidencias?.length) {
    for (const nome of attempt.evidencias) {
      if (!evidence.evidenciasVistas!.includes(nome)) evidence.evidenciasVistas!.push(nome);
    }
  }
  evidence.evidenciaDaFicha = attempt.exigeEvidencia
    ? evidence.evidenciasVistas!.includes(attempt.exigeEvidencia)
    : true;

  if (before.lvl !== 5) return evidence;

  // Nao carregamos acertos de uma sessao para completar a janela da seguinte.
  if (evidence.sessionDay !== attempt.practiceDay) {
    evidence.sessionDay = attempt.practiceDay;
    evidence.comprehensionWindow = [];
    evidence.comprehensionStreak = 0;
    evidence.independenceStreak = 0;
    evidence.fluencyStreak = 0;
  }

  evidence.comprehensionWindow = [...(evidence.comprehensionWindow || []), right].slice(-rule.de);
  evidence.comprehensionStreak = right ? Math.min(rule.de, evidence.comprehensionStreak + 1) : 0;
  evidence.independenceStreak = right && !attempt.helpUsed
    ? Math.min(3, evidence.independenceStreak + 1)
    : 0;
  evidence.fluencyStreak = right
    && attempt.targetRtMs !== undefined
    && attempt.durationMs <= attempt.targetRtMs
      ? Math.min(3, evidence.fluencyStreak + 1)
      : 0;

  const sessaoMadura = compreensaoDaSessaoPronta(evidence)
    && evidence.independenceStreak >= Math.min(3, rule.acertos)
    && evidence.evidenciaDaFicha === true;

  if (sessaoMadura && !passedDays.includes(attempt.practiceDay)) {
    const ultima = passedDays.at(-1);
    // Retencao e parte da coroa multidimensional: sessoes posteriores precisam
    // estar separadas por pelo menos dois dias.
    if (!ultima || dayDistance(ultima, attempt.practiceDay) >= 2) {
      passedDays.push(attempt.practiceDay);
    }
  }

  evidence.passedSessionDays = passedDays;
  evidence.candidateDay = passedDays[0];
  evidence.retentionPasses = Math.max(0, passedDays.length - 1);

  const sessoesNecessarias = Math.max(2, rule.sessoes);
  if (passedDays.length >= sessoesNecessarias) evidence.crownedBy = "multidimensional";
  return evidence;
}
''',
)
replace_once(
    "src/components/GameLoop.tsx",
    "      exigeEvidencia: q.exigeEvidencia,\n",
    """      exigeEvidencia: q.exigeEvidencia,
      masteryRule: q.masteryRule,
""",
)

# 6) N1.10: JD5 instala a estrutura; NumberBond a formaliza no topo.
Path("src/curriculum/fichas/jornada/N1.10.ts").write_text('''import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/tenFrameProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * N1.10 — uma competencia, duas representacoes.
 *
 * JD5 instala parte-todo sem simbolo; o L5 formaliza a MESMA relacao com o
 * diagrama part-part-whole. A JD5 completa continua no Jardim do Dojo.
 */
const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  exige: {
    evidencia: Evidencia.TOTAL_ALEM_DE_CINCO,
    descricao: "Acertar uma vez com mais de cinco objetos, guardando o total na memoria.",
  },
};

const coreografiaJD5 = [
  { fala: "Olha bem: um, dois, tres.", show: { contarUmAUm: 3 } },
  { fala: "Tres!", show: { destacarTodos: true } },
  { fala: "Vou esconder um...", show: { taparN: 1 } },
  { fala: "Quantos escondi?", show: { pulsarTampa: true } },
];

const coreografiaBond = [
  { fala: "Este numero de cima e o todo." },
  { fala: "Os dois de baixo sao as partes." },
  { fala: "E a mesma historia: uma parte aparece e a outra estava escondida." },
  { fala: "Descubra a parte que falta." },
];

export const N1_10: FichaCompetencia = {
  id: "N1.10",
  nome: "Parte-todo: do escondido ao number bond",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.08"],
  bncc: "EF01MA06",

  howto: "Pense no todo e nas duas partes. Se uma parte e conhecida, descubra a outra.",
  explain: "O todo e formado pelas duas partes juntas. A parte que falta completa o todo.",

  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],

  niveis: {
    1: { primitiva: "moldura", micro: "esconde_um", andaime: "mao_fantasma" },
    2: { primitiva: "moldura", micro: "esconde_dois", andaime: "alto" },
    3: { primitiva: "moldura", micro: "sem_contagem", andaime: "medio" },
    4: { primitiva: "moldura", micro: "ate_dez", andaime: "minimo" },
    5: { primitiva: "bond", micro: "formaliza_bond", andaime: "nenhum" },
  },

  micros: [
    {
      id: "esconde_um",
      fonte: "JD5",
      alvo: "um objeto some, com o total ancorado pela contagem em voz alta",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
        tutorial: coreografiaJD5,
      },
      dominio,
    },
    {
      id: "esconde_dois",
      fonte: "JD5",
      alvo: "ate dois somem: a parte oculta deixa de ser sempre a mesma",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
      },
      dominio,
    },
    {
      id: "sem_contagem",
      fonte: "JD5",
      alvo: "sem a contagem em voz alta: o total tem de ser construido pela crianca",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
      },
      dominio,
    },
    {
      id: "ate_dez",
      fonte: "JD5",
      alvo: "ate dez — memoria de trabalho real antes da formalizacao",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
      },
      dominio,
    },
    {
      id: "formaliza_bond",
      fonte: "F1-parte-todo",
      alvo: "reconhecer no diagrama a mesma relacao todo = parte + parte vivida na JD5",
      kinds: ["bond"],
      params: {
        soma_max: 10,
        whole_min: 4,
        interactive: "part",
        audio_prompt: "O todo esta em cima. Qual parte falta?",
        howto: "O numero de cima e o todo. Os dois de baixo sao as partes.",
        explain: "Junte as duas partes de baixo: elas precisam formar o todo de cima.",
        tutorial: coreografiaBond,
      },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.RESPONDE_O_VISIVEL, descricao: "Respondeu a parte visivel em vez de inferir a parte oculta." },
    { id: MisconceptionTag.REPETE_A_PARTE, descricao: "No diagrama, repetiu a parte conhecida em vez de completar o todo." },
    { id: MisconceptionTag.RESPONDE_O_TODO, descricao: "Respondeu o todo quando a pergunta pedia a parte ausente." },
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Fez a relacao parte-todo e errou por um." },
    { id: MisconceptionTag.DEPENDE_DE_ESTRUTURA, descricao: "A relacao ainda depende do apoio perceptual da moldura." },
  ],
};
''')

# 7) N1.11: JD3 perceptual -> F28 NumberBond -> F28 simbolo.
Path("src/curriculum/fichas/jornada/N1.11.ts").write_text('''import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/tenFrameProcedure";
import { FichaCompetencia } from "../../schema";

const dominioJD3 = { acertos: 4, de: 5, sessoes: 2 };
const dominioF28 = { acertos: 4, de: 4, sessoes: 3 };

const coreografiaJD3 = [
  { fala: "Prepare o olho!", show: { moldura: { vazia: true } } },
  { fala: "Ja!", show: { flash: { tenframe: 8, ms: 1500 } } },
  { fala: "Faltavam dois.", show: { preencherFaltantes: 2 } },
];

const coreografiaBond = [
  { fala: "Agora o dez virou o todo do diagrama." },
  { fala: "Uma parte ja esta aqui." },
  { fala: "Qual e a outra parte que fecha dez?" },
];

export const N1_11: FichaCompetencia = {
  id: "N1.11",
  nome: "Amigos do 10: ver, estruturar e simbolizar",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.08", "N1.10"],
  bncc: "EF01MA06",

  howto: "Pense no par que fecha dez. As duas partes juntas precisam formar 10.",
  explain: "Veja a parte que ja temos e a parte que falta: juntas formam dez.",

  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],

  niveis: {
    1: { primitiva: "moldura", micro: "jd3_faltam_um_dois", andaime: "mao_fantasma" },
    2: { primitiva: "moldura", micro: "jd3_faltam_ate_quatro", andaime: "alto" },
    3: { primitiva: "bond", micro: "f28_bond", andaime: "medio" },
    4: { primitiva: "plain", micro: "f28_simbolo", andaime: "minimo" },
    5: { primitiva: "plain", micro: "f28_simbolo", andaime: "nenhum", rt_alvo: 3000 },
  },

  micros: [
    {
      id: "jd3_faltam_um_dois",
      fonte: "JD3",
      alvo: "ver um vazio pequeno como quantidade, sem contar casa por casa",
      kinds: ["moldura"],
      params: {
        modo: "faltam",
        audio_prompt: FALAS.faltam.audioPrompt,
        howto: FALAS.faltam.howto,
        explain: FALAS.faltam.explain,
        tutorial: coreografiaJD3,
      },
      dominio: dominioJD3,
    },
    {
      id: "jd3_faltam_ate_quatro",
      fonte: "JD3",
      alvo: "o vazio cresce, mas continua sendo percebido como uma parte",
      kinds: ["moldura"],
      params: {
        modo: "faltam",
        audio_prompt: FALAS.faltam.audioPrompt,
        howto: FALAS.faltam.howto,
        explain: FALAS.faltam.explain,
      },
      dominio: dominioJD3,
    },
    {
      id: "f28_bond",
      fonte: "F28",
      alvo: "o 10 vira o todo do number bond; a parte ausente deixa de depender da moldura",
      kinds: ["bond"],
      params: {
        soma_max: 10,
        whole_fixed: 10,
        interactive: "part",
        audio_prompt: "O todo e dez. Qual parte falta?",
        howto: "O 10 e o todo. As duas partes de baixo precisam completar dez.",
        explain: "Junte mentalmente as duas partes: o resultado precisa ser 10.",
        tutorial: coreografiaBond,
      },
      dominio: dominioF28,
    },
    {
      id: "f28_simbolo",
      fonte: "F28",
      alvo: "transferir o amigo do 10 para a sentenca n + caixa = 10",
      kinds: ["plain"],
      params: {
        complemento_dez: true,
        audio_prompt: "Quanto falta para completar dez?",
        howto: "Use o par que voce ja viu na moldura e no diagrama.",
        explain: "A caixa e a parte que falta para as duas partes formarem dez.",
      },
      dominio: dominioF28,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.RESPONDE_O_CHEIO, descricao: "Na moldura, disse quantas fichas ha em vez de quantas faltam." },
    { id: MisconceptionTag.SEM_ANCORA_CINCO, descricao: "Ainda nao usa a fileira de cinco como unidade." },
    { id: MisconceptionTag.REPETE_A_PARTE, descricao: "No diagrama/conta, repetiu a parte conhecida." },
    { id: MisconceptionTag.RESPONDE_O_TODO, descricao: "Respondeu 10 quando a pergunta pedia o complemento." },
    { id: MisconceptionTag.SO_FUNCIONA_VISUAL, descricao: "Acerta com representacao visual e ainda falha na sentenca simbolica." },
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Conhece o par, mas errou por uma unidade." },
  ],
};
''')

# 8) Jardim: preserva integralmente JD3 e JD5 como automaticidade.
replace_once(
    "src/curriculum/fichas/dojo/jardim/index.ts",
    'import { FALAS } from "../../../procedimentos/emojiRowProcedure";\n',
    '''import { FALAS } from "../../../procedimentos/emojiRowProcedure";
import { FALAS as FALAS_MOLDURA } from "../../../procedimentos/tenFrameProcedure";
''',
)
marker = '''/**
 * As trilhas do Jardim que já têm primitiva.
 *
 * JD3 (moldura relâmpago) e JD5 (ver e imaginar) dependem do `TenFrame`, que é
 * o passo 3 do `PLANO_DO_BLOCO_F0`. Entram lá, e não aqui, para não nascerem
 * apontando para uma primitiva que ainda vai ser reescrita. JD4 (próximo passo)
 * usa `NumberLine` e pertence ao passo 5.
 */
export const JARDIM: TrilhaDoJardim[] = [
  { ficha: JD1, mae: "N1.03", destravaNoNivel: 3 },
  { ficha: JD2, mae: "N1.08", destravaNoNivel: 3 },
];'''
replacement = '''/** JD3 completa: a Jornada usa L1-L2; o Jardim guarda a trilha perceptual inteira. */
export const JD3: FichaCompetencia = {
  id: "JD3",
  nome: "Jardim · Moldura Relampago",
  strand: "JD",
  faixa: "F0",
  prereqs: ["N1.11"],
  excecaoCPA: "perceptual",
  howto: FALAS_MOLDURA.faltam.howto,
  explain: FALAS_MOLDURA.faltam.explain,
  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],
  niveis: {
    1: { primitiva: "moldura", micro: "faltam", rt_alvo: 4000 },
    2: { primitiva: "moldura", micro: "faltam", rt_alvo: 3500 },
    3: { primitiva: "moldura", micro: "faltam", rt_alvo: 3000 },
    4: { primitiva: "moldura", micro: "faltam", rt_alvo: 2500 },
    5: { primitiva: "moldura", micro: "faltam", rt_alvo: 2000 },
  },
  micros: [{
    id: "faltam",
    fonte: "JD3",
    alvo: "ver o vazio da moldura como quantidade ate o disperso virar reflexo",
    kinds: ["moldura"],
    params: { modo: "faltam", audio_prompt: FALAS_MOLDURA.faltam.audioPrompt },
    dominio,
  }],
  erros_tipicos: [
    { id: MisconceptionTag.RESPONDE_O_CHEIO, descricao: "Disse quantas fichas ha, nao quantas faltam." },
    { id: MisconceptionTag.SEM_ANCORA_CINCO, descricao: "Nao usa a fileira de cinco como unidade." },
  ],
};

/** JD5 completa: a Jornada formaliza no L5; o Jardim preserva o L5 sem moldura. */
export const JD5: FichaCompetencia = {
  id: "JD5",
  nome: "Jardim · Ver e Imaginar",
  strand: "JD",
  faixa: "F0",
  prereqs: ["N1.10"],
  howto: FALAS_MOLDURA.escondidos.howto,
  explain: FALAS_MOLDURA.escondidos.explain,
  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],
  niveis: {
    1: { primitiva: "moldura", micro: "escondidos", rt_alvo: 6000 },
    2: { primitiva: "moldura", micro: "escondidos", rt_alvo: 5500 },
    3: { primitiva: "moldura", micro: "escondidos", rt_alvo: 5000 },
    4: { primitiva: "moldura", micro: "escondidos", rt_alvo: 4500 },
    5: { primitiva: "moldura", micro: "escondidos", rt_alvo: 4000 },
  },
  micros: [{
    id: "escondidos",
    fonte: "JD5",
    alvo: "manter todo e parte na cabeca ate a moldura desaparecer",
    kinds: ["moldura"],
    params: { modo: "escondidos", audio_prompt: FALAS_MOLDURA.escondidos.audioPrompt },
    dominio,
  }],
  erros_tipicos: [
    { id: MisconceptionTag.RESPONDE_O_VISIVEL, descricao: "Leu so o que ficou visivel." },
    { id: MisconceptionTag.RESPONDE_O_TODO, descricao: "Respondeu o todo, nao a parte escondida." },
    { id: MisconceptionTag.DEPENDE_DE_ESTRUTURA, descricao: "Ainda depende da moldura para sustentar a imagem mental." },
  ],
};

/**
 * Todas as trilhas cujo manipulativo ja existe. JD4 continua fora: e outra divida
 * e nao deve entrar de carona na P17.
 */
export const JARDIM: TrilhaDoJardim[] = [
  { ficha: JD1, mae: "N1.03", destravaNoNivel: 3 },
  { ficha: JD2, mae: "N1.08", destravaNoNivel: 3 },
  { ficha: JD3, mae: "N1.11", destravaNoNivel: 3 },
  { ficha: JD5, mae: "N1.10", destravaNoNivel: 3 },
];'''
replace_once("src/curriculum/fichas/dojo/jardim/index.ts", marker, replacement)

# 9) N1.11 fica registrada no contrato de canario, mas NAO e ativada.
replace_once(
    "src/curriculum/motores/canaryContract.test.ts",
    'import { N1_10 } from "../fichas/jornada/N1.10";\n',
    'import { N1_10 } from "../fichas/jornada/N1.10";\nimport { N1_11 } from "../fichas/jornada/N1.11";\n',
)
replace_once(
    "src/curriculum/motores/canaryContract.test.ts",
    '  "N1.10": N1_10,\n',
    '  "N1.10": N1_10,\n  "N1.11": N1_11,\n',
)

# 10) Teste focal da arquitetura curricular.
Path("src/curriculum/fichas/jornada/parteTodoProgressao.test.ts").write_text('''import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { N1_10 } from "./N1.10";
import { N1_11 } from "./N1.11";
import { JARDIM } from "../dojo/jardim";
import { grafoSaga } from "../../grafo_saga";
import { MisconceptionTag } from "../../../constants/misconceptions";

describe("P17 — uma competencia, multiplas representacoes", () => {
  it("N1.10 preserva JD5 ate memoria >5 e so entao formaliza em NumberBond", () => {
    expect([1, 2, 3, 4, 5].map(n => N1_10.niveis[n].primitiva))
      .toEqual(["moldura", "moldura", "moldura", "moldura", "bond"]);
    expect([1, 2, 3, 4].map(n => N1_10.micros.find(m => m.id === N1_10.niveis[n].micro)?.fonte))
      .toEqual(["JD5", "JD5", "JD5", "JD5"]);
    expect(N1_10.micros.find(m => m.id === N1_10.niveis[5].micro)?.fonte).toBe("F1-parte-todo");

    const l4 = Composer.generate(N1_10, 4);
    const l5 = Composer.generate(N1_10, 5);
    expect(l4.kind).toBe("moldura");
    expect(l4.exigeEvidencia).toBeTruthy();
    expect(l5.kind).toBe("bond");
    expect((l5.uiProps as any).whole).toBeGreaterThanOrEqual(4);
    expect([(l5.uiProps as any).part1, (l5.uiProps as any).part2]).toContain("?");
    expect(l5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
  });

  it("N1.11 progride de JD3 para F28: moldura -> bond -> simbolo", () => {
    expect([1, 2, 3, 4, 5].map(n => N1_11.niveis[n].primitiva))
      .toEqual(["moldura", "moldura", "bond", "plain", "plain"]);
    expect([1, 2, 3, 4, 5].map(n => N1_11.micros.find(m => m.id === N1_11.niveis[n].micro)?.fonte))
      .toEqual(["JD3", "JD3", "F28", "F28", "F28"]);

    const bond = Composer.generate(N1_11, 3);
    const simbolo = Composer.generate(N1_11, 4);
    expect(bond.kind).toBe("bond");
    expect((bond.uiProps as any).whole).toBe(10);
    expect(simbolo.kind).toBe("plain");
    expect((simbolo.uiProps as any).text).toMatch(/\\+ □ = 10/);
    expect(simbolo.masteryRule).toEqual({ acertos: 4, de: 4, sessoes: 3 });
  });

  it("distratores simbolicos preservam diagnostico especifico", () => {
    for (let i = 0; i < 40; i += 1) {
      const q = Composer.generate(N1_11, 5);
      const tags = new Set((q.options ?? []).map(o => o.misconception).filter(Boolean));
      expect(tags.has(MisconceptionTag.RESPONDE_O_TODO)).toBe(true);
      expect(tags.has(MisconceptionTag.OFF_BY_ONE)).toBe(true);
    }
  });

  it("JD3 e JD5 completas vivem no Jardim, sem virar nos paralelos do grafo", () => {
    const jd3 = JARDIM.find(t => t.ficha.id === "JD3");
    const jd5 = JARDIM.find(t => t.ficha.id === "JD5");
    expect(jd3).toMatchObject({ mae: "N1.11", destravaNoNivel: 3 });
    expect(jd5).toMatchObject({ mae: "N1.10", destravaNoNivel: 3 });
    expect(Object.keys(jd3!.ficha.niveis)).toHaveLength(5);
    expect(Object.keys(jd5!.ficha.niveis)).toHaveLength(5);
    expect(grafoSaga.some(n => n.id === "JD3" || n.id === "JD5")).toBe(false);
  });

  it("o DAG canonico fica intacto", () => {
    expect(grafoSaga.find(n => n.id === "N1.10")?.prereqs).toEqual(["N1.04", "N1.08"]);
    expect(grafoSaga.find(n => n.id === "N1.11")?.prereqs).toEqual(["N1.08", "N1.10"]);
    expect(grafoSaga.find(n => n.id === "N3.07")?.prereqs).toEqual(["N1.11", "N1.10", "N2.01"]);
  });
});
''')

# 11) Testes do dominio executavel; acrescentados sem apagar regressao anterior.
p = Path("src/curriculum/motores/progressEngine.test.ts")
text = p.read_text()
text += '''\n\ndescribe("§9 executavel — acertos/de em sessoes reais", () => {\n  const base: Progress = {\n    lvl: 5, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0, maxLvl: 5,\n  };\n\n  const tentativa = (day: string, rule = { acertos: 3, de: 3, sessoes: 2 }): MasteryAttempt => ({\n    durationMs: 5000, helpUsed: false, isReview: false, practiceDay: day, masteryRule: rule,\n  });\n\n  function responder(p: Progress, day: string, respostas: boolean[], rule: { acertos: number; de: number; sessoes: number }) {\n    let atual = p;\n    for (const right of respostas) {\n      atual = applyJourneyAnswer({ ...atual, lvl: 5 }, right, false, tentativa(day, rule)).progress;\n    }\n    return atual;\n  }\n\n  it("4/5 aceita uma falha na janela sem virar quatro seguidas", () => {\n    const rule = { acertos: 4, de: 5, sessoes: 2 };\n    const p = responder(base, "2026-08-01", [true, false, true, true, true], rule);\n    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01"]);\n    expect(p.dom).toBeFalsy();\n  });\n\n  it("4/4 nao fecha a sessao depois de apenas tres", () => {\n    const rule = { acertos: 4, de: 4, sessoes: 3 };\n    let p = responder(base, "2026-08-01", [true, true, true], rule);\n    expect(p.masteryEvidence?.passedSessionDays ?? []).toHaveLength(0);\n    p = responder(p, "2026-08-01", [true], rule);\n    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01"]);\n  });\n\n  it("tres sessoes exigem tres sessoes maduras e espacadas", () => {\n    const rule = { acertos: 4, de: 4, sessoes: 3 };\n    let p = responder(base, "2026-08-01", [true, true, true, true], rule);\n    p = responder(p, "2026-08-03", [true, true, true, true], rule);\n    expect(p.dom).toBeFalsy();\n    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01", "2026-08-03"]);\n    p = responder(p, "2026-08-05", [true, true, true, true], rule);\n    expect(p.dom).toBe(true);\n    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01", "2026-08-03", "2026-08-05"]);\n  });\n\n  it("default 3/3/2 continua funcionando para questao sem regra", () => {\n    let p = base;\n    const attempt = { durationMs: 5000, helpUsed: false, isReview: false, practiceDay: "2026-08-01" };\n    for (let i = 0; i < 3; i += 1) p = applyJourneyAnswer({ ...p, lvl: 5 }, true, false, attempt).progress;\n    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01"]);\n    for (let i = 0; i < 3; i += 1) {\n      p = applyJourneyAnswer({ ...p, lvl: 5 }, true, false, { ...attempt, practiceDay: "2026-08-03", isReview: true }).progress;\n    }\n    expect(p.dom).toBe(true);\n  });\n});\n'''
p.write_text(text)

print("P17 patch preparado")
