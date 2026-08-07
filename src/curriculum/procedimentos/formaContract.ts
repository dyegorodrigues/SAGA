import {
  FALAS,
  FORMAS,
  Figura,
  Forma,
  SOLIDOS,
  Solido,
  aceitaGiro,
  anguloDe,
  giraNoNivel,
  mundoRealNoNivel,
  opcoesDoNivel,
  solidosNoNivel,
  variaAparenciaNoNivel,
} from "./formaProcedure";

/**
 * O contrato do `ShapeCanvas` em **modo formas** (ficha F48).
 *
 * A §3 pede *"3 a 4 formas em **contêineres idênticos**, em orientações
 * variadas"*. O contêiner idêntico não é diagramação: é o que impede a cena de
 * responder por tamanho. Se a forma certa vier sempre na caixa maior, a criança
 * acerta sem olhar a forma — e a competência inteira é olhar a forma.
 */

/** O desenho deste palco, no aparelho do projeto. */
export const LARGURA_DE_PROJETO = 340;

/** §3 e §8.3-bis: o contêiner é o alvo do dedo, e é o mesmo para todos. */
export const LADO_DO_CONTEINER = 100;
export const VAO = 12;

/** Cores das formas. No nível 3 elas variam; antes disso, uma só. */
export const COR_PADRAO = "#2563EB";
export const CORES = ["#2563EB", "#DC2626", "#15803D", "#B45309", "#7C3AED"];

export interface OpcaoDeForma {
  /** A figura que esta opção é. */
  figura: Figura;
  /** Graus de giro aplicados ao desenho. */
  giro: number;
  /** O lado do desenho DENTRO do contêiner — nunca o do contêiner. */
  tamanho: number;
  cor: string;
  /**
   * O objeto do mundo real em que a forma aparece (§5, nível 4).
   *
   * `undefined` nos outros níveis: a forma aparece pura. Aqui ela vem **dentro
   * de uma coisa** — a roda é um círculo, a janela é um retângulo —, que é o
   * degrau que tira a forma do abstrato.
   */
  objeto?: "roda" | "janela" | "chapeu" | "quadro";
}

export interface FormaSpec {
  nivel: number;
  /** A figura que o enunciado pede. */
  alvo: Figura;
  /** As opções, na ordem em que a tela as mostra. */
  opcoes: OpcaoDeForma[];
  /** A certa está girada? A §9 exige um acerto assim. */
  alvoGirado: boolean;
  /** §5, nível 5: as figuras são sólidos, não formas planas. */
  solidos: boolean;
  enunciado: string;
  falado: string;
  resposta: Figura;
}

/** Cada objeto do mundo real e a forma que ele É (§5, nível 4). */
export const OBJETOS_REAIS: Record<NonNullable<OpcaoDeForma["objeto"]>, Forma> = {
  roda: "circulo",
  janela: "retangulo",
  chapeu: "triangulo",
  quadro: "quadrado",
};

/**
 * ⚠️ O alvo é sorteado entre os que o nível consegue mostrar.
 *
 * No nível 2 em diante a ficha promete forma **girada**, e o círculo não tem
 * giro observável: um círculo girado é um círculo. Sortear o círculo ali
 * entregaria uma questão anunciada como "girada" que chega à criança em pé, e a
 * §9 — que exige um acerto com a forma girada — passaria a depender de sorte.
 *
 * É o §6.2: o construtor recusa o sorteio que não pergunta o que o nível
 * pergunta.
 */
export function alvosPossiveis(nivel: number): Figura[] {
  if (solidosNoNivel(nivel)) return [...SOLIDOS];
  if (!giraNoNivel(nivel)) return [...FORMAS];
  return FORMAS.filter(aceitaGiro);
}

function embaralhar<T>(lista: T[], sorteio: () => number): T[] {
  const fora = [...lista];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

export function construirFormaSpec(nivel: number, sorteio: () => number): FormaSpec {
  const quantas = opcoesDoNivel(nivel);
  const gira = giraNoNivel(nivel);
  const varia = variaAparenciaNoNivel(nivel);
  const mundoReal = mundoRealNoNivel(nivel);
  const solidos = solidosNoNivel(nivel);

  const possiveis = alvosPossiveis(nivel);
  const alvo = possiveis[Math.floor(sorteio() * possiveis.length) % possiveis.length];

  // As demais opções: figuras DIFERENTES da certa. Uma repetida daria duas
  // respostas certas, e a §6.2 manda recusar o sorteio que faz isso.
  const universo: Figura[] = solidos ? [...SOLIDOS] : [...FORMAS];
  const outras = embaralhar(universo.filter(f => f !== alvo), sorteio).slice(0, quantas - 1);

  function montar(figura: Figura, ehOAlvo: boolean): OpcaoDeForma {
    const plana = !solidos ? (figura as Forma) : null;
    /**
     * O alvo gira **sempre** que o nível gira; as outras giram por sorteio.
     *
     * Se o giro fosse sorteado também para o alvo, metade das questões do nível
     * 2 chegaria com tudo em pé — e o nível 2 é, por definição da §2, "formas
     * giradas". A §9 pede um acerto com a forma girada; sem esta regra, esse
     * acerto seria acidente.
     */
    const giro = plana && gira && (ehOAlvo || sorteio() < 0.6) ? anguloDe(plana, sorteio) : 0;
    return {
      figura,
      giro,
      tamanho: varia ? 48 + Math.floor(sorteio() * 29) : 64,
      cor: varia ? CORES[Math.floor(sorteio() * CORES.length) % CORES.length] : COR_PADRAO,
      ...(mundoReal && plana ? { objeto: objetoDaForma(plana) } : {}),
    };
  }

  const opcoes = embaralhar(
    [montar(alvo, true), ...outras.map(f => montar(f, false))],
    sorteio,
  );

  const enunciado = FALAS.pergunta(alvo);
  return {
    nivel,
    alvo,
    opcoes,
    alvoGirado: opcoes.find(o => o.figura === alvo)!.giro !== 0,
    solidos,
    enunciado,
    falado: enunciado,
    resposta: alvo,
  };
}

function objetoDaForma(forma: Forma): OpcaoDeForma["objeto"] {
  const achado = (Object.keys(OBJETOS_REAIS) as NonNullable<OpcaoDeForma["objeto"]>[])
    .find(k => OBJETOS_REAIS[k] === forma);
  return achado;
}

/**
 * ⚠️ A resposta certa aparece exatamente uma vez.
 *
 * Duas opções da mesma figura fariam a criança tocar uma "errada" que também
 * estava certa — e o diagnóstico registraria como erro uma resposta correta.
 */
export function respostaApareceUmaVez(spec: FormaSpec): boolean {
  return spec.opcoes.filter(o => o.figura === spec.resposta).length === 1;
}

/**
 * ⚠️ Onde a ficha promete giro, a certa **está girada**.
 *
 * É a regra dura da §2 — *"a mesma forma aparece girada em ângulos diferentes
 * desde o nível 2; sem isso, o app ensina a reconhecer desenhos, não formas"*.
 */
export function alvoGiradoQuandoDeve(spec: FormaSpec): boolean {
  if (!giraNoNivel(spec.nivel) || spec.solidos) return true;
  return spec.alvoGirado;
}

/**
 * ⚠️ Todos os contêineres têm o mesmo tamanho.
 *
 * §3, e não é diagramação: contêiner maior para a forma certa deixaria a criança
 * acertar sem olhar a forma. O que varia no nível 3 é o **desenho** dentro da
 * caixa, nunca a caixa.
 */
export function conteineresIdenticos(): number {
  return LADO_DO_CONTEINER;
}
