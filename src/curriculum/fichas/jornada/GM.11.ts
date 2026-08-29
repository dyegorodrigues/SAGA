import type { FichaCompetencia, FichaDominio } from "../../schema";
import { Evidencia } from "../../../constants/evidencias";
import { VolumePrismasMisconception } from "../../../constants/volumePrismasMisconceptions";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const dominioDimensaoFaltante: FichaDominio = {
  ...dominio,
  exige: {
    evidencia: Evidencia.DIMENSAO_FALTANTE_F94,
    descricao: "resolver corretamente ao menos um prisma com dimensão faltante a partir do volume e da área da base",
  },
};
const acessibilidade = { toqueAlternativo: true, semArrastoObrigatorio: true, alvoMinPx: 80, erroMotorNaoTag: true };
const tutorial = [
  { say: "Preencha primeiro uma camada inteira. Ela mostra quantos cubos cabem na base.", show: { alfabetizarModo: "arraygrid-3d", destacar: "camada-base" }, sync: "junto" },
  { say: "Agora repita essa camada para cima. Cada nova camada tem a mesma quantidade de cubos.", show: { destacar: "camadas", repetirCamada: true }, sync: "junto" },
  { say: "Por isso, o volume é a área da base vezes a altura: quantidade em uma camada vezes número de camadas.", show: { destacar: "base-vezes-altura", formula: "V = área da base × altura" }, sync: "depois" },
];

/** F94 — volume como composição de camadas: área da base × altura. */
export const GM_11: FichaCompetencia = {
  id: "GM.11",
  nome: "Volume de Prismas",
  strand: "GM",
  faixa: "F4",
  prereqs: ["GM.09", "N4.02"],
  howto: "Encha uma camada e multiplique pelo número de camadas.",
  explain: "Volume é a área da base vezes a altura: cubos em cada camada × número de camadas.",
  distratores: [
    { regra: "soma comprimento, largura e altura em vez de compor camadas", tag: VolumePrismasMisconception.SOMA_DIMENSOES },
    { regra: "para na quantidade de cubos de uma camada e confunde área da base com volume", tag: VolumePrismasMisconception.CONFUNDE_COM_AREA },
    { regra: "encontra a quantidade, mas registra área ou unidade linear em vez de unidade cúbica", tag: VolumePrismasMisconception.IGNORA_UNIDADE_CUBICA },
  ],
  niveis: {
    1: { primitiva: "arraygrid", micro: "contar-cubos", andaime: "alto", acaoProbatoria: { id: "construir", porque: "O volume é a contagem dos cubinhos que cabem. Responder sem encher o prisma é ler o número em outro lugar que não a construção." } },
    2: { primitiva: "arraygrid", micro: "camada-multiplicar", andaime: "alto", acaoProbatoria: { id: "construir", porque: "A camada repetida pela altura é o argumento inteiro do nível: construir as camadas é ver a multiplicação acontecer." } },
    3: { primitiva: "arraygrid", micro: "formula", andaime: "medio", acaoProbatoria: { id: "construir", porque: "A fórmula só é fórmula depois de a construção mostrar o que ela resume." } },
    4: { primitiva: "arraygrid", micro: "dimensao-faltante", andaime: "minimo" },
    5: { primitiva: "arraygrid", micro: "prisma-nao-retangular", andaime: "nenhum", rt_alvo: 22000, acaoProbatoria: { id: "construir", porque: "No prisma não retangular a fórmula base×altura não é óbvia — construir camada por camada é o que prova que ela continua valendo." } },
  },
  micros: [
    { id: "contar-cubos", fonte: "F94", alvo: "construir volume preenchendo e contando cubos unitários em camadas", kinds: ["arraygrid"], params: { modo: "contar-cubos", visualizacao: "3D", tutorial, acessibilidade }, dominio },
    { id: "camada-multiplicar", fonte: "F94", alvo: "contar os cubos de uma camada e multiplicar pelo número de camadas idênticas", kinds: ["arraygrid"], params: { modo: "camada-multiplicar", visualizacao: "3D", tutorial, acessibilidade }, dominio },
    { id: "formula", fonte: "F94", alvo: "generalizar volume de prisma como área da base multiplicada pela altura", kinds: ["arraygrid"], params: { modo: "formula", visualizacao: "3D", tutorial, acessibilidade }, dominio },
    { id: "dimensao-faltante", fonte: "F94", alvo: "encontrar uma dimensão faltante usando volume e área da base", kinds: ["arraygrid"], params: { modo: "dimensao-faltante", visualizacao: "3D", tutorial, acessibilidade }, dominio: dominioDimensaoFaltante },
    { id: "prisma-nao-retangular", fonte: "F94", alvo: "aplicar a ideia de camadas idênticas a prismas cuja base não é retangular", kinds: ["arraygrid"], params: { modo: "prisma-nao-retangular", visualizacao: "3D", tutorial, acessibilidade }, dominio },
  ],
  erros_tipicos: [
    { id: VolumePrismasMisconception.SOMA_DIMENSOES, descricao: "Somou as dimensões do prisma, sem relacionar uma camada inteira às demais." },
    { id: VolumePrismasMisconception.CONFUNDE_COM_AREA, descricao: "Contou apenas a base e respondeu a área de uma camada como se fosse o volume." },
    { id: VolumePrismasMisconception.IGNORA_UNIDADE_CUBICA, descricao: "Usou unidade linear ou quadrada, sem reconhecer que volume conta cubos unitários." },
  ],
};
