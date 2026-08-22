import { Evidencia } from "../../../constants/evidencias";
import { FichaCompetencia, FichaDominio } from "../../schema";
import { PartesIguaisMisconception } from "../../procedimentos/partesIguaisContract";

const dominio: FichaDominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  exige: {
    evidencia: Evidencia.PARTES_IGUAIS_DIVISAO,
    descricao: "Produzir ao menos uma divisão em partes realmente iguais no nível 4.",
  },
};

const tutorial = [
  { fala: "Olhe o tamanho, não só a quantidade de pedaços.", show: { compararTamanhos: true } },
  { fala: "Se uma parte é maior que a outra, ainda não é metade, terço ou quarto.", show: { sobrepor: true } },
];

/** F45 — Metade, Terço e Quarto: a fração nasce da igualdade das partes. */
export const N5_01: FichaCompetencia = {
  id: "N5.01",
  nome: "Metade, Terço e Quarto",
  strand: "N5",
  faixa: "F2",
  prereqs: ["N4.05"],
  howto: "Primeiro confira se todas as partes têm o mesmo tamanho. Só depois conte e dê o nome da fração.",
  explain: "Metade, terço e quarto só existem quando o inteiro foi dividido em partes iguais. Mais pedaços não significa uma parte maior.",
  distratores: [
    { regra: "aceita partição desigual só porque há o número certo de pedaços", tag: PartesIguaisMisconception.IGNORA_IGUALDADE },
    { regra: "conta partes sem comparar o tamanho", tag: PartesIguaisMisconception.CONTA_PARTES },
    { regra: "interpreta denominador maior como parte maior", tag: PartesIguaisMisconception.MAIS_PARTES_MAIS_TUDO },
  ],
  niveis: {
    1: { primitiva: "shapecanvas", micro: "reconhecer-iguais", andaime: "alto" },
    2: { primitiva: "shapecanvas", micro: "sobrepor-partes", andaime: "medio" },
    3: { primitiva: "shapecanvas", micro: "nomear-parte", andaime: "minimo" },
    4: { primitiva: "shapecanvas", micro: "produzir-divisao", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "simbolo-fracao", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "reconhecer-iguais", fonte: "F45", alvo: "distinguir partições iguais de partições apenas numerosas", kinds: ["shapecanvas"], params: { suporte: "circulo", tutorial }, dominio },
    { id: "sobrepor-partes", fonte: "F45", alvo: "usar sobreposição como prova visual de que duas partes têm o mesmo tamanho", kinds: ["shapecanvas"], params: { suporte: "circulo", tutorial }, dominio },
    { id: "nomear-parte", fonte: "F45", alvo: "nomear metade, terço ou quarto depois de verificar partes iguais", kinds: ["shapecanvas"], params: { suporte: "barra" }, dominio },
    { id: "produzir-divisao", fonte: "F45", alvo: "produzir uma partição equipartida com controle deslizante ou toque equivalente", kinds: ["shapecanvas"], params: { suporte: "barra", toqueAlternativo: true }, dominio },
    { id: "simbolo-fracao", fonte: "F45", alvo: "associar uma parte igual aos símbolos 1/2, 1/3 e 1/4", kinds: ["shapecanvas"], params: { suporte: "barra" }, dominio },
  ],
  erros_tipicos: [
    { id: PartesIguaisMisconception.IGNORA_IGUALDADE, descricao: "Aceita pedaços desiguais como fração unitária." },
    { id: PartesIguaisMisconception.CONTA_PARTES, descricao: "Conta quantos pedaços há sem comparar seus tamanhos." },
    { id: PartesIguaisMisconception.MAIS_PARTES_MAIS_TUDO, descricao: "Acha que denominador maior produz uma parte maior." },
  ],
};
