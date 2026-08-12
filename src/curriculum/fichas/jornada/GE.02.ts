import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/formaProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F48 — Que forma é essa? *Reconhecer formas planas, mesmo giradas.*
 *
 * Regra estrutural: GE.02 termina em **invariância de forma plana**. Sólidos
 * pertencem à GE.04/F59 no grafo. A antiga linha "formas 3D" do nível 5 da F48
 * duplicava a competência sucessora e fazia a criança saltar de domínio antes
 * de consolidar a transferência entre representações 2D.
 *
 * A escada agora muda uma coisa por vez:
 * 1. forma pura em pé;
 * 2. a mesma classe girada;
 * 3. cor/tamanho deixam de ser pista;
 * 4. a forma é reconhecida dentro de um objeto do mundo;
 * 5. mistura as representações já conhecidas na mesma cena — nenhuma linguagem
 *    nova, apenas transferência e invariância.
 */

const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  exige: {
    evidencia: Evidencia.FORMA_GIRADA,
    descricao: "Reconhecer a forma mesmo com ela virada.",
  },
};

/** §8 retificada semanticamente: a demonstração acompanha o alvo sorteado. */
const coreografia = [
  { fala: "Procure a forma que eu pedi.", show: { destacarTodas: true } },
  { fala: "Conte os lados da forma certa.", show: { contarLadosAlvo: true } },
  { fala: "Mesmo virada, ela continua sendo a mesma forma!", show: { girarAlvo: true } },
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
  distratores: [],

  niveis: {
    1: { primitiva: "shapecanvas", micro: "puras", andaime: "mao_fantasma" },
    2: { primitiva: "shapecanvas", micro: "giradas", andaime: "alto" },
    3: { primitiva: "shapecanvas", micro: "tamanhos_cores", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "mundo_real", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "mistura_representacoes", andaime: "nenhum", rt_alvo: 12000 },
  },

  micros: [
    {
      id: "puras",
      fonte: "F48",
      alvo: "nomear a forma na orientação padrão — vocabulário visual de partida",
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
      alvo: "tamanho e cor mudam, a forma não — propriedade contra aparência",
      kinds: ["shapecanvas"],
      params: { modo: "formas", audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "mundo_real",
      fonte: "F48",
      alvo: "achar a forma DENTRO de uma coisa: roda, janela, chapéu, quadro",
      kinds: ["shapecanvas"],
      params: {
        modo: "formas",
        howto: "Olhe o contorno da coisa toda. Que forma ele faz?",
        explain: "Não é o nome do objeto que importa: é o formato do contorno.",
      },
      dominio,
    },
    {
      id: "mistura_representacoes",
      fonte: "F48",
      alvo: "transferir: formas puras e formas dentro de objetos aparecem juntas, já com giro, cor e tamanho variados",
      kinds: ["shapecanvas"],
      params: {
        modo: "formas",
        howto: "Algumas formas estão sozinhas e outras escondidas em objetos. Olhe o contorno.",
        explain: "A aparência mudou, mas os lados e o contorno continuam dizendo qual é a forma.",
      },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.SO_ORIENTACAO_PADRAO, descricao: "Não reconhece a forma girada: memorizou uma imagem, não a propriedade." },
    { id: MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO, descricao: "Trocou quadrado por retângulo: não comparou o comprimento dos lados." },
    { id: MisconceptionTag.IGNORA_LADOS, descricao: "Escolheu pela aparência geral, sem usar lados e contorno." },
  ],
};
