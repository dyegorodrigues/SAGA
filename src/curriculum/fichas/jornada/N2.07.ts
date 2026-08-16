import type { FichaCompetencia, FichaDominio } from "../../schema";
import { FatoresRetangulosMisconception } from "../../procedimentos/fatoresRetangulosProcedure";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { say: "Use as mesmas peças para montar retângulos completos.", show: { foco: "ArrayGrid" }, sync: "junto" },
  { say: "Se sobrar peça, aquela medida não é fator.", show: { foco: "sobra" }, sync: "junto" },
  { say: "Continue até encontrar todas as formações, incluindo 1 × n.", show: { foco: "pares" }, sync: "junto" },
];

/** F66 — Fatores como todas as formas retangulares completas de um mesmo total. */
export const N2_07: FichaCompetencia = {
  id: "N2.07",
  nome: "A Fábrica de Retângulos",
  strand: "N2",
  faixa: "F2",
  prereqs: ["N4.02", "N2.06"],
  howto: "Monte retângulos completos com o mesmo total e registre cada par sem repetir a rotação.",
  explain: "Fator é uma medida que divide o total sem sobra. Os pares de fatores são as diferentes formas retangulares completas desse total.",
  distratores: [
    { regra: "esquece os fatores triviais 1 e n", tag: FatoresRetangulosMisconception.ESQUECE_TRIVIAIS },
    { regra: "para depois de encontrar a primeira formação", tag: FatoresRetangulosMisconception.PARA_CEDO },
    { regra: "aceita uma medida que deixa sobra ou confunde fator com múltiplo", tag: FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO },
  ],
  niveis: {
    1: { primitiva: "arraygrid", micro: "pares-com-dica", andaime: "alto" },
    2: { primitiva: "arraygrid", micro: "todos-pares", andaime: "medio" },
    3: { primitiva: "arraygrid", micro: "listar-fatores", andaime: "minimo" },
    4: { primitiva: "arraygrid", micro: "identificar-primo", andaime: "minimo" },
    5: { primitiva: "arraygrid", micro: "maior-fator-comum", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "pares-com-dica", fonte: "F66", alvo: "encontrar pares de fatores até 12 com dica da quantidade de formações", kinds: ["arraygrid"], params: { modo: "pares-com-dica", tutorial }, dominio },
    { id: "todos-pares", fonte: "F66", alvo: "encontrar todos os pares de fatores até aproximadamente 24 sem parar no primeiro retângulo", kinds: ["arraygrid"], params: { modo: "todos-pares", tutorial }, dominio },
    { id: "listar-fatores", fonte: "F66", alvo: "listar todos os fatores e rejeitar divisores que deixam resto", kinds: ["arraygrid"], params: { modo: "listar-fatores" }, dominio },
    { id: "identificar-primo", fonte: "F66", alvo: "reconhecer visualmente número primo pelo único par trivial 1 × n", kinds: ["arraygrid"], params: { modo: "identificar-primo" }, dominio },
    { id: "maior-fator-comum", fonte: "F66", alvo: "comparar conjuntos de fatores e identificar o maior fator comum", kinds: ["arraygrid"], params: { modo: "maior-fator-comum" }, dominio },
  ],
  erros_tipicos: [
    { id: FatoresRetangulosMisconception.ESQUECE_TRIVIAIS, descricao: "Omitiu 1 e o próprio número da lista de fatores." },
    { id: FatoresRetangulosMisconception.PARA_CEDO, descricao: "Encontrou uma formação e parou antes de esgotar os pares." },
    { id: FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO, descricao: "Aceitou como fator uma medida que deixa sobra ou respondeu com múltiplo." },
  ],
};
