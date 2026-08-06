import {
  FALAS,
  confundiveisCom,
  distanciaMinimaDoNivel,
  escopoDoNivel,
  exigeParFonologico,
  opcoesDoNivel,
  porExtenso,
  velocidadeDoNivel,
} from "./audioChoiceProcedure";

/**
 * O contrato do `AudioChoice`: o que a tela recebe pronto.
 *
 * ### A regra dura desta ficha, e ela é sobre o que NÃO vai no spec
 *
 * A §2 diz que este é *"o único exercício do app onde a pergunta não depende de
 * leitura"*. Logo, **o número pedido não pode aparecer escrito em lugar
 * nenhum** — nem no enunciado, nem por extenso, nem num rótulo de
 * acessibilidade. Ele existe só como som e como uma das alternativas.
 *
 * Era exatamente isso que o gerador antigo violava: ele escrevia `🔊 TRÊS` na
 * tela. Quem lê acerta sem ouvir; quem não lê perde a informação que a tela
 * prometeu dar pelo ouvido.
 *
 * O guarda é `nadaEscritoEntregaOAlvo`, cobrado em teste sobre o spec inteiro.
 */

export interface AudioChoiceSpec {
  nivel: number;
  /** O número que a voz diz. Nunca aparece escrito fora das alternativas. */
  alvo: number;
  /** A palavra que a voz fala: "três". É isto que o `speak` recebe. */
  palavra: string;
  /** As alternativas, na ordem em que a tela as mostra. */
  alternativas: number[];
  /** Multiplicador da velocidade da fala. §5, nível 5: mais rápido. */
  velocidade: number;
  enunciado: string;
  /** O falado é igual ao escrito — e nenhum dos dois traz o alvo. */
  falado: string;
  resposta: number;
}

/**
 * As alternativas.
 *
 * ### Três regras, e cada uma vem de uma seção diferente
 *
 * 1. **§5, nível 1** — *"números bem distintos (1 e 3)"*: a distância mínima
 *    entre as alternativas é 2 no primeiro nível. Vizinho é o degrau seguinte.
 * 2. **§5, nível 4** — *"inclui pares confundíveis"*: quando o alvo tem um par
 *    fonológico dentro do escopo, ele **entra** na lista. É o degrau que a
 *    ficha chama de dificuldade real.
 * 3. **§6, `NAO_ESCUTOU`** — *"sempre a primeira opção"*: a tag só é observável
 *    se a certa **nem sempre for a primeira**. Com o alvo fixo na frente,
 *    chutar a primeira seria a estratégia perfeita e a hipótese nunca poderia
 *    existir. Mesma família do `CHUTE_SEGURO` do relance.
 */
export function alternativasDoNivel(
  alvo: number,
  nivel: number,
  sorteio: () => number,
): number[] {
  const { min, max } = escopoDoNivel(nivel);
  const quantas = opcoesDoNivel(nivel);
  const distancia = distanciaMinimaDoNivel(nivel);

  const escolhidas = [alvo];

  // Regra 2: o par confundível entra primeiro, quando o nível o exige.
  if (exigeParFonologico(nivel)) {
    const pares = confundiveisCom(alvo, max).filter(v => v >= min);
    if (pares.length > 0) escolhidas.push(pares[Math.floor(sorteio() * pares.length) % pares.length]);
  }

  // O resto: sorteado dentro do escopo, respeitando a distância mínima.
  let tentativas = 0;
  while (escolhidas.length < quantas && tentativas < 200) {
    tentativas += 1;
    const cand = min + Math.floor(sorteio() * (max - min + 1));
    if (escolhidas.includes(cand)) continue;
    if (escolhidas.some(v => Math.abs(v - cand) < distancia)) continue;
    escolhidas.push(cand);
  }
  // Escape: escopo pequeno demais para a distância pedida. Cede na distância
  // antes de devolver menos alternativas do que a ficha manda.
  for (let v = min; v <= max && escolhidas.length < quantas; v += 1) {
    if (!escolhidas.includes(v)) escolhidas.push(v);
  }

  // Regra 3: a posição do alvo varia. Embaralha com o sorteio semeado, para a
  // cena continuar reproduzível.
  return embaralhar(escolhidas, sorteio);
}

/** Embaralho determinístico: mesma semente, mesma ordem (§6.31). */
function embaralhar(lista: number[], sorteio: () => number): number[] {
  const fora = [...lista];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

export function construirAudioChoiceSpec(nivel: number, sorteio: () => number): AudioChoiceSpec {
  const { min, max } = escopoDoNivel(nivel);

  const todos = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  /**
   * O alvo não é sorteado livre: ele é sorteado entre os que **permitem o
   * degrau do nível**.
   *
   * - No nível que exige par fonológico, entre os que TÊM par no escopo.
   *   Sortear livre faria metade das questões do nível 4 não serem o nível 4.
   * - No nível 1, entre os que têm parceiro à distância ≥ 2. Com escopo 1 a 3,
   *   o alvo `2` não tem: `1` e `3` estão ambos a um. Sortear o `2` obrigaria
   *   o construtor a ceder na distância e o nível 1 sairia com vizinhos — que
   *   é justamente o degrau 2. A §5 já dizia isto ao dar o exemplo: *"números
   *   bem distintos (**1 e 3**)"*.
   *
   * É a mesma regra do §6.2: o construtor rejeita o sorteio que produz uma
   * questão que não pergunta o que o nível pergunta.
   */
  const elegiveis = exigeParFonologico(nivel)
    ? todos.filter(n => confundiveisCom(n, max).some(v => v >= min))
    : todos.filter(n => todos.some(v => Math.abs(v - n) >= distanciaMinimaDoNivel(nivel)));

  const pool = elegiveis.length > 0 ? elegiveis : todos;
  const alvo = pool[Math.floor(sorteio() * pool.length) % pool.length];

  return {
    nivel,
    alvo,
    palavra: porExtenso(alvo),
    alternativas: alternativasDoNivel(alvo, nivel, sorteio),
    velocidade: velocidadeDoNivel(nivel),
    enunciado: FALAS.audioPrompt,
    falado: FALAS.audioPrompt,
    resposta: alvo,
  };
}

/**
 * ⚠️ Nada escrito entrega o alvo.
 *
 * O número pedido não pode aparecer no enunciado, nem no falado, nem por
 * extenso — só como som e como uma das alternativas. É a regra que o gerador
 * antigo violava escrevendo `🔊 TRÊS` na tela, e ela é a competência inteira:
 * sem isso, quem lê acerta sem ouvir.
 */
export function nadaEscritoEntregaOAlvo(spec: AudioChoiceSpec): boolean {
  const texto = `${spec.enunciado} ${spec.falado}`.toLowerCase();
  if (/\d/.test(texto)) return false;
  return !texto.includes(porExtenso(spec.alvo).toLowerCase());
}

/** A resposta certa aparece exatamente uma vez entre as alternativas. */
export function respostaApareceUmaVez(spec: AudioChoiceSpec): boolean {
  return spec.alternativas.filter(v => v === spec.resposta).length === 1;
}
