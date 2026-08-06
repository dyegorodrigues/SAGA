import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";

/**
 * `EmojiRow` — a escada de modos, e a pendência P1 resolvida.
 *
 * ---
 *
 * ### O que estava em aberto
 *
 * O `PLANO_DO_BLOCO_F0 §3` registrou quatro escadas de modo dentro do F0. A do
 * `EmojiRow` é a única que **começa no degrau errado**:
 *
 * > plain → **flash** (N1.03/JD1) → **flash + skin mão** (N1.08/JD2) → **padrão** (AL.02/F52)
 *
 * O N1.03 é **raiz do grafo** (`prereqs: []` em `grafo_saga.ts` — a lista de
 * pré-requisitos escrita na ficha de runtime não governa o desbloqueio). Logo, a
 * primeira vez que a criança encontra uma fileira de objetos, ela some. E o
 * degrau *plain* não aparece em competência nenhuma antes: N1.01 é `DragGroup`,
 * N1.02 é `TouchCount`. A escada não tem primeiro degrau.
 *
 * ### A decisão (pendência P1)
 *
 * **A ficha JD1 não muda.** O degrau que falta já está escrito nela, e nunca foi
 * implementado:
 *
 * - §4 *Preparação*: "um ponto pisca no centro da área (fixa o olhar)"
 * - §4 *Contagem regressiva*: "três pulsos suaves: 3… 2… 1"
 * - §4 *Acerto*: "os objetos **reaparecem** por 800ms confirmando o que ela viu"
 * - §4 *Erro suave*: "os objetos reaparecem **agrupados no padrão de dado**"
 * - §8 *Coreografia*: `{ fala: "Viu? Eram dois.", mostra: { revelar: 2 } }`
 *
 * Cada `revelar` **é a fileira parada** — o degrau *plain*. A criança vê o
 * desenho em repouso três vezes por questão; só nunca ANTES do relance, que é
 * precisamente o que protege a competência (§2: "se os objetos ficam na tela, a
 * criança conta um a um e a competência não é treinada").
 *
 * E a primeira exposição de todas é a **micro-aula do nível 1**, que pisca uma
 * quantidade de demonstração, diz quanto era e mostra parado — sem cobrar nada.
 * É o "nível zero que ensina o desenho antes de cobrar a matemática" do
 * Padrão Ouro §6.36, escrito pela própria ficha em 2026.
 *
 * > **P1 não era decisão pedagógica: era ficha lida pela metade.**
 * > O que restava decidir — se o cânone precisava de uma competência nova só
 * > para alfabetizar o desenho — se responde sozinho quando a §4 e a §8 saem
 * > do papel. Registrado assim, e não "resolvido em silêncio", porque a
 * > pendência estava aberta com meu nome.
 *
 * O mecanismo que impede a regressão é `revelaAntesDeCobrar`, cobrado em teste
 * para toda ficha em modo relance: sem o beat de `revelar`, a escada volta a
 * não ter primeiro degrau e ninguém percebe.
 *
 * ### As três fichas desta primitiva
 *
 * | Ficha | Competência | Modo | O que a criança faz |
 * |---|---|---|---|
 * | JD1 | N1.03 | `flash` | vê objetos piscarem e diz quantos eram |
 * | JD2 | N1.08 | `flash-mao` | vê uma ou duas mãos piscarem e diz quantos dedos |
 * | F52 | AL.02 | `padrao` | vê a sequência e diz o que vem na lacuna |
 *
 * Construídas juntas de propósito (`PLANO §6`, passo 2): construir uma por vez
 * faria a decisão da escada ser tomada três vezes, que é como as quatro
 * rejeições do modelo de área aconteceram.
 */

/* ------------------------------------------------------------------ *
 *  A escada
 * ------------------------------------------------------------------ */

/** Os modos da primitiva, na ordem em que a criança deve encontrá-los. */
export type ModoDaFileira = "plain" | "flash" | "flash-mao" | "padrao";

/**
 * A escada, em ordem. É a tabela do `PLANO §3` transcrita, não parafraseada.
 *
 * Um modo novo **é um desenho novo para a criança**, ainda que o componente já
 * exista no código. Por isso a ordem é dado, não comentário: o teste lê daqui.
 */
export const ESCADA_DE_MODOS: ModoDaFileira[] = ["plain", "flash", "flash-mao", "padrao"];

/** O degrau imediatamente anterior, ou `null` para o primeiro. */
export function degrauAnterior(modo: ModoDaFileira): ModoDaFileira | null {
  const i = ESCADA_DE_MODOS.indexOf(modo);
  return i <= 0 ? null : ESCADA_DE_MODOS[i - 1];
}

