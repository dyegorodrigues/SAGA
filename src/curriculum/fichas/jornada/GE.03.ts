import { FichaCompetencia } from "../../schema";
import {
  DetetiveFormasEvidence,
  DetetiveFormasMisconception,
} from "../../procedimentos/detetiveFormasContract";

const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  exige: {
    evidencia: DetetiveFormasEvidence.SIMETRIA_NIVEL_4,
    descricao: "Encontrar corretamente um eixo de simetria em uma figura.",
  },
};

const coreografia = [
  { fala: "Vamos contar os lados.", show: { contarLados: true } },
  { fala: "Um, dois, três, quatro!", show: { piscarLados: [0, 1, 2, 3] } },
  { fala: "Quatro lados iguais.", show: { destacarForma: true } },
];

/** F58 — O Detetive de Formas: atributos e simetria. */
export const GE_03: FichaCompetencia = {
  id: "GE.03",
  nome: "O Detetive de Formas",
  strand: "GE",
  faixa: "F2",
  prereqs: ["GE.02"],

  howto: "Conte os lados um a um. Depois veja se algum canto é quadrado.",
  explain: "Toque em cada lado enquanto conta. Quantos você contou?",
  distratores: [],

  niveis: {
    1: { primitiva: "shapecanvas", micro: "atributos-lados", andaime: "mao_fantasma" },
    2: { primitiva: "shapecanvas", micro: "atributos-cantos", andaime: "alto" },
    3: { primitiva: "shapecanvas", micro: "atributos-contorno", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "simetria-eixo", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "simetria-completar", andaime: "nenhum", rt_alvo: 18000 },
  },

  micros: [
    {
      id: "atributos-lados",
      fonte: "F58",
      alvo: "descrever uma forma pela quantidade de lados, contando-os um a um",
      kinds: ["shapecanvas"],
      params: { modo: "atributos", tutorial: coreografia },
      dominio,
    },
    {
      id: "atributos-cantos",
      fonte: "F58",
      alvo: "distinguir lados de cantos e reconhecer cantos quadrados",
      kinds: ["shapecanvas"],
      params: { modo: "atributos" },
      dominio,
    },
    {
      id: "atributos-contorno",
      fonte: "F58",
      alvo: "distinguir contornos curvos de lados retos sem escolher pela aparência geral",
      kinds: ["shapecanvas"],
      params: { modo: "atributos" },
      dominio,
    },
    {
      id: "simetria-eixo",
      fonte: "F58",
      alvo: "encontrar e testar um eixo de simetria pela dobra, inclusive horizontal ou diagonal",
      kinds: ["shapecanvas"],
      params: { modo: "symmetry" },
      dominio,
    },
    {
      id: "simetria-completar",
      fonte: "F58",
      alvo: "completar a metade faltante preservando distância e posição em relação ao eixo",
      kinds: ["shapecanvas"],
      params: { modo: "symmetry" },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: DetetiveFormasMisconception.CONTA_ERRADO_LADOS, descricao: "Perde ou repete um lado durante a contagem." },
    { id: DetetiveFormasMisconception.CONFUNDE_LADO_CANTO, descricao: "Conta cantos como se fossem lados, ou vice-versa." },
    { id: DetetiveFormasMisconception.EIXO_ERRADO, descricao: "Escolhe uma dobra que não faz as duas metades coincidirem." },
    { id: DetetiveFormasMisconception.SO_EIXO_VERTICAL, descricao: "Procura apenas eixo vertical e não percebe simetria horizontal ou diagonal." },
  ],
};
