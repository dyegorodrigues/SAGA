import {
  Arrumacao,
  FALAS,
  ModoDaMoldura,
  degrauDoNivel,
  perguntaOQueFalta,
} from "./tenFrameProcedure";


/**
 * O contrato da moldura de dez: o que a tela recebe pronto, nas três fichas.
 *
 * A **ocupação é um conjunto de casas**, não um número. Parece detalhe e é o
 * degrau final da JD3: o nível 5 preenche *disperso*, com as casas vazias
 * espalhadas, e um `filled: number` só sabe dizer "as n primeiras". Era assim
 * que o `TenFrame` estava, e por isso aquele nível não tinha como existir.
 */

/** O desenho da moldura no aparelho do projeto. */
export const LARGURA_DE_PROJETO = 340;
/** O lado de cada casa. Cinco casas + vãos cabem em 340 com folga. */
export const LADO_DA_CASA = 56;
export const VAO_DA_CASA = 8;

/**
 * ⚠️ Os temas da F02, que a §1 nomeia: *"Temas: estrelas, ovos, medalhas"*.
 *
 * Isto não é enfeite. A moldura desenhava discos azuis genéricos enquanto a voz
 * perguntava *"quantas **estrelas** você vê?"* — e a criança desta faixa **não
 * lê**: para ela, a única pergunta é a falada. Voz e tela dizendo coisas
 * diferentes é o §6.34, e foi o print que mostrou.
 *
 * A JD3 e a JD5 não têm tema, e é de propósito: a §3 das duas desenha fichas
 * neutras (`[o]`, `O`). Ali o conteúdo é a estrutura, não o objeto.
 */
export const TEMAS_DA_MOLDURA = [
  { emoji: "⭐", plural: "estrelas", genero: "f" },
  { emoji: "🥚", plural: "ovos", genero: "m" },
  { emoji: "🏅", plural: "medalhas", genero: "f" },
] as const;

/**
 * ⚠️ O gênero vai junto com a palavra (§6.5).
 *
 * A primeira versão trocava só o substantivo dentro da fala do cânone, e saiu
 * **"Quantas ovos você vê?"**. A criança não lê a tela, mas ouve a frase — e
 * concordância errada numa voz que ela está usando para aprender a língua é
 * defeito, não deslize de cópia.
 */
export function perguntaDoTema(tema: typeof TEMAS_DA_MOLDURA[number]): string {
  return `${tema.genero === "m" ? "Quantos" : "Quantas"} ${tema.plural} você vê?`;
}

export interface MolduraSpec {
  modo: ModoDaMoldura;
  nivel: number;
  /** 5 ou 10. A F02 §3 manda cinco nos dois primeiros níveis. */
  casas: number;
  /** Índices das casas ocupadas — conjunto, não contagem. */
  ocupadas: number[];
  /** Quantas fichas há na moldura. */
  cheias: number;
  /** JD5: o total antes da tampa. */
  total?: number;
  /** JD5: quantas a tampa cobre. */
  escondidas?: number;
  /** JD5: quantas continuam visíveis. */
  visiveis?: number;
  /** JD5, nível 5: objetos soltos, sem moldura. */
  semMoldura: boolean;
  /** JD5, níveis 1-2: a voz conta o total em voz alta antes de tapar. */
  contaEmVozAlta: boolean;
  /** §4: quanto tempo as fichas ficam visíveis. `null` = não some. */
  flashMs: number | null;
  /** JD3, nível 3: a fileira de cima completa e destacada. */
  ancoraExplicita: boolean;
  /** JD3, nível 5: o vazio está espalhado. */
  disperso: boolean;
  /** F02: o desenho da ficha na casa. Vazio nas outras duas — ali é neutro. */
  emoji?: string;
  alvo: number;
  alternativas: number[];
  enunciado: string;
  falado: string;
  resposta: number;
}

/**
 * ⚠️ As casas ocupadas, e a regra que a F02 chama de inviolável.
 *
 * > *"Sempre da esquerda para a direita, de cima para baixo, **sem buraco**. A
 * > ordem é o que cria a imagem mental estável. Preenchimento aleatório destrói
 * > a competência."*
 *
 * A exceção é o nível 5 da JD3, e ela é o conteúdo daquele degrau: com o vazio
 * espalhado, ele **perde a forma** e a criança precisa integrar em vez de
 * reconhecer uma figura. Fora dali, buraco no meio é defeito.
 */