/**
 * O modo mostra a fileira PARADA antes de cobrar alguma coisa dela?
 *
 * É a guarda da P1, e vale para os três modos de relance. `padrao` responde
 * `true` porque a sequência dele nunca some: ela fica na tela enquanto a criança
 * pensa, e o degrau *plain* está ali o tempo todo.
 */
export function exigeRevelacao(modo: ModoDaFileira): boolean {
  return modo === "flash" || modo === "flash-mao";
}

/* ------------------------------------------------------------------ *
 *  JD1 — O Olhômetro (N1.03)
 *
 *  §5, transcrita:
 *
 *  | Nível | Quantidade | Exposição | Arranjo        |
 *  |-------|------------|-----------|----------------|
 *  |   1   |   1 a 2    |   1,5s    | fila           |
 *  |   2   |   1 a 3    |   1,2s    | fila           |
 *  |   3   |   1 a 4    |   1,0s    | padrão de dado |
 *  |   4   |   1 a 5    |   0,8s    | padrão de dado |
 *  |   5   |   1 a 5    |   0,6s    | disperso       |
 * ------------------------------------------------------------------ */

/** Como os objetos estão dispostos na área de relance. */
export type ArranjoDaFileira = "fila" | "dado" | "disperso";

/** A faixa de quantidade do nível. */
export function quantidadeDoOlhometro(nivel: number): { min: number; max: number } {
  if (nivel <= 1) return { min: 1, max: 2 };
  if (nivel === 2) return { min: 1, max: 3 };
  if (nivel === 3) return { min: 1, max: 4 };
  return { min: 1, max: 5 };
}

/**
 * Quanto tempo os objetos ficam na tela.
 *
 * **A dificuldade desta ficha é o tempo, não o número** (§5: "sobe por
 * automaticidade"). Uma escada que só aumentasse a quantidade faria a criança
 * ficar melhor em contar rápido — o oposto do que a competência treina.
 */
export function exposicaoDoOlhometro(nivel: number): number {
  if (nivel <= 1) return 1500;
  if (nivel === 2) return 1200;
  if (nivel === 3) return 1000;
  if (nivel === 4) return 800;
  return 600;
}

/**
 * O arranjo do nível.
 *
 * O **padrão de dado** entra no 3 como andaime (§5: "o formato ⚄ é reconhecível
 * como um todo"), e sai no 5 para o disperso, onde não há figura de apoio.
 */
export function arranjoDoOlhometro(nivel: number): ArranjoDaFileira {
  if (nivel <= 2) return "fila";
  if (nivel <= 4) return "dado";
  return "disperso";
}

/* ------------------------------------------------------------------ *
 *  JD2 — A Mão Relâmpago (N1.08)
 *
 *  §5, transcrita:
 *
 *  | Nível | Quantidade | Exposição | Configuração                          |
 *  |-------|------------|-----------|---------------------------------------|
 *  |   1   |   1 a 5    |   1,5s    | uma mão, a partir do polegar          |
 *  |   2   |   1 a 5    |   1,2s    | uma mão, qualquer configuração        |
 *  |   3   |   5 a 10   |   1,2s    | duas mãos, uma sempre CHEIA           |
 *  |   4   |   6 a 10   |   1,0s    | duas mãos, distribuição livre         |
 *  |   5   |   1 a 10   |   0,7s    | duas mãos, livre, SEM mão cheia       |
 * ------------------------------------------------------------------ */

/** Como os dedos se distribuem no nível. */
export type ConfiguracaoDaMao =
  /** Uma mão, dedos levantados a partir do polegar. É a forma canônica. */
  | "canonica"
  /** Uma mão, qualquer subconjunto de dedos. */
  | "livre"
  /** Duas mãos, uma delas sempre cheia: a âncora do 5 explícita. */
  | "duas-com-cheia"
  /** Duas mãos, distribuição livre. */
  | "duas-livres"
  /** Duas mãos, e nenhuma delas cheia: o andaime some (fading, §5). */
  | "duas-sem-cheia";

export function quantidadeDaMao(nivel: number): { min: number; max: number } {
  if (nivel <= 2) return { min: 1, max: 5 };
  if (nivel === 3) return { min: 5, max: 10 };
  if (nivel === 4) return { min: 6, max: 10 };
  return { min: 1, max: 10 };
}

export function exposicaoDaMao(nivel: number): number {
  if (nivel <= 1) return 1500;
  if (nivel <= 3) return 1200;
  if (nivel === 4) return 1000;
  return 700;
}

