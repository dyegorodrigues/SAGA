import { FichaCompetencia, FichaDominio } from "../../schema";
import { AreaF81Misconception } from "../../procedimentos/areaF81Contract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Área é o chão: conte os quadradinhos que preenchem por dentro.", show: { preencherLinha: 0 } },
  { fala: "Se cada linha tem a mesma quantidade, podemos multiplicar linhas por colunas.", show: { destacarLinhasColunas: true } },
];

/** F81 — Área: medir o chão em unidades quadradas e distinguir da volta. */
export const GM_08: FichaCompetencia = {
  id: "GM.08",
  nome: "Área",
  strand: "GM",
  faixa: "F3",
  prereqs: ["GM.07", "N4.02"],
  howto: "Conte quantos quadradinhos cabem numa linha e multiplique pelo número de linhas.",
  explain: "Área é o que preenche por dentro. Perímetro é só a volta.",
  distratores: [
    { regra: "usa a medida da volta no lugar do chão", tag: AreaF81Misconception.CONFUNDE_PERIMETRO },
    { regra: "continua contando unidade por unidade sem reconhecer o arranjo multiplicativo", tag: AreaF81Misconception.CONTA_UM_A_UM },
    { regra: "dá apenas o número e perde a unidade quadrada", tag: AreaF81Misconception.IGNORA_UNIDADE },
  ],
  niveis: {
    1: { primitiva: "arraygrid", micro: "contar-quadrados", andaime: "alto" },
    2: { primitiva: "arraygrid", micro: "linhas-colunas", andaime: "medio" },
    3: { primitiva: "arraygrid", micro: "formula", andaime: "minimo" },
    4: { primitiva: "arraygrid", micro: "area-vs-perimetro", andaime: "minimo" },
    5: { primitiva: "arraygrid", micro: "compor-areas", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "contar-quadrados", fonte: "F81", alvo: "medir a área contando unidades quadradas que preenchem a figura", kinds: ["arraygrid"], params: { modo: "contar-quadrados", unidade: "cm²", tutorial }, dominio },
    { id: "linhas-colunas", fonte: "F81", alvo: "substituir a contagem unitária por linhas × colunas", kinds: ["arraygrid"], params: { modo: "linhas-colunas", unidade: "cm²", tutorial }, dominio },
    { id: "formula", fonte: "F81", alvo: "generalizar a área do retângulo como base × altura", kinds: ["arraygrid"], params: { modo: "formula", unidade: "cm²" }, dominio },
    { id: "area-vs-perimetro", fonte: "F81", alvo: "distinguir explicitamente o chão preenchido da volta da figura", kinds: ["arraygrid"], params: { modo: "area-vs-perimetro", unidade: "cm²" }, dominio },
    { id: "compor-areas", fonte: "F81", alvo: "decompor figura composta em retângulos e somar suas áreas", kinds: ["arraygrid"], params: { modo: "compor-areas", unidade: "cm²" }, dominio },
  ],
  erros_tipicos: [
    { id: AreaF81Misconception.CONFUNDE_PERIMETRO, descricao: "Usa a volta da figura como se fosse sua área." },
    { id: AreaF81Misconception.CONTA_UM_A_UM, descricao: "Não reconhece linhas × colunas como estrutura multiplicativa da área." },
    { id: AreaF81Misconception.IGNORA_UNIDADE, descricao: "Não reconhece que área é medida em unidades quadradas, como cm²." },
  ],
};
