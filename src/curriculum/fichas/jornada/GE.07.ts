import type { FichaCompetencia, FichaDominio } from "../../schema";
import { PoligonosMisconception } from "../../procedimentos/poligonosContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Conte os lados e depois olhe os ângulos. A posição da figura não muda suas propriedades.", show: { contarLados: true, destacarAngulos: true } },
  { fala: "Uma forma pode pertencer a mais de um grupo. Os laços dentro de laços mostram essa hierarquia.", show: { mostrarLacos: true } },
];

/** F79 — Polígonos: triângulos e quadriláteros. */
export const GE_07: FichaCompetencia = {
  id: "GE.07",
  nome: "Polígonos: triângulos e quadriláteros",
  strand: "GE",
  faixa: "F3",
  prereqs: ["GE.03", "GE.06"],
  howto: "Conte os lados e olhe os ângulos. Uma forma pode pertencer a mais de um grupo.",
  explain: "O quadrado tem quatro ângulos retos, então também é retângulo; e todo retângulo também é paralelogramo.",
  distratores: [
    { regra: "trata quadrado, retângulo e paralelogramo como categorias exclusivas", tag: PoligonosMisconception.CATEGORIAS_EXCLUSIVAS },
    { regra: "usa apenas um critério quando a classificação exige combinar propriedades", tag: PoligonosMisconception.SO_UM_CRITERIO },
    { regra: "acha que girar a figura muda sua classe geométrica", tag: PoligonosMisconception.ORIENTACAO_FIXA },
  ],
  niveis: {
    1: { primitiva: "shapecanvas", micro: "triangulos-lados", andaime: "alto", acaoProbatoria: { id: "conferir", porque: "A classe do polígono é a propriedade conferida, não a aparência do desenho. Nomear antes de conferir cada figura contra cada critério é ler a figura pela posição — exatamente o erro que o nível combate." } },
    2: { primitiva: "shapecanvas", micro: "triangulos-angulos", andaime: "medio", acaoProbatoria: { id: "conferir", porque: "Idem para os ângulos: o acutângulo se reconhece conferindo os três, não pelo desenho parecer pontudo." } },
    3: { primitiva: "draggroup", micro: "quadrilateros", andaime: "medio", acaoProbatoria: { id: "conferir", porque: "Quadriláteros só se distinguem pelas propriedades conferidas — lados iguais, pares paralelos. A olho, losango e paralelogramo se confundem." } },
    4: { primitiva: "draggroup", micro: "hierarquia", andaime: "minimo", acaoProbatoria: { id: "conferir", porque: "A hierarquia (quadrado ⊂ retângulo ⊂ paralelogramo) exige conferir que a figura satisfaz TODOS os critérios da classe maior, não só os da menor." } },
    5: { primitiva: "draggroup", micro: "propriedades-combinadas", andaime: "nenhum", rt_alvo: 18000, acaoProbatoria: { id: "conferir", porque: "Combinar propriedades é conferir mais de um critério na mesma figura; responder sem conferir devolve a resposta à aparência." } },
  },
  micros: [
    { id: "triangulos-lados", fonte: "F79", alvo: "classificar triângulos pelo número de lados iguais, independentemente da orientação", kinds: ["shapecanvas", "draggroup"], params: { modo: "triangulos-lados", tutorial }, dominio: { ...dominio } },
    { id: "triangulos-angulos", fonte: "F79", alvo: "classificar triângulos pelos ângulos sem confundir tamanho dos lados com abertura", kinds: ["shapecanvas", "draggroup"], params: { modo: "triangulos-angulos", tutorial }, dominio: { ...dominio } },
    { id: "quadrilateros", fonte: "F79", alvo: "classificar quadriláteros por lados, ângulos e paralelismo", kinds: ["shapecanvas", "draggroup"], params: { modo: "quadrilateros", tutorial }, dominio: { ...dominio } },
    { id: "hierarquia", fonte: "F79", alvo: "reconhecer a inclusão quadrado ⊂ retângulo ⊂ paralelogramo usando laços aninhados", kinds: ["shapecanvas", "draggroup"], params: { modo: "hierarquia", tutorial }, dominio: { ...dominio } },
    { id: "propriedades-combinadas", fonte: "F79", alvo: "classificar polígonos combinando ao menos duas propriedades simultâneas", kinds: ["shapecanvas", "draggroup"], params: { modo: "propriedades-combinadas", tutorial }, dominio: { ...dominio } },
  ],
  erros_tipicos: [
    { id: PoligonosMisconception.CATEGORIAS_EXCLUSIVAS, descricao: "Nega que uma figura possa pertencer simultaneamente a uma classe e às suas classes mais amplas." },
    { id: PoligonosMisconception.SO_UM_CRITERIO, descricao: "Classifica por apenas uma propriedade quando a tarefa exige combinar critérios." },
    { id: PoligonosMisconception.ORIENTACAO_FIXA, descricao: "Muda a classificação quando a mesma figura é girada." },
  ],
};