export function casasOcupadas(
  quantas: number,
  casas: number,
  arrumacao: Arrumacao,
  sorteio: () => number,
): number[] {
  if (arrumacao === "continuo") {
    return Array.from({ length: quantas }, (_, i) => i);
  }

  // Disperso: sorteia as ocupadas e REJEITA o sorteio que sai contíguo — senão
  // metade das questões do nível 5 seria, na prática, do nível 4 (§6.2).
  for (let tentativa = 0; tentativa < 200; tentativa += 1) {
    const todas = Array.from({ length: casas }, (_, i) => i);
    for (let i = todas.length - 1; i > 0; i -= 1) {
      const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
      [todas[i], todas[j]] = [todas[j], todas[i]];
    }
    const escolhidas = todas.slice(0, quantas).sort((a, b) => a - b);
    if (!vazioContiguo(escolhidas, casas)) return escolhidas;
  }
  // Escape: devolve contíguo em vez de laçar para sempre. Uma questão fácil a
  // mais é melhor que a tela travada.
  return Array.from({ length: quantas }, (_, i) => i);
}

/** As casas vazias formam um bloco só? */
export function vazioContiguo(ocupadas: number[], casas: number): boolean {
  const vazias = Array.from({ length: casas }, (_, i) => i).filter(i => !ocupadas.includes(i));
  if (vazias.length <= 1) return true;
  return vazias.every((v, i) => i === 0 || v === vazias[i - 1] + 1);
}

/**
 * ⚠️ Quantas alternativas cada ficha põe na base.
 *
 * A JD3 §3 é explícita — *"Opções — **2 a 3 numerais**, na base"* — e o motivo
 * é a ficha: a criança tem 0,7s de exposição e a resposta é uma percepção, não
 * uma escolha entre muitos. Quatro botões viram leitura.
 *
 * A F02 §3 diz *"teclado numérico escalado ao escopo"* e a JD5 §3 desenha cinco
 * numerais: nessas duas, quatro cabe.
 */
export const TETO_DE_ALTERNATIVAS: Record<ModoDaMoldura, number> = {
  contar: 4,
  faltam: 3,
  escondidos: 4,
};

/**
 * As alternativas: o alvo e os vizinhos, dentro do que a moldura permite.
 *
 * **Sempre com o `cheias` dentro** quando a pergunta é "quantos faltam": é ele
 * que carrega a tag `RESPONDE_O_CHEIO` (e a `INVERTE_PERGUNTA` da F02), e um
 * distrator ausente do banco é um diagnóstico que não acontece.
 */
