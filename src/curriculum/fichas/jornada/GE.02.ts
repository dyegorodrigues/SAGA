import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/formaProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F48 — Que forma é essa? *Reconhecer formas, mesmo giradas.*
 *
 * ---
 *
 * **Por que trava, e quase ninguém trata (§2):**
 *
 * > *"A criança que só vê o triângulo 'em pé' **não reconhece o mesmo triângulo
 * > de cabeça para baixo**. Ela memorizou uma imagem, não a propriedade. O mesmo
 * > com o quadrado girado 45° — vira 'losango' na cabeça dela."*
 *
 * **A regra de design que resolve:** *"a mesma forma aparece girada em ângulos
 * diferentes **desde o nível 2**. Sem isso, o app ensina a reconhecer desenhos,
 * não formas."*
 *
 * ---
 *
 * ### O que esta versão corrigiu
 *
 * ```ts
 * { kind: "plain", big: "🔴 ou 🟥 ?", prompt: "Qual é o círculo?",
 *   options: [{ label: "🔴" }, { label: "🟥" }], answer: "circ" }
 * ```
 *
 * Uma questão só, congelada, com o `lvl` ignorado — e, o que apaga a
 * competência: **emoji não gira**. `🔴` girado é `🔴`; `🟥` girado 45° continua
 * o mesmo pictograma, porque o desenho do emoji não é uma forma, é uma figura
 * pronta. A única coisa que esta ficha existe para ensinar — que a forma
 * sobrevive ao giro — não tinha como acontecer na tela.
 *
 * Faltavam ainda: as 3 a 4 opções da §3 (havia 2), os cinco degraus da §5, as
 * três tags da §6 e o giro de 360° do acerto, que a §4 chama de *"a lição"*.
 *
 * ### A escada da §5
 *
 * | Nível | Conteúdo |
 * |---|---|
 * | 1 | formas puras, orientação padrão |
 * | 2 | formas **giradas** |
 * | 3 | tamanhos e cores diferentes |
 * | 4 | **no mundo real** (roda = círculo, janela = retângulo) |
 * | 5 | **formas 3D** (cubo, esfera, cilindro) |
 */

const dominio = { acertos: 3, de: 3, sessoes: 2 };

/** §8, transcrita — os três beats do nível 2. */
const coreografia = [
  { fala: "Procuramos o triângulo.", show: { destacarTodas: true } },
  { fala: "Ele tem três lados.", show: { contarLados: 3 } },
  { fala: "Mesmo virado, é triângulo!", show: { girarForma: 360 } },
];

export const GE_02: FichaCompetencia = {
  id: "GE.02",
  nome: "Que forma é essa? (formas planas)",
  strand: "GE",
  faixa: "F0",
  prereqs: ["AL.01"],
  bncc: "EI03ET05",

  howto: FALAS.howto,
  explain: FALAS.explain,

  // Ficha de toque direto na forma: a resposta é a figura, não um rótulo. As
  // "alternativas" são as próprias formas na tela, e é o palco que as desenha.
  distratores: [],

  niveis: {
    1: { primitiva: "shapecanvas", micro: "puras", andaime: "mao_fantasma" },
    2: { primitiva: "shapecanvas", micro: "giradas", andaime: "alto" },
    3: { primitiva: "shapecanvas", micro: "tamanhos_cores", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "mundo_real", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "solidos", andaime: "nenhum", rt_alvo: 12000 },
  },

  micros: [
    {
      id: "puras",
      fonte: "F48",
      alvo: "nomear a forma na orientação padrão — o degrau que ela já traz de casa",
      kinds: ["shapecanvas"],
      params: { modo: "formas", audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "giradas",
      fonte: "F48",
      alvo: "a MESMA forma, girada: o assunto declarado da ficha",
      kinds: ["shapecanvas"],
      params: { modo: "formas", audio_prompt: FALAS.howto, tutorial: coreografia },
      dominio,
    },
    {
      id: "tamanhos_cores",
      fonte: "F48",
      alvo: "tamanho e cor mudam, a forma não — a propriedade contra a aparência",
      kinds: ["shapecanvas"],
      params: { modo: "formas", audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "mundo_real",
      fonte: "F48",
      alvo: "achar a forma DENTRO de uma coisa: a roda é um círculo",
      kinds: ["shapecanvas"],
      params: {
        modo: "formas",
        howto: "Olhe o formato da coisa toda. A roda é um círculo.",
        explain: "Não é o nome do objeto que importa: é o formato dele.",
      },
      dominio,
    },
    {
      id: "solidos",
      fonte: "F48",
      alvo: "cubo, esfera e cilindro — a forma que tem volume",
      kinds: ["shapecanvas"],
      params: {
        modo: "formas",
        howto: "Agora as formas têm volume. Olhe se ela é redonda, quadrada ou um tubo.",
        explain: "O cubo tem faces quadradas, a esfera é redonda inteira, o cilindro é um tubo.",
      },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.SO_ORIENTACAO_PADRAO, descricao: "Não reconhece a forma girada: memorizou uma imagem, não a propriedade." },
    { id: MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO, descricao: "Trocou quadrado por retângulo: não comparou o comprimento dos lados." },
    { id: MisconceptionTag.IGNORA_LADOS, descricao: "Escolheu pela aparência geral, sem contar os lados." },
  ],
};
