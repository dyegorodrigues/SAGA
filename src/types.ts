export interface Kid {
  id: string;
  rt_max_s?: number;
  name: string;
  avatar: string;
  grade: "pre" | "ano1" | "ano2";
  theme: string;
  outfit?: string;
  bgAccessory?: string;
  inventory?: string[];
  age?: number;
  petName?: string;
  /** @deprecated humor agora é calculado do streak; mantido para saves antigos */
  petHunger?: number;
  /** @deprecated humor agora é calculado do streak; mantido para saves antigos */
  petHappiness?: number;
  /** Energia 0-100: alimentar enche (+25), decai 25/dia. SÓ muda animações/frases — nunca bloqueia evolução. */
  petEnergy?: number;
  /** Estoque de rações grátis (1/dia ao completar a primeira missão do dia). */
  petFood?: number;
  /** Último dia (YYYY-MM-DD) em que o decaimento de energia foi aplicado. */
  petDay?: string;
  /** Último dia (YYYY-MM-DD) em que o Desafio Misto 👑 foi completado (1×/dia). */
  lastMixedDay?: string;
}

export interface ThemeConfig {
  nome: string;
  icon: string;
  bg: string[];
  burst: string[];
  emojis: string[];
  praise: string[];
}

export interface Option {
  tag?: string;
  label?: string;
  value: any;
  shape?: string;
  groups?: { n: number; color?: string; }[];
  color?: string;
  /** o que o 🔊 da opção FALA (quando difere do label — ex.: label é emoji 🐴, say é "horse") */
  say?: string;
  /** Tag do sensor de ouro do Radar de Lacunas (ex: "inverte-coluna", "off-by-one") */
  misconception?: string;
}

export interface Question {
  rt_max_s?: number;
  /** A fala que introduz o exercício (narração principal) */
  audioPrompt?: string;
  /** Array de falas em estágios, quando o jogo narra passo-a-passo (ex: I-do/We-do) */
  audioSteps?: string[];
  tutorial?: { say: string; show?: Record<string, any> | string | number; ms?: number }[];
  excecaoCPA?: boolean | "perceptual" | "espacial";
  isFallback?: boolean;
  kind: string;
  prompt: string;
  big?: string | null;
  options?: Option[];
  answer: any;
  uiProps?: any;
  evaluate?: (ans: any) => boolean;
  emoji?: string;
  // For NumberLine
  nlStart?: number;
  nlEnd?: number;
  nlTarget?: number;
  nlStartPos?: number;
  dividend?: number;
  divisor?: number;
  nlJumps?: { val: number; delay?: number }[];
  // For Vertical
  vTop?: number;
  vBot?: number;
  vOp?: "+" | "-";
  vSteps?: any[];
  n?: number;
  groups?: { emoji: string; n: number }[];
  shown?: string[];
  expr?: string;
  
  a?: number;
  b?: number;
  t?: number;
  u?: number;
  coins?: number[];
  notes?: number[];
  title?: string;
  rows?: { e: string; n: number }[];
  story?: string;
  items?: { e: string; pos: string }[];
  review?: boolean;
  sig?: string;
  hour?: number;
  minute?: number;
  digitalShow?: boolean;
  /** idioma da fala desta questão (ex.: "en-US" para Inglês); padrão pt-BR */
  lang?: string;
  /** explicação curta do PORQUÊ (falada/mostrada ao errar — o momento de ensino) */
  explain?: string;
  /** instrução extra de COMO fazer, falada junto do enunciado em exercícios novos */
  howto?: string;
  /** expressão revelada SÓ ao acertar (ex.: esconde a palavra, mostra "CA + SA = CASA 🏠" depois) */
  bigCompleted?: string;
  /** opções ganham botão 🔊 para a criança OUVIR cada uma e escolher por som (método fônico) */
  audibleOptions?: boolean;
  /** som-alvo FALADO após o enunciado mas NUNCA escrito na tela (ex.: a vogal a achar — não entrega a resposta) */
  sayTarget?: string;
  /** kind `journey` (viagem narrada): as cenas em sequência (casa→bairro→…→Terra), cada
   *  uma com o nome e a narração da composição ("muitas casas formam um bairro"). A
   *  transição entre elas é suave (a nova cena entra em cena). Ver JourneyScene. */
  journey?: { slot: string; label: string; say: string }[];
}

