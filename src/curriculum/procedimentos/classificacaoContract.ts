import {
  Atributo,
  CORES,
  Cor,
  Criterio,
  FORMAS,
  Forma,
  FormaDoNivel,
  Peca,
  TAMANHOS,
  Tamanho,
  atributoDoNivel,
  destinoCerto,
  formaDoNivel,
  pecasDoNivel,
  rotuloDoCriterio,
  satisfaz,
  temIntersecao,
  temMaoFantasma,
  temPecaDeFora,
  valoresDe,
  FALAS,
} from "./classificacaoProcedure";

/**
 * O contrato da classificação: o que a tela recebe pronto.
 *
 * As peças, os critérios e a garantia de que a cena **tem o que ensinar**
 * nascem aqui. O componente só desenha — mesma razão de sempre (§6.31): um
 * sorteio dentro do render muda a cena a cada quadro e a sonda deixa de medir.
 */

/** Um laço na tela. */
export interface LacoSpec {
  criterio: Criterio;
  /** O que está escrito na borda do laço: "vermelhos", "grandes", "círculos". */
  rotulo: string;
}

export interface ClassificacaoSpec {
  nivel: number;
  forma: FormaDoNivel;
  enunciado: string;
  /** O falado é igual ao escrito, salvo a instrução contextual do palco. */
  falado: string;
  pecas: Peca[];
  lacos: LacoSpec[];
  /**
   * O critério que valia ANTES, no nível de reclassificação.
   *
   * A §4 descreve o momento: *"as peças voltam ao centro e o rótulo muda (de
   * 'vermelhos' para 'grandes'). As mesmas peças, outro agrupamento."* Sem
   * guardar o anterior, o diagnóstico não distingue *"errou"* de *"continuou no
   * critério de antes"*, que é o `NAO_RECLASSIFICA`.
   */
  criterioAnterior?: Criterio;
  /** Quantos alvos a Mão Fantasma demonstra. §8: um dentro, um fora. */
  maoFantasma: number;
  /**
   * No nível 5 as peças já vêm agrupadas e a pergunta é qual foi o critério.
   * As alternativas são critérios, nunca peças.
   */
  alternativas?: { valor: string; rotulo: string }[];
  resposta?: string;
}

/* ------------------------------------------------------------------ *
 *  O sorteio das peças
 * ------------------------------------------------------------------ */

/**
 * Monta as peças de uma cena.
 *
 * O sorteio é **rejeitado e refeito** quando a cena não tem o que ensinar. Não
 * é capricho: é a mesma regra do §6.2 — o Composer rejeita e sorteia de novo
 * quando a questão gerada é ambígua. Aqui a cena é inútil quando
 *
 * - **nenhuma peça fica de fora** (a §9 exige uma, e o "fora" é a ficha);
 * - **nenhuma peça cai na interseção**, no nível que ensina interseção;
 * - **todas as peças caem no mesmo laço**, que não é classificar, é mover.
 */
function sortearPecas(
  quantas: number,
  criterios: Criterio[],
  forma: FormaDoNivel,
  sorteio: () => number,
): Peca[] {
  const escolha = <T,>(lista: T[]) => lista[Math.floor(sorteio() * lista.length) % lista.length];

  for (let tentativa = 0; tentativa < 60; tentativa += 1) {
    const pecas: Peca[] = Array.from({ length: quantas }, (_, id) => ({
      id,
      cor: escolha(CORES),
      forma: escolha(FORMAS),
      tamanho: escolha(TAMANHOS),
    }));

    if (!temPecaDeFora(pecas, criterios)) continue;
    if (forma === "intersecao" && !temIntersecao(pecas, criterios)) continue;
    // Cada laço precisa receber pelo menos uma peça: um laço que fica vazio a
    // rodada inteira não ensinou nada, e a criança lê como erro do app.
    const cadaLacoRecebe = criterios.every((_, i) =>
      pecas.some(p => destinoCerto(p, criterios).includes(i)));
    if (!cadaLacoRecebe) continue;

    return pecas;
  }

  // O escape determinístico: monta à mão uma cena que satisfaz as três regras.
  // Cair aqui não é falha — é o sorteio ter azar sessenta vezes, e devolver
  // uma cena válida vale mais que estourar na cara da criança.
  return cenaDeEmergencia(quantas, criterios, forma);
}