export function configuracaoDaMao(nivel: number): ConfiguracaoDaMao {
  if (nivel <= 1) return "canonica";
  if (nivel === 2) return "livre";
  if (nivel === 3) return "duas-com-cheia";
  if (nivel === 4) return "duas-livres";
  return "duas-sem-cheia";
}

/** A configuração usa duas mãos? */
export function duasMaos(config: ConfiguracaoDaMao): boolean {
  return config !== "canonica" && config !== "livre";
}

/* ------------------------------------------------------------------ *
 *  F52 — O que vem depois? (AL.02)
 *
 *  §5, transcrita:
 *
 *  | Nível | Tipo de padrão                          |
 *  |-------|-----------------------------------------|
 *  |   1   | AB                                      |
 *  |   2   | AAB ou ABB                              |
 *  |   3   | ABC                                     |
 *  |   4   | lacuna no MEIO, não no fim              |
 *  |   5   | padrão crescente (1 bola, 2 bolas, …)   |
 * ------------------------------------------------------------------ */

/** A unidade de repetição do nível, escrita como as letras da ficha. */
export type UnidadeDePadrao = "AB" | "AAB" | "ABB" | "ABC" | "CRESCENTE";

/**
 * As unidades possíveis no nível.
 *
 * Devolve **lista**, não valor único, porque o nível 2 dá duas alternativas
 * ("AAB **ou** ABB") e sortear entre elas é a ficha, não invenção. Os níveis 4
 * e 5 herdam o repertório do 3: a ficha muda a POSIÇÃO da lacuna no 4 e o tipo
 * de crescimento no 5, não o vocabulário de unidades.
 */
export function unidadesDoNivel(nivel: number): UnidadeDePadrao[] {
  if (nivel <= 1) return ["AB"];
  if (nivel === 2) return ["AAB", "ABB"];
  if (nivel === 3) return ["ABC"];
  if (nivel === 4) return ["AB", "AAB", "ABB", "ABC"];
  return ["CRESCENTE"];
}

/** A lacuna fica no meio da sequência? Só no nível 4 (§5). */
export function lacunaNoMeio(nivel: number): boolean {
  return nivel === 4;
}

/**
 * A moldura que desliza sobre o "pedaço que se repete" aparece?
 *
 * §4 diz **"nível 1-2"**, e §2 explica por quê: *"a chave é a unidade de
 * repetição"*. Ela é o andaime que ensina a ver o pedaço; mantê-la nos níveis
 * altos apagaria o degrau que eles existem para cobrar.
 */
export function mostraMolduraDaUnidade(nivel: number): boolean {
  return nivel <= 2;
}

/** Quantos elementos a sequência mostra antes da lacuna. */
export function comprimentoDaSequencia(unidade: UnidadeDePadrao): number {
  // Três repetições completas é o mínimo para a regra ser inferível: com duas,
  // "ABAB" também se lê como uma unidade "ABAB" que ninguém viu repetir. Com o
  // crescente, três termos já mostram o passo (1, 2, 3 → 4).
  const tamanho = unidade === "CRESCENTE" ? 1 : unidade.length;
  return tamanho * 3;
}

/* ------------------------------------------------------------------ *
 *  As alternativas do relance
 * ------------------------------------------------------------------ */

/**
 * Os numerais que sobem da base (JD1 §3 e JD2 §3: "2 a 3 numerais").
 *
 * ### A restrição que a ficha impõe sem escrever
 *
 * A §6 das duas fichas prevê a tag `CHUTE_SEGURO` — *"sempre o número do meio:
 * não viu, escolheu a opção central"*. Isso só é observável se **a resposta
 * certa nem sempre for a central**. Um construtor ingênuo devolve
 * `{n−1, n, n+1}` ordenado, a certa fica no meio em toda questão, e chutar o
 * meio passa a ser a estratégia perfeita: a criança que não olha acerta tudo, e
 * a tag que existe para detectá-la nunca dispara.
 *
 * Por isso as alternativas são sorteadas de um lado e do outro do alvo, e a
 * posição da certa varia. Mesma família da armadilha §6.2 — coincidência
 * numérica que destrói o distrator.
 *
 * O resultado sai **ordenado**: o meio é o meio da tela, e é dele que a tag
 * fala. Quem embaralhar depois apaga o diagnóstico.
 */
