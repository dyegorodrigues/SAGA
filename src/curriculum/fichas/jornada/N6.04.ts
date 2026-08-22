import type { FichaCompetencia, FichaDominio } from "../../schema";
import {
  RAZAO_PROPORCAO_ESCALA_NAO_INTEIRA_EVIDENCIA,
  RazaoProporcaoMisconception,
} from "../../../constants/razaoProporcaoMisconceptions";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const dominioEscalaNaoInteira: FichaDominio = {
  ...dominio,
  exige: {
    evidencia: RAZAO_PROPORCAO_ESCALA_NAO_INTEIRA_EVIDENCIA,
    descricao: "um acerto preservando a razão com fator de escala não inteiro",
  },
};
const tutorial = [
  { fala: "Estas duas barras formam um par: cada uma representa uma quantidade.", show: { barrasVinculadas: true } },
  { fala: "Quando a relação é proporcional, o mesmo fator de escala age nas duas barras.", show: { mesmoFator: true } },
];

/** F88 — Razão e Proporção: duas quantidades crescem juntas pelo mesmo fator. */
export const N6_04: FichaCompetencia = {
  id: "N6.04",
  nome: "Razão e Proporção",
  strand: "N6",
  faixa: "F4",
  prereqs: ["N6.03", "N4.06"],
  dominioNumerico: "racionais",
  howto: "Descubra o fator que muda uma quantidade e use exatamente o mesmo fator na outra.",
  explain: "Uma proporção preserva a relação: se uma barra dobra, triplica ou cresce por outro fator, a barra parceira cresce pelo mesmo fator.",
  distratores: [
    { regra: "soma a variação em vez de multiplicar as duas quantidades pelo fator", tag: RazaoProporcaoMisconception.SOMA_EM_VEZ_DE_ESCALAR },
    { regra: "aplica o fator de escala a apenas uma das quantidades", tag: RazaoProporcaoMisconception.ESCALA_UM_LADO },
    { regra: "troca a ordem das quantidades e inverte a razão", tag: RazaoProporcaoMisconception.INVERTE_RAZAO },
  ],
  niveis: {
    1: { primitiva: "storypanel", micro: "dobrar", andaime: "alto" },
    2: { primitiva: "storypanel", micro: "triplicar", andaime: "medio" },
    3: { primitiva: "storypanel", micro: "escala-geral", andaime: "medio" },
    4: { primitiva: "storypanel", micro: "razao-fracao", andaime: "minimo" },
    5: { primitiva: "storypanel", micro: "regra-de-tres", andaime: "nenhum", rt_alvo: 20000 },
  },
  micros: [
    { id: "dobrar", fonte: "F88", alvo: "dobrar simultaneamente as duas quantidades de uma relação", kinds: ["storypanel"], params: { modo: "dobrar", suporte: "SingaporeBars", tutorial }, dominio },
    { id: "triplicar", fonte: "F88", alvo: "triplicar simultaneamente as duas quantidades de uma relação", kinds: ["storypanel"], params: { modo: "triplicar", suporte: "SingaporeBars", tutorial }, dominio },
    { id: "escala-geral", fonte: "F88", alvo: "preservar a relação com um fator de escala qualquer, inclusive não inteiro", kinds: ["storypanel"], params: { modo: "escala-geral", suporte: "SingaporeBars", tutorial }, dominio: dominioEscalaNaoInteira },
    { id: "razao-fracao", fonte: "F88", alvo: "ler a razão entre duas quantidades como fração mantendo a ordem", kinds: ["storypanel"], params: { modo: "razao-fracao", suporte: "SingaporeBars" }, dominio },
    { id: "regra-de-tres", fonte: "F88", alvo: "resolver uma quantidade desconhecida encontrando e aplicando o mesmo fator, sem decoreba de multiplicação cruzada", kinds: ["storypanel"], params: { modo: "regra-de-tres", suporte: "SingaporeBars" }, dominio },
  ],
  erros_tipicos: [
    { id: RazaoProporcaoMisconception.SOMA_EM_VEZ_DE_ESCALAR, descricao: "Somou uma diferença fixa em vez de multiplicar as duas quantidades pelo mesmo fator." },
    { id: RazaoProporcaoMisconception.ESCALA_UM_LADO, descricao: "Escalou somente uma barra e quebrou a relação proporcional." },
    { id: RazaoProporcaoMisconception.INVERTE_RAZAO, descricao: "Trocou primeira/segunda quantidade e inverteu a razão." },
  ],
};
