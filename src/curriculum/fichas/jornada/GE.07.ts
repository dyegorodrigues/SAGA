import type { FichaCompetencia, FichaDominio } from "../../schema";
import { PoligonosMisconception } from "../../procedimentos/poligonosContract";

const dominioReconhecimento: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const dominioConstrucao: FichaDominio = { acertos: 2, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Passe o dedo pelo contorno: ele precisa fechar e usar lados retos.", show: { destacarContorno: true } },
  { fala: "Conte cada lado uma vez. Depois compare as propriedades da figura.", show: { contarLados: true } },
];

/** F79 — Polígonos: triângulos e quadriláteros. */
export const GE_07: FichaCompetencia = {
  id: "GE.07",
  nome: "Polígonos: triângulos e quadriláteros",
  strand: "GE",
  faixa: "F3",
  prereqs: ["GE.03", "GE.06"],
  howto: "Confira se a figura fecha com lados retos, conte os lados e então classifique pelas propriedades.",
  explain: "Polígonos são figuras fechadas formadas por segmentos retos. As classes podem se sobrepor: um quadrado também é um retângulo porque satisfaz as propriedades de um retângulo.",
  distratores: [
    { regra: "aceita contorno aberto como polígono", tag: PoligonosMisconception.NAO_FECHA },
    { regra: "conta um lado duas vezes ou esquece um lado", tag: PoligonosMisconception.CONTA_LADOS_ERRADO },
    { regra: "trata classes geométricas como caixas mutuamente exclusivas", tag: PoligonosMisconception.CONFUNDE_CLASSE },
  ],
  niveis: {
    1: { primitiva: "shapecanvas", micro: "identificar-poligono", andaime: "alto" },
    2: { primitiva: "shapecanvas", micro: "triangulos", andaime: "medio" },
    3: { primitiva: "draggroup", micro: "quadrilateros", andaime: "medio" },
    4: { primitiva: "draggroup", micro: "classificar-propriedades", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "construir-classificar", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "identificar-poligono", fonte: "F79", alvo: "distinguir polígono de não-exemplo aberto usando fechamento e lados retos", kinds: ["shapecanvas", "draggroup"], params: { modo: "identificar-poligono", tutorial }, dominio: { ...dominioReconhecimento } },
    { id: "triangulos", fonte: "F79", alvo: "reconhecer triângulos em diferentes orientações pela propriedade de três lados", kinds: ["shapecanvas", "draggroup"], params: { modo: "triangulos", tutorial }, dominio: { ...dominioReconhecimento } },
    { id: "quadrilateros", fonte: "F79", alvo: "agrupar quadriláteros pela propriedade de quatro lados", kinds: ["shapecanvas", "draggroup"], params: { modo: "quadrilateros", tutorial }, dominio: { ...dominioReconhecimento } },
    { id: "classificar-propriedades", fonte: "F79", alvo: "classificar quadrados e retângulos por propriedades, aceitando inclusão de classes", kinds: ["shapecanvas", "draggroup"], params: { modo: "classificar-propriedades", tutorial }, dominio: { ...dominioReconhecimento } },
    { id: "construir-classificar", fonte: "F79", alvo: "construir e classificar um polígono sob ao menos duas condições simultâneas", kinds: ["shapecanvas", "draggroup"], params: { modo: "construir-classificar", tutorial }, dominio: { ...dominioConstrucao } },
  ],
  erros_tipicos: [
    { id: PoligonosMisconception.NAO_FECHA, descricao: "Aceita uma linha quebrada aberta como polígono." },
    { id: PoligonosMisconception.CONTA_LADOS_ERRADO, descricao: "Erra a contagem de lados ou vértices ao classificar." },
    { id: PoligonosMisconception.CONFUNDE_CLASSE, descricao: "Não reconhece inclusão entre classes, como quadrado dentro da classe dos retângulos." },
  ],
};