export function alternativasDoRelance(
  alvo: number,
  min: number,
  max: number,
  sorteio: () => number,
): number[] {
  const abaixo: number[] = [];
  const acima: number[] = [];
  for (let v = alvo - 1; v >= min; v -= 1) abaixo.push(v);
  for (let v = alvo + 1; v <= max; v += 1) acima.push(v);

  const escolhidas = new Set<number>([alvo]);
  // Quantos vizinhos entram de cada lado. Sortear isto é o que tira a resposta
  // do centro: 2 abaixo põe a certa na ponta direita, 2 acima na esquerda.
  const querAbaixo = Math.floor(sorteio() * 3);
  for (let i = 0; i < querAbaixo && i < abaixo.length; i += 1) escolhidas.add(abaixo[i]);
  for (const v of acima) {
    if (escolhidas.size >= 3) break;
    escolhidas.add(v);
  }
  for (const v of abaixo) {
    if (escolhidas.size >= 3) break;
    escolhidas.add(v);
  }

  return [...escolhidas].sort((a, b) => a - b);
}

/**
 * A alternativa central — a que a tag `CHUTE_SEGURO` observa.
 *
 * Com duas alternativas não existe centro, e devolver uma delas seria fabricar
 * um diagnóstico a partir de um empate. `null` é a resposta honesta.
 */
export function alternativaCentral(alternativas: number[]): number | null {
  if (alternativas.length < 3) return null;
  return alternativas[Math.floor(alternativas.length / 2)];
}

/* ------------------------------------------------------------------ *
 *  Diagnóstico — JD1 §6
 * ------------------------------------------------------------------ */

/** A leitura de uma resposta no relance de objetos (JD1). */
export interface RespostaDoOlhometro {
  resposta: number;
  total: number;
  /** As alternativas oferecidas, em ordem numérica. */
  alternativas: number[];
  arranjo: ArranjoDaFileira;
  /**
   * Ela já acertou esta competência COM apoio de formato (fila ou dado)?
   *
   * Vem do histórico. Sem isto, dizer "depende de formato" de quem nunca acertou
   * em lugar nenhum seria inventar um diagnóstico — o mesmo cuidado que
   * `DEPENDE_DE_ORDEM` já tinha na F01.
   */
  acertouComFormato?: boolean;
}

/**
 * O que a resposta revela — JD1 §6, na ordem do mais específico ao mais genérico.
 *
 * A ordem é a armadilha §6.8: com `OFF_BY_ONE` na frente, ele engoliria
 * `CHUTE_SEGURO` e `DEPENDE_DE_FORMATO` toda vez que o chute caísse a um do
 * alvo — e as duas hipóteses específicas nunca chegariam ao Radar.
 */
export function diagnosticarOlhometro(r: RespostaDoOlhometro): MisconceptionTagType | undefined {
  if (r.resposta === r.total) return undefined;

  // A mais específica: erra sem formato depois de acertar com formato.
  if (r.arranjo === "disperso" && r.acertouComFormato) {
    return MisconceptionTag.DEPENDE_DE_FORMATO;
  }
  if (r.resposta === alternativaCentral(r.alternativas)) {
    return MisconceptionTag.CHUTE_SEGURO;
  }
  if (Math.abs(r.resposta - r.total) === 1) return MisconceptionTag.OFF_BY_ONE;
  return undefined;
}

/* ------------------------------------------------------------------ *
 *  Diagnóstico — JD2 §6
 * ------------------------------------------------------------------ */

/** A leitura de uma resposta na mão relâmpago (JD2). */
export interface RespostaDaMao {
  resposta: number;
  total: number;
  alternativas: number[];
  /** Quantos dedos em cada mão. Uma entrada = uma mão. */
  dedosPorMao: number[];
  /** O polegar está levantado em alguma das mãos? */
  polegarLevantado: boolean;
  config: ConfiguracaoDaMao;
  acertouComFormato?: boolean;
}

/**
 * O que a resposta revela — JD2 §6.
 *
 * `IGNORA_SEGUNDA_MAO` vem antes de tudo porque é a única que fala de
 * **parte-todo**, e a ficha marca isso como pré-requisito frágil, não como erro
 * de contagem: *"não integra os dois conjuntos"*. Classificá-la como
 * `OFF_BY_ONE` mandaria a criança treinar precisão quando o que falta é juntar.
 */