/** A cena construída, não sorteada, para quando o sorteio não converge. */
function cenaDeEmergencia(quantas: number, criterios: Criterio[], forma: FormaDoNivel): Peca[] {
  const base: Peca = { id: 0, cor: "vermelho", forma: "circulo", tamanho: "grande" };
  const comCriterio = (p: Peca, c: Criterio): Peca => ({ ...p, [c.atributo]: c.valor } as Peca);
  const semCriterio = (p: Peca, c: Criterio): Peca => {
    const outro = valoresDe(c.atributo).find(v => v !== c.valor)!;
    return { ...p, [c.atributo]: outro } as Peca;
  };

  const pecas: Peca[] = [];
  // Uma para cada laço.
  criterios.forEach(c => {
    let p = { ...base, id: pecas.length };
    p = comCriterio(p, c);
    criterios.filter(o => o !== c).forEach(o => { p = semCriterio(p, o); });
    pecas.push(p);
  });
  // Uma na interseção, quando o nível pede.
  if (forma === "intersecao" && criterios.length >= 2) {
    let p = { ...base, id: pecas.length };
    criterios.forEach(c => { p = comCriterio(p, c); });
    pecas.push(p);
  }
  // Uma de fora, sempre.
  let fora = { ...base, id: pecas.length };
  criterios.forEach(c => { fora = semCriterio(fora, c); });
  pecas.push(fora);
  // O resto, alternando entre dentro do primeiro laço e fora.
  while (pecas.length < quantas) {
    const dentro = pecas.length % 2 === 0;
    let p = { ...base, id: pecas.length };
    criterios.forEach((c, i) => {
      p = (dentro && i === 0) ? comCriterio(p, c) : semCriterio(p, c);
    });
    pecas.push(p);
  }
  return pecas.slice(0, quantas);
}

/* ------------------------------------------------------------------ *
 *  Os critérios do nível
 * ------------------------------------------------------------------ */

/** Um critério sorteado sobre um atributo. */
function criterioDe(atributo: Atributo, sorteio: () => number): Criterio {
  const valores = valoresDe(atributo);
  return { atributo, valor: valores[Math.floor(sorteio() * valores.length) % valores.length] };
}

/**
 * Os critérios dos laços do nível.
 *
 * - **excludentes** (nível 2): dois valores do MESMO atributo. Vermelho e azul
 *   nunca coincidem, então nenhuma peça cabe nos dois — que é a definição de
 *   excludente e o que separa o nível 2 do nível 4.
 * - **interseção** (nível 4): dois atributos DIFERENTES. É a única forma de uma
 *   peça pertencer aos dois, e a §5 chama isso de *"o degrau mais difícil do
 *   raciocínio lógico infantil"*.
 */
export function criteriosDoNivel(nivel: number, sorteio: () => number): Criterio[] {
  const forma = formaDoNivel(nivel);
  const fixo = atributoDoNivel(nivel);

  if (forma === "dois-excludentes") {
    const atributo: Atributo = sorteio() < 0.5 ? "cor" : "forma";
    const valores = valoresDe(atributo);
    const a = Math.floor(sorteio() * valores.length) % valores.length;
    const b = (a + 1 + Math.floor(sorteio() * (valores.length - 1))) % valores.length;
    return [
      { atributo, valor: valores[a] },
      { atributo, valor: valores[b] },
    ];
  }

  if (forma === "intersecao") {
    // Cor × tamanho: a §5 dá o exemplo "vermelho E grande". Os dois atributos
    // são visíveis ao mesmo tempo na mesma peça, que é o que torna a
    // interseção legível — forma × cor também serviria, e cor × tamanho é o
    // exemplo do cânone.
    return [criterioDe("cor", sorteio), criterioDe("tamanho", sorteio)];
  }

  const atributo: Atributo = fixo ?? (["cor", "forma", "tamanho"] as Atributo[])[
    Math.floor(sorteio() * 3) % 3
  ];
  return [criterioDe(atributo, sorteio)];
}

/**
 * Escolhe o critério da PRIMEIRA classificação do nível 3 olhando as próprias
 * peças que a criança vai receber.
 *
 * O código anterior sorteava qualquer valor de outro atributo e só guardava o
 * resultado em `criterioAnterior`. Duas falhas ficavam escondidas:
 *
 * 1. a tela nunca executava a primeira classificação — isso é responsabilidade
 *    do palco e é corrigido lá;
 * 2. mesmo que executasse, o critério anterior podia classificar **todas** ou
 *    **nenhuma** das peças, transformando o primeiro ato em mover tudo para um
 *    único lugar. Isso não prepara reclassificação nenhuma.
 *
 * Aqui o primeiro critério precisa ter pelo menos uma peça dentro e uma fora.
 * Também usa outro atributo, como manda a ideia de "reler o mesmo conjunto".
 */
function criterioAnteriorValido(pecas: Peca[], atual: Criterio, sorteio: () => number): Criterio {
  const candidatos: Criterio[] = (["cor", "forma", "tamanho"] as Atributo[])
    .filter(a => a !== atual.atributo)
    .flatMap(atributo => valoresDe(atributo).map(valor => ({ atributo, valor } as Criterio)))
    .filter(c => {
      const dentro = pecas.filter(p => satisfaz(p, c)).length;
      return dentro > 0 && dentro < pecas.length;
    });

  if (candidatos.length > 0) {
    return candidatos[Math.floor(sorteio() * candidatos.length) % candidatos.length];
  }

  // Escape praticamente inalcançável: preserva "outro atributo" mesmo numa
  // cena patológica. O palco continua funcional; o teste de contrato torna uma
  // regressão recorrente visível em vez de silenciosa.
  const outro = (["cor", "forma", "tamanho"] as Atributo[]).find(a => a !== atual.atributo)!;
  return criterioDe(outro, sorteio);
}

