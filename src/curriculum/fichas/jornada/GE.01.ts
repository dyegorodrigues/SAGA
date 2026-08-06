import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/posicaoProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F47 — Onde está? *Posição no espaço. A primeira geometria.*
 *
 * ---
 *
 * **O que a criança aprende (§2):** as palavras que descrevem posição — em
 * cima, embaixo, dentro, fora, na frente, atrás, ao lado.
 *
 * **Por que é matemática:** *"posição é a base de coordenadas, de gráficos, de
 * geometria. E é a primeira vez que a criança usa linguagem **relacional** —
 * 'embaixo' só existe em relação a algo."*
 *
 * **Por que trava:** *"a criança confunde a perspectiva. 'Atrás' depende de
 * quem olha. E 'embaixo da mesa' versus 'embaixo do livro' exige entender que o
 * referencial muda."*
 *
 * ---
 *
 * ### O que esta versão corrigiu
 *
 * ```ts
 * big: isOnTop ? "🐈\n📦" : "📦\n🐈",
 * prompt: "O gato está EM CIMA ou EMBAIXO da caixa?",
 * options: [{ label: "Em cima" }, { label: "Embaixo" }]
 * ```
 *
 * - **A resposta era lida.** As alternativas eram as palavras *"Em cima"* e
 *   *"Embaixo"*, escritas, numa competência de faixa F0. A §3 diz *"sem botões:
 *   a criança **toca no objeto**"*.
 * - **Havia um objeto só.** A §3 pede *"UM referencial e **dois objetos**, um
 *   acima e um abaixo"*. Com gato e caixa não há o que comparar — a caixa é o
 *   referencial, o gato é o único objeto, e a pergunta vira leitura.
 * - **O nível era ignorado.** Os cinco degraus da §5 não existiam: um par só,
 *   em todos eles.
 * - **Nenhum diagnóstico.** As três tags da §6 não existiam no app.
 *
 * ### A escada da §5
 *
 * | Nível | Par |
 * |---|---|
 * | 1 | em cima / embaixo |
 * | 2 | dentro / fora |
 * | 3 | na frente / atrás |
 * | 4 | esquerda / direita |
 * | 5 | **produzir** — ela coloca o objeto na posição pedida |
 */

const dominio = { acertos: 3, de: 3, sessoes: 2 };

/** §8, transcrita — os três beats do nível 1. */
const coreografia = [
  { fala: "Esta é a mesa.", show: { destacarReferencial: true } },
  { fala: "Este objeto está em cima.", show: { destacarObjeto: 0 } },
  { fala: "E este, embaixo.", show: { destacarObjeto: 1 } },
];

export const GE_01: FichaCompetencia = {
  id: "GE.01",
  nome: "Onde está? (posição e localização)",
  strand: "GE",
  faixa: "F0",
  prereqs: [],
  bncc: "EI03ET04",

  // A §7 escreve o howto e o explain **do nível 1** — eles nomeiam a mesa e o
  // "debaixo". Ficam aqui, literais, porque são o texto do cânone; e cada micro
  // sobrescreve com o seu par, senão a voz manda olhar uma mesa que não está na
  // tela do nível 3. É o mecanismo aberto pela P5.
  howto: FALAS.howto,
  explain: FALAS.explain,

  // Ficha de toque direto: a resposta é o objeto, não uma alternativa. O
  // gerador antigo fabricava as palavras "Em cima"/"Embaixo" — e era isso que
  // transformava geometria em leitura.
  distratores: [],

  niveis: {
    1: { primitiva: "shapecanvas", micro: "cima_baixo", andaime: "mao_fantasma" },
    2: { primitiva: "shapecanvas", micro: "dentro_fora", andaime: "alto" },
    3: { primitiva: "shapecanvas", micro: "frente_atras", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "esquerda_direita", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "produzir", andaime: "nenhum", rt_alvo: 15000 },
  },

  micros: [
    {
      id: "cima_baixo",
      fonte: "F47",
      alvo: "em cima / embaixo — a primeira relação, com a mesa como referência",
      kinds: ["shapecanvas"],
      params: { audio_prompt: FALAS.howto, tutorial: coreografia },
      dominio,
    },
    {
      id: "dentro_fora",
      fonte: "F47",
      alvo: "dentro / fora — o referencial passa a conter, não a sustentar",
      kinds: ["shapecanvas"],
      params: {
        howto: "Olhe a caixa. Agora veja qual objeto está dentro dela.",
        explain: "Compare com a caixa: um está dentro, outro está do lado de fora.",
      },
      dominio,
    },
    {
      id: "frente_atras",
      fonte: "F47",
      alvo: "na frente / atrás — a relação que depende de quem tapa quem",
      kinds: ["shapecanvas"],
      params: {
        howto: "Olhe o muro. Um objeto está escondido atrás dele.",
        explain: "Quem está atrás fica tapado pelo muro. Quem está na frente tapa o muro.",
      },
      dominio,
    },
    {
      id: "esquerda_direita",
      fonte: "F47",
      alvo: "esquerda / direita — o par que exige lateralidade, e tem tag própria",
      kinds: ["shapecanvas"],
      params: {
        howto: "Olhe a árvore. Um objeto está do lado esquerdo dela.",
        explain: "Compare com a árvore: um está de um lado, outro do outro.",
      },
      dominio,
    },
    {
      id: "produzir",
      fonte: "F47",
      alvo: "inverte: em vez de apontar onde está, ela COLOCA onde foi pedido",
      kinds: ["shapecanvas"],
      params: {
        howto: "Pegue o objeto e solte no lugar que eu pedi.",
        explain: "Olhe a referência primeiro. Depois solte o objeto no lugar certo.",
      },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.INVERTE_PAR, descricao: "Trocou a preposição pela oposta: em cima por embaixo, dentro por fora." },
    { id: MisconceptionTag.IGNORA_REFERENCIAL, descricao: "Tocou a própria referência: escolheu sem olhar em relação a quê." },
    { id: MisconceptionTag.ESQUERDA_DIREITA, descricao: "Errou no par que exige lateralidade — outra aula, não vocabulário." },
  ],
};