export function diagnosticarMao(r: RespostaDaMao): MisconceptionTagType | undefined {
  if (r.resposta === r.total) return undefined;

  if (r.dedosPorMao.length > 1 && r.dedosPorMao.includes(r.resposta)) {
    return MisconceptionTag.IGNORA_SEGUNDA_MAO;
  }
  if (r.resposta === 5 && r.polegarLevantado) {
    return MisconceptionTag.ANCORA_CINCO_RIGIDA;
  }
  if (r.config === "duas-sem-cheia" && r.acertouComFormato) {
    return MisconceptionTag.DEPENDE_DE_FORMATO;
  }
  if (r.resposta === alternativaCentral(r.alternativas)) {
    return MisconceptionTag.CHUTE_SEGURO;
  }
  if (Math.abs(r.resposta - r.total) === 1) return MisconceptionTag.OFF_BY_ONE;
  return undefined;
}

/* ------------------------------------------------------------------ *
 *  Diagnóstico — F52 §6
 * ------------------------------------------------------------------ */

/** A leitura de uma resposta no padrão (F52). */
export interface RespostaDoPadrao {
  /** A peça escolhida. */
  resposta: string;
  /** A peça certa. */
  correta: string;
  /** A peça imediatamente ANTES da lacuna — o alvo da tag `COPIA_ULTIMO`. */
  anterior: string;
  unidade: UnidadeDePadrao;
  /** Ela já acertou um padrão AB? Vem do histórico. */
  acertouEmAB?: boolean;
}

/**
 * O que a resposta revela — F52 §6.
 *
 * `COPIA_ULTIMO` é **o alvo declarado** da ficha (§2: "ela vê ●▲●▲● e responde ●
 * porque foi o último que viu"). Vem primeiro por isso, e não por frequência.
 */
export function diagnosticarPadrao(r: RespostaDoPadrao): MisconceptionTagType | undefined {
  if (r.resposta === r.correta) return undefined;

  if (r.resposta === r.anterior) return MisconceptionTag.COPIA_ULTIMO;
  if (r.unidade !== "AB" && r.acertouEmAB) return MisconceptionTag.SO_AB;
  return MisconceptionTag.NAO_VE_UNIDADE;
}

/* ------------------------------------------------------------------ *
 *  As falas — §7 das três fichas, letra por letra
 * ------------------------------------------------------------------ */

/**
 * §7 é transcrita, não parafraseada, e existe um teste que compara com o
 * Markdown do cânone. Duas destas frases carregam um aviso em negrito na ficha:
 *
 * - JD1: *"o explain desta ficha é o mais delicado do app. Ele **nunca** pode
 *   dizer 'conte com calma'"* — a competência existe para reconhecer SEM contar.
 * - JD2: *"o explain desta ficha nunca pode dizer 'conte os dedos'"* — dizer
 *   "conte" ensina o erro que a ficha combate.
 *
 * Por isso `PROIBIDO_NO_EXPLAIN` não é decoração: é regra executável.
 */
export const FALAS = {
  olhometro: {
    audioPrompt: "Quantos você viu?",
    howto: "Olhe o desenho todo de uma vez. Não conte — só veja.",
    explain: "Tente olhar o formato que eles fizeram, não um por um.",
  },
  mao: {
    audioPrompt: "Quantos dedos você viu?",
    howto: "Olhe a mão inteira de uma vez. A mão cheia já é cinco.",
    explain: "Veja quantas mãos cheias tem, e quantos dedos sobraram.",
  },
  padrao: {
    audioPrompt: "O que vem depois?",
    howto: "Procure o pedaço que se repete. Depois é só continuar.",
    explain: "Olhe do começo: bola, triângulo, bola, triângulo. Qual vem agora?",
  },
} as const;

/**
 * O que o `explain` de uma ficha perceptual **não** pode dizer.
 *
 * As duas fichas escrevem o veto em negrito. Escrito como dado, ele vira teste:
 * a próxima pessoa que "melhorar" o texto para *"conte com calma, sem pressa"*
 * derruba a suíte em vez de destruir a competência em silêncio.
 */
export const PROIBIDO_NO_EXPLAIN = ["conte", "contar", "conta um", "um por um", "um a um"];

/** O `explain` respeita o veto da ficha? */
export function explainRespeitaOVeto(explain: string): boolean {
  const t = explain.toLowerCase();
  // "não conte" e "não um por um" são justamente o que as fichas MANDAM dizer:
  // o veto é sobre mandar contar, não sobre a palavra aparecer. Sem esta
  // ressalva, o howto oficial da JD1 ("Não conte — só veja") seria reprovado.
  const semNegacoes = t
    .replace(/n[ãa]o\s+conte[^.,;!?]*/g, "")
    .replace(/n[ãa]o\s+um\s+por\s+um/g, "")
    .replace(/,?\s*n[ãa]o\s+um\s+a\s+um/g, "");
  return !PROIBIDO_NO_EXPLAIN.some(p => semNegacoes.includes(p));
}
