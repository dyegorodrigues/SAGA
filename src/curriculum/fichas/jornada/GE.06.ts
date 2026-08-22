import { FichaCompetencia, FichaDominio } from "../../schema";
import { AngulosMisconception } from "../../procedimentos/angulosContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Ângulo é o quanto abriu.", show: { girarRaio: true } },
  { fala: "O tamanho dos lados não muda a abertura.", show: { esticarLado: true } },
];

/** F78 — Ângulos: abertura e giro, não comprimento dos lados. */
export const GE_06: FichaCompetencia = {
  id: "GE.06",
  nome: "Ângulos",
  strand: "GE",
  faixa: "F3",
  prereqs: ["GE.03"],
  howto: "Ângulo é o quanto abriu, não o tamanho dos lados.",
  explain: "Olhe só a abertura entre as duas linhas, perto do vértice.",
  distratores: [
    { regra: "julga a abertura pelo comprimento dos lados", tag: AngulosMisconception.ANGULO_PELO_LADO },
    { regra: "troca ângulo agudo por obtuso", tag: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
    { regra: "lê a escala oposta do transferidor", tag: AngulosMisconception.TRANSFERIDOR_INVERTIDO },
  ],
  niveis: {
    1: { primitiva: "shapecanvas", micro: "classificar", andaime: "alto" },
    2: { primitiva: "shapecanvas", micro: "comparar", andaime: "medio" },
    3: { primitiva: "shapecanvas", micro: "lados-diferentes", andaime: "minimo" },
    4: { primitiva: "shapecanvas", micro: "medir-graus", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "poligonos", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "classificar", fonte: "F78", alvo: "classificar ângulos retos, agudos e obtusos pela abertura", kinds: ["shapecanvas"], params: { modo: "angulo", tutorial }, dominio },
    { id: "comparar", fonte: "F78", alvo: "comparar duas aberturas", kinds: ["shapecanvas"], params: { modo: "angulo", tutorial }, dominio },
    { id: "lados-diferentes", fonte: "F78", alvo: "ignorar o comprimento dos lados ao comparar ângulos", kinds: ["shapecanvas"], params: { modo: "angulo" }, dominio },
    { id: "medir-graus", fonte: "F78", alvo: "medir a abertura em graus", kinds: ["shapecanvas"], params: { modo: "angulo" }, dominio },
    { id: "poligonos", fonte: "F78", alvo: "reconhecer e medir ângulos em polígonos", kinds: ["shapecanvas"], params: { modo: "angulo" }, dominio },
  ],
  erros_tipicos: [
    { id: AngulosMisconception.ANGULO_PELO_LADO, descricao: "Acha que lados mais compridos fazem um ângulo maior." },
    { id: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO, descricao: "Confunde aberturas menores e maiores que 90 graus." },
    { id: AngulosMisconception.TRANSFERIDOR_INVERTIDO, descricao: "Lê a escala invertida ao medir." },
  ],
};
