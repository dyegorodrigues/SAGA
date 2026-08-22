import { FichaCompetencia } from "../../schema";
import { PerimetroEvidence, PerimetroMisconception } from "../../procedimentos/perimetroContract";

const dominio = { acertos: 3, de: 3, sessoes: 2 };
const dominioComEvidencia = {
  ...dominio,
  exige: {
    evidencia: PerimetroEvidence.COMPAROU_PERIMETRO_AREA,
    descricao: "Distinguir corretamente a volta (perímetro) do chão interno (área) no L4.",
  },
};

const tutorial = [
  { fala: "Vamos dar a volta.", show: { percorrerBorda: true } },
  { fala: "Um, dois, três...", show: { contarSegmentos: true } },
  { fala: "A volta toda é o perímetro!", show: { brilharBorda: true } },
];

/** F63 — A Volta do Terreno: perímetro é a distância ao redor da figura. */
export const GM_07: FichaCompetencia = {
  id: "GM.07",
  nome: "A Volta do Terreno",
  strand: "GM",
  faixa: "F2",
  prereqs: ["GM.05", "N3.11"],

  howto: "Ande pela borda contando cada passo. Só a volta, não o meio.",
  explain: "Perímetro é só a volta. Não conte o que está dentro.",
  distratores: [
    { regra: "conta os quadrados internos como se fossem a volta", tag: PerimetroMisconception.CONFUNDE_COM_AREA },
    { regra: "encerra a soma antes de completar a volta", tag: PerimetroMisconception.ESQUECE_UM_LADO },
    { regra: "conta cada canto como um passo extra", tag: PerimetroMisconception.CONTA_CANTOS_DUAS_VEZES },
  ],

  niveis: {
    1: { primitiva: "shapecanvas", micro: "contar-malha", andaime: "alto" },
    2: { primitiva: "shapecanvas", micro: "somar-lados", andaime: "medio" },
    3: { primitiva: "shapecanvas", micro: "figura-irregular", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "perimetro-vs-area", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "lado-faltante", andaime: "nenhum", rt_alvo: 18000 },
  },

  micros: [
    {
      id: "contar-malha",
      fonte: "F63",
      alvo: "percorrer a borda de uma figura na malha e contar cada segmento uma vez",
      kinds: ["shapecanvas", "arraygrid"],
      params: { modo: "contar-malha", tutorial },
      dominio,
    },
    {
      id: "somar-lados",
      fonte: "F63",
      alvo: "somar comprimentos dos lados dados para obter o perímetro",
      kinds: ["shapecanvas", "arraygrid"],
      params: { modo: "somar-lados" },
      dominio,
    },
    {
      id: "figura-irregular",
      fonte: "F63",
      alvo: "manter a volta completa em figuras que não são retângulos",
      kinds: ["shapecanvas", "arraygrid"],
      params: { modo: "figura-irregular" },
      dominio,
    },
    {
      id: "perimetro-vs-area",
      fonte: "F63",
      alvo: "distinguir comprimento da borda de quantidade de quadrados internos",
      kinds: ["shapecanvas", "arraygrid"],
      params: { modo: "perimetro-vs-area" },
      dominio: dominioComEvidencia,
    },
    {
      id: "lado-faltante",
      fonte: "F63",
      alvo: "descobrir um lado desconhecido a partir do perímetro total",
      kinds: ["shapecanvas", "arraygrid"],
      params: { modo: "lado-faltante" },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: PerimetroMisconception.CONFUNDE_COM_AREA, descricao: "Conta os quadrados de dentro em vez da borda." },
    { id: PerimetroMisconception.ESQUECE_UM_LADO, descricao: "Soma só parte dos lados e não fecha a volta." },
    { id: PerimetroMisconception.CONTA_CANTOS_DUAS_VEZES, descricao: "Adiciona passos extras ao passar pelos cantos." },
  ],
};