export interface Track {
  id: string;
  rt_max_s?: number;
  name: string;
  icon: string;
  color: string;
  dark: string;
  gen: (lvl: number) => Question;
  /** questões por missão (padrão 8; Desafio Misto usa 10) */
  totalQ?: number;
  /** habilidade treinada em cada um dos 5 níveis (mostrada no seletor 🎯) */
  lvlSkills?: string[];
  /** trilhas-alicerce (continuum vertical — Constituição regra 7) */
  prereqs?: string[];
  dominio?: string;
  graphId?: string;
  island?: string;
}

export interface BankItem {
  sig: string;
  hits: number;
  q: Question;
}

export interface Progress {
  /** Janela rolante de erros recentes. O Radar avalia isso. */
  misconceptions?: { tag: string; ts: number }[];
  lvl: number;
  streak: number;
  bad: number;
  stars: number;
  ok: number;
  tot: number;
  bank: BankItem[];
  mast: number;
  /** maior nível já alcançado (as bolinhas conquistadas — nunca regridem) */
  maxLvl?: number;
  /** Domínio Absoluto 👑: evidências maduras de compreensão, fluência, retenção e independência. */
  dom?: boolean;
  /** Telemetria: Cliques em botão de ajuda/dica nesta microcompetência */
  helpClicks?: number;
  /** Telemetria: Quantas vezes a criança desistiu/pulou (skips) este exercício */
  skips?: number;
  /** E1 Professor Mágico — dia (YYYY-MM-DD) da última prática desta trilha
   *  (alimenta a agenda de esquecimento: revisão em 2→4→7→12→21→45 dias) */
  lastDay?: string;
  /** E1 Professor Mágico — tempo de reação médio (ms, média móvel 70/30).
   *  Rápido = conceito automatizado; lento = ainda conta nos dedos (Kumon). */
  rt?: number;
  /** Telemetria: Registro de tags de misconception cometidas para o Radar de Lacunas */
  errKind?: string[];
  /** Leitner: Força de revisão espaçada (1..5) mantida separadamente do nível CPA (lvl/mast) */
  reviewForce?: number;
  /** Evidências independentes para a coroa; `legacy` preserva saves já coroados. */
  masteryEvidence?: MasteryEvidence;
}

export interface MasteryEvidence {
  schemaVersion: 1;
  comprehensionStreak: number;
  independenceStreak: number;
  fluencyStreak: number;
  retentionPasses: number;
  candidateDay?: string;
  crownedBy?: "legacy" | "multidimensional";
}

export interface FactStrength {
  fact_id: string;
  rt_max_s?: number;
  forca: number; // 0-5
  rt_medio: number;
  ultima_vez: string;
  erros_seguidos: number;
}

export interface ProcStrength {
  proc_id: string;
  rt_max_s?: number;
  precisao: number;
  passo_fraco?: string;
  tempo_medio: number;
  forca: number; // 0-5
  ultima_vez: string;
  erros_seguidos: number;
}

export interface DojoTrackState {
  unlocked: boolean;
  mastered: boolean;
  facts?: Record<string, FactStrength>;
  procs?: Record<string, ProcStrength>;
}

export interface LogEntry {
  d: string;
  ok?: number;
  tot?: number;
  stars?: number;
  t: number;
  /** missões completadas no dia (para o bônus da primeira missão) */
  m?: number;
}

export interface State {
  schemaVersion?: number;
  kids: Kid[];
  progress: Record<string, Record<string, Progress>>;
  dojoTracks?: Record<string, Record<string, DojoTrackState>>;
  /** 🪙 Moedinhas: moeda GASTÁVEL (álbum, comida, acessórios). ⭐ Estrelas (progress.stars) são XP vitalício e NUNCA se gastam. */
  coins: Record<string, number>;
  /** @deprecated bolsa antiga de "estrelas gastáveis" — migrada para coins. Mantida só para ler saves antigos. */
  wallet?: Record<string, number>;
  album: Record<string, string[]>;
  log: Record<string, LogEntry[]>;
  sound: boolean;
  customTracks?: any[];
}

export interface TelemetryLog {
  kidId: string;
  timestamp: number;
  trackId: string;
  qIndex: number;
  qPrompt: string;
  expectedAnswer: string;
  givenAnswer: string;
  reactionTimeMs: number;
  isCorrect: boolean;
  misconceptionTags?: string[];
  tutState?: string;
  hintsUsed?: number;
}
