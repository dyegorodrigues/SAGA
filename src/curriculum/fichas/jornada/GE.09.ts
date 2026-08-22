import type { FichaCompetencia, FichaDominio } from "../../schema";
import { CirculoAreasMisconception } from "../../procedimentos/circuloAreasContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { say: "Monte duas cópias iguais: juntas elas formam uma figura cuja área você já sabe medir.", show: { foco: "montagem" }, sync: "junto" },
  { say: "A altura cai perpendicular à base. O lado inclinado não substitui a altura.", show: { foco: "altura" }, sync: "junto" },
  { say: "No círculo, compare o raio, o diâmetro e a volta antes de calcular.", show: { foco: "circulo" }, sync: "junto" },
];

/** F91 — Círculo e áreas: fórmulas reconstruídas visualmente, nunca decoradas. */
export const GE_09: FichaCompetencia = {
  id: "GE.09",
  nome: "Círculo e Áreas",
  strand: "GE",
  faixa: "F4",
  prereqs: ["GM.08", "GE.06"],
  howto: "Transforme a figura numa forma de área conhecida e acompanhe o que permaneceu igual.",
  explain: "A fórmula nasce da transformação: dois triângulos formam um retângulo; o paralelogramo pode virar retângulo sem mudar a área; setores do círculo podem ser rearranjados.",
  distratores: [
    { regra: "usa base × altura como se o triângulo fosse o retângulo inteiro", tag: CirculoAreasMisconception.ESQUECE_DIVIDIR_POR_2 },
    { regra: "usa o lado inclinado no lugar da altura perpendicular", tag: CirculoAreasMisconception.ALTURA_ERRADA },
    { regra: "troca raio e diâmetro ou trata a circunferência como medida interna", tag: CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO },
  ],
  niveis: {
    1: { primitiva: "shapecanvas", micro: "triangulo-montagem", andaime: "alto" },
    2: { primitiva: "shapecanvas", micro: "formula-triangulo", andaime: "medio" },
    3: { primitiva: "shapecanvas", micro: "paralelogramo-corte", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "circulo-medidas", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "area-circulo", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "triangulo-montagem", fonte: "F91", alvo: "derivar a área do triângulo montando dois triângulos iguais em um retângulo e reconhecendo a metade", kinds: ["shapecanvas"], params: { modo: "triangulo-montagem", tutorial }, dominio },
    { id: "formula-triangulo", fonte: "F91", alvo: "reconstruir base × altura ÷ 2 a partir da montagem anterior, sem decorar a fórmula", kinds: ["shapecanvas"], params: { modo: "formula-triangulo", tutorial }, dominio },
    { id: "paralelogramo-corte", fonte: "F91", alvo: "conservar a área ao cortar a ponta do paralelogramo e encaixá-la do outro lado para formar retângulo", kinds: ["shapecanvas"], params: { modo: "paralelogramo-corte", tutorial }, dominio },
    { id: "circulo-medidas", fonte: "F91", alvo: "distinguir raio, diâmetro e circunferência e relacionar diâmetro a dois raios", kinds: ["shapecanvas"], params: { modo: "circulo-medidas" }, dominio },
    { id: "area-circulo", fonte: "F91", alvo: "aproximar a área do círculo rearranjando setores e reconstruir πr²", kinds: ["shapecanvas"], params: { modo: "area-circulo" }, dominio },
  ],
  erros_tipicos: [
    { id: CirculoAreasMisconception.ESQUECE_DIVIDIR_POR_2, descricao: "Calculou base × altura para o triângulo e esqueceu que ele é metade do retângulo formado por duas cópias." },
    { id: CirculoAreasMisconception.ALTURA_ERRADA, descricao: "Usou um lado inclinado como altura em vez do segmento perpendicular à base." },
    { id: CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO, descricao: "Trocou raio e diâmetro ou não reconheceu a circunferência como a volta do círculo." },
  ],
};