export function alternativasDaMoldura(
  spec: Omit<MolduraSpec, "alternativas" | "enunciado" | "falado" | "resposta">,
  sorteio: () => number,
): number[] {
  const { alvo, casas, cheias, modo } = spec;
  const teto = modo === "escondidos" ? (spec.total ?? casas) : casas;
  const quantas = TETO_DE_ALTERNATIVAS[modo];
  const escolhidas = [alvo];

  if (perguntaOQueFalta(modo, spec.nivel) && cheias !== alvo && cheias <= teto) {
    escolhidas.push(cheias);
  }
  if (modo === "escondidos") {
    // `RESPONDE_O_VISIVEL` e `RESPONDE_O_TODO` precisam estar na tela.
    for (const v of [spec.visiveis, spec.total]) {
      if (v !== undefined && v !== alvo && !escolhidas.includes(v)) escolhidas.push(v);
    }
  }

  for (const d of [1, -1, 2, -2]) {
    if (escolhidas.length >= quantas) break;
    const cand = alvo + d;
    if (cand >= 0 && cand <= teto && !escolhidas.includes(cand)) escolhidas.push(cand);
  }

  // Embaralho semeado: a certa não pode morar sempre na mesma posição, senão
  // `CHUTE_SEGURO` deixa de ser observável (mesma família do relance).
  const fora = [...escolhidas];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

export function construirMolduraSpec(
  modo: ModoDaMoldura,
  nivel: number,
  sorteio: () => number,
): MolduraSpec {
  const d = degrauDoNivel(modo, nivel);
  const cheias = d.min + Math.floor(sorteio() * (d.max - d.min + 1));

  if (modo === "escondidos") {
    // JD5: o total entra na moldura, a tampa cobre um pedaço, e a pergunta é
    // sobre o pedaço tapado.
    const total = cheias;
    const maxEsconde = Math.min(d.escondeMax ?? total - 1, total - 1);
    const minEsconde = Math.min(d.escondeMin ?? 1, maxEsconde);
    const escondidas = minEsconde + Math.floor(sorteio() * (maxEsconde - minEsconde + 1));
    const base = {
      modo, nivel, casas: d.casas,
      ocupadas: casasOcupadas(total, d.casas, d.arrumacao, sorteio),
      cheias: total,
      total,
      escondidas,
      visiveis: total - escondidas,
      semMoldura: d.semMoldura === true,
      contaEmVozAlta: d.contaEmVozAlta === true,
      flashMs: d.flashMs,
      ancoraExplicita: false,
      disperso: d.arrumacao === "disperso",
      alvo: escondidas,
    };
    return {
      ...base,
      alternativas: alternativasDaMoldura(base, sorteio),
      enunciado: FALAS.escondidos.audioPrompt,
      falado: FALAS.escondidos.audioPrompt,
      resposta: escondidas,
    };
  }

  const falta = perguntaOQueFalta(modo, nivel);
  // ⚠️ Divergência declarada da F02 §5.
  //
  // A tabela manda "1 a 10" no nível 5. Mas o nível 5 é a pergunta invertida —
  // "quantos faltam para encher?" — e com a moldura CHEIA a resposta é zero.
  // Zero não está na reta numérica de uma criança de F0, e a tela mostraria uma
  // moldura completa perguntando o que falta: questão sem resposta possível de
  // dar (§6.2). O intervalo efetivo ali é 1 a 9, como a JD3 já faz pelo mesmo
  // motivo.
  const naMoldura = falta ? Math.min(cheias, d.casas - 1) : cheias;
  const alvo = falta ? d.casas - naMoldura : naMoldura;
  const tema = modo === "contar"
    ? TEMAS_DA_MOLDURA[Math.floor(sorteio() * TEMAS_DA_MOLDURA.length) % TEMAS_DA_MOLDURA.length]
    : undefined;
  const base = {
    modo, nivel, casas: d.casas,
    ocupadas: casasOcupadas(naMoldura, d.casas, d.arrumacao, sorteio),
    cheias: naMoldura,
    semMoldura: false,
    contaEmVozAlta: false,
    flashMs: d.flashMs,
    ancoraExplicita: d.ancoraExplicita === true,
    disperso: d.arrumacao === "disperso",
    emoji: tema?.emoji,
    alvo,
  };
  // O enunciado nomeia o que está DESENHADO. A fala do cânone é a do tema
  // "estrelas"; os outros dois temas trocam a palavra e mais nada.
  const fala = falta || !tema ? FALAS.faltam.audioPrompt : perguntaDoTema(tema);
  return {
    ...base,
    alternativas: alternativasDaMoldura(base, sorteio),
    enunciado: fala,
    falado: fala,
    resposta: alvo,
  };
}

/**
 * ⚠️ A resposta aparece uma vez, e nenhuma alternativa sai do possível.
 *
 * "Quantos faltam" numa moldura de dez nunca é 11, e "quantos escondidos" nunca
 * passa do total. Alternativa impossível é dica grátis.
 */
export function alternativasSaoValidas(spec: MolduraSpec): boolean {
  const teto = spec.modo === "escondidos" ? (spec.total ?? spec.casas) : spec.casas;
  if (spec.alternativas.filter(v => v === spec.resposta).length !== 1) return false;
  if (spec.alternativas.length < 2) return false;
  if (spec.alternativas.length > TETO_DE_ALTERNATIVAS[spec.modo]) return false;
  if (new Set(spec.alternativas).size !== spec.alternativas.length) return false;
  // A resposta nunca é zero: "quantos faltam" com a moldura cheia e "quantos
  // escondi" sem esconder nada são a mesma questão vazia (§6.2).
  if (spec.resposta < 1) return false;
  return spec.alternativas.every(v => v >= 0 && v <= teto);
}

/**
 * ⚠️ O preenchimento respeita a regra da F02 — exceto onde a JD3 manda o oposto.
 */
export function preenchimentoRespeitaAFicha(spec: MolduraSpec): boolean {
  const ordenado = [...spec.ocupadas].sort((a, b) => a - b);
  const semBuraco = ordenado.every((v, i) => v === i);
  return spec.disperso ? !vazioContiguo(spec.ocupadas, spec.casas) : semBuraco;
}
