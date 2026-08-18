import type { FichaCompetencia, FichaDominio } from "../../schema";
import {
  CONTAS_VIRGULA_CASAS_DIFERENTES_EVIDENCIA,
  ContasVirgulaMisconception,
} from "../../../constants/contasVirgulaMisconceptions";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const dominioCasasDiferentes: FichaDominio = {
  ...dominio,
  exige: {
    evidencia: CONTAS_VIRGULA_CASAS_DIFERENTES_EVIDENCIA,
    descricao: "um acerto alinhando corretamente números com quantidades diferentes de casas decimais",
  },
};

const tutorial = [
  { fala: "A vírgula é o eixo da conta: unidade fica com unidade, décimo com décimo.", show: { destacarVirgulas: true } },
  { fala: "Quando falta uma casa decimal, complete com zero sem mudar o valor.", show: { adicionarZero: true } },
];

/** F76 — Contas com Vírgula: operar decimais preservando valor posicional. */
export const N6_02: FichaCompetencia = {
  id: "N6.02",
  nome: "Contas com Vírgula",
  strand: "N6",
  faixa: "F3",
  prereqs: ["N6.01", "N3.11", "N3.12"],
  dominioNumerico: "racionais",
  howto: "Alinhe as vírgulas uma embaixo da outra. Complete com zeros se faltar casa.",
  explain: "Décimo soma com décimo e unidade com unidade. A vírgula marca onde cada ordem começa.",
  distratores: [
    { regra: "alinha os últimos algarismos em vez de alinhar as ordens pela vírgula", tag: ContasVirgulaMisconception.ALINHA_PELA_DIREITA },
    { regra: "ignora os zeros que tornam explícitas as casas decimais ausentes", tag: ContasVirgulaMisconception.IGNORA_ZEROS },
    { regra: "faz a aritmética mas perde a vírgula no resultado", tag: ContasVirgulaMisconception.VIRGULA_PERDIDA },
  ],
  niveis: {
    1: { primitiva: "vertical", micro: "mesmas-casas", andaime: "alto" },
    2: { primitiva: "vertical", micro: "casas-diferentes", andaime: "medio" },
    3: { primitiva: "vertical", micro: "subtracao", andaime: "medio" },
    4: { primitiva: "vertical", micro: "reagrupamento", andaime: "minimo" },
    5: { primitiva: "vertical", micro: "vezes-dez-cem", andaime: "nenhum" },
  },
  micros: [
    { id: "mesmas-casas", fonte: "F76", alvo: "somar decimais com a mesma quantidade de casas alinhando cada ordem", kinds: ["vertical", "quadrado100"], params: { modo: "mesmas-casas", tutorial }, dominio },
    { id: "casas-diferentes", fonte: "F76", alvo: "alinhar decimais com casas diferentes e completar as casas ausentes com zero", kinds: ["vertical", "quadrado100"], params: { modo: "casas-diferentes", tutorial }, dominio: dominioCasasDiferentes },
    { id: "subtracao", fonte: "F76", alvo: "subtrair decimais preservando o alinhamento de unidades, décimos e centésimos", kinds: ["vertical", "quadrado100"], params: { modo: "subtracao", tutorial }, dominio },
    { id: "reagrupamento", fonte: "F76", alvo: "reagrupar uma ordem decimal em dez unidades da ordem imediatamente menor", kinds: ["vertical", "quadrado100"], params: { modo: "reagrupamento" }, dominio },
    { id: "vezes-dez-cem", fonte: "F76", alvo: "multiplicar por dez ou cem interpretando a mudança de valor posicional dos algarismos", kinds: ["vertical", "quadrado100"], params: { modo: "vezes-dez-cem" }, dominio },
  ],
  erros_tipicos: [
    { id: ContasVirgulaMisconception.ALINHA_PELA_DIREITA, descricao: "Alinhou os últimos algarismos e colocou ordens diferentes na mesma coluna." },
    { id: ContasVirgulaMisconception.IGNORA_ZEROS, descricao: "Não completou a casa ausente com zero e perdeu a equivalência posicional." },
    { id: ContasVirgulaMisconception.VIRGULA_PERDIDA, descricao: "Calculou os algarismos, mas registrou o resultado sem a vírgula decimal." },
  ],
};