/* ------------------------------------------------------------------ *
 *  O spec
 * ------------------------------------------------------------------ */

/** Como a voz nomeia um critério nas alternativas do nível 5. */
export function chaveDoCriterio(c: Criterio): string {
  return `${c.atributo}:${c.valor}`;
}

export function construirClassificacaoSpec(
  nivel: number,
  sorteio: () => number,
): ClassificacaoSpec {
  const forma = formaDoNivel(nivel);
  const criterios = criteriosDoNivel(nivel, sorteio);
  const pecas = sortearPecas(pecasDoNivel(nivel), criterios, forma, sorteio);
  const lacos: LacoSpec[] = criterios.map(c => ({ criterio: c, rotulo: rotuloDoCriterio(c) }));

  const base: ClassificacaoSpec = {
    nivel,
    forma,
    enunciado: FALAS.audioPrompt,
    falado: FALAS.audioPrompt,
    pecas,
    lacos,
    maoFantasma: temMaoFantasma(nivel) ? 2 : 0,
  };

  if (forma === "reclassificar") {
    // A tabela §5 é inequívoca: o nível 3 é "critério mudou — reclassificar as
    // mesmas peças". A linha cinematográfica da §4 escreve "nível 4+", mas o
    // próprio nível 4 da tabela é INTERSEÇÃO. Esta implementação segue a escada
    // explícita §5 e registra a contradição em vez de silenciosamente apagar um
    // dos dois degraus.
    base.criterioAnterior = criterioAnteriorValido(pecas, criterios[0], sorteio);
  }

  if (forma === "descobrir") {
    // §5, nível 5: "a criança descobre o critério usado (por que estas estão
    // juntas?)". As peças já vêm separadas; a resposta é o critério.
    const certo = chaveDoCriterio(criterios[0]);
    const candidatos = [criterios[0], ...distratoresDeCriterio(criterios[0], pecas, sorteio)];
    base.alternativas = candidatos.map(c => ({ valor: chaveDoCriterio(c), rotulo: rotuloDoCriterio(c) }));
    base.resposta = certo;
    base.enunciado = "Por que estas estão juntas?";
    base.falado = base.enunciado;
  }

  return base;
}

/**
 * Os critérios errados que o nível 5 oferece.
 *
 * Um distrator só serve se for **plausível olhando a tela**: um critério que
 * nenhuma peça do grupo satisfaz é descartável sem pensar, e a alternativa
 * vira enfeite. Aqui entram critérios que valem para PARTE do grupo — é neles
 * que a criança que olha só a primeira peça cai.
 */
function distratoresDeCriterio(
  certo: Criterio,
  pecas: Peca[],
  sorteio: () => number,
): Criterio[] {
  const dentro = pecas.filter(p => satisfaz(p, certo));
  const candidatos: Criterio[] = [];
  for (const atributo of ["cor", "forma", "tamanho"] as Atributo[]) {
    if (atributo === certo.atributo) continue;
    for (const valor of valoresDe(atributo)) {
      const c: Criterio = { atributo, valor };
      const quantos = dentro.filter(p => satisfaz(p, c)).length;
      // Vale para alguns, e não para todos: é exatamente a armadilha da criança.
      if (quantos > 0 && quantos < dentro.length) candidatos.push(c);
    }
  }
  if (candidatos.length === 0) {
    // Sem candidato plausível, um critério de outro atributo já basta — melhor
    // uma alternativa fraca que uma pergunta com resposta única na tela.
    const outro = (["cor", "forma", "tamanho"] as Atributo[]).find(a => a !== certo.atributo)!;
    return [criterioDe(outro, sorteio)];
  }
  const embaralhados = [...candidatos].sort(() => sorteio() - 0.5);
  return embaralhados.slice(0, 2);
}

/**
 * O enunciado nunca nomeia o critério no nível 5.
 *
 * *"Por que estas estão juntas?"* é a pergunta inteira. Dizer "por que estas
 * vermelhas estão juntas" entregaria a resposta — e é o mesmo cuidado que o
 * `enunciadoNaoEntregaResposta` faz nas outras fichas.
 */
export function enunciadoNaoEntregaResposta(spec: ClassificacaoSpec): boolean {
  if (spec.forma !== "descobrir") return true;
  const rotulos = spec.lacos.map(l => l.rotulo.toLowerCase());
  return !rotulos.some(r => spec.enunciado.toLowerCase().includes(r));
}
