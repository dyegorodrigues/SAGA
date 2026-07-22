export interface Kid {
  id: string;
  name: string;
  avatar: string;
  grade: "pre" | "ano1";
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
  label?: string;
  value: any;
  shape?: string;
  color?: string;
  /** o que o 🔊 da opção FALA (quando difere do label — ex.: label é emoji 🐴, say é "horse") */
  say?: string;
}

export interface Question {
  kind: string;
  prompt: string;
  big?: string | null;
  options: Option[];
  answer: any;
  emoji?: string;
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
}

export interface BankItem {
  sig: string;
  hits: number;
  q: Question;
}

export interface Progress {
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
  /** Domínio Absoluto 👑: 3 acertos seguidos no nível 5 (nunca se perde) */
  dom?: boolean;
}

export interface LogEntry {
  d: string;
  ok: number;
  tot: number;
  stars: number;
  t: number;
  /** missões completadas no dia (para o bônus da primeira missão) */
  m?: number;
}

export interface State {
  kids: Kid[];
  progress: Record<string, Record<string, Progress>>;
  /** 🪙 Moedinhas: moeda GASTÁVEL (álbum, comida, acessórios). ⭐ Estrelas (progress.stars) são XP vitalício e NUNCA se gastam. */
  coins: Record<string, number>;
  /** @deprecated bolsa antiga de "estrelas gastáveis" — migrada para coins. Mantida só para ler saves antigos. */
  wallet?: Record<string, number>;
  album: Record<string, string[]>;
  log: Record<string, LogEntry[]>;
  sound: boolean;
  customTracks?: any[];
}
