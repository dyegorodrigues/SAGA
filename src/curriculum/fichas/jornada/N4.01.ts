import { EqualGroupsMisconception } from "../../procedimentos/equalGroupsSemantics";
import type { FichaCompetencia } from "../../schema";

const dominio = { acertos: 3, de: 3, sessoes: 2 } as const;

export const N4_01: FichaCompetencia = {
  id: "N4.01",
  nome: "Grupos iguais",
  strand: "N4",
  faixa: "F2",
  prereqs: ["N3.03", "AL.03"],
  niveis: {
    1: { primitiva: "grandeza", micro: "g3x3", andaime: "alto" },
    2: { primitiva: "grandeza", micro: "g5x3", andaime: "medio" },
    3: { primitiva: "grandeza", micro: "ponte5x5", andaime: "minimo" },
    4: { primitiva: "grandeza", micro: "m10x5", andaime: "nenhum" },
    5: { primitiva: "grandeza", micro: "m10x10", andaime: "nenhum", rt_alvo: 8000 },
  },
  howto: "Leia quantos grupos existem e quantos itens há em cada grupo; depois encontre o total.",
  explain: "Multiplicação representa grupos iguais: quantidade de grupos vezes itens por grupo.",
  distratores: [
    { regra: "soma os fatores", tag: EqualGroupsMisconception.SOMA_OS_FATORES },
    { regra: "conta um grupo", tag: EqualGroupsMisconception.CONTA_UM_GRUPO },
    { regra: "perde um grupo", tag: EqualGroupsMisconception.PERDEU_UM_GRUPO },
  ],
  micros: [
    { id: "g3x3", alvo: "Soma repetida até 3 × 3", kinds: ["grandeza"], params: { tutorial: [
      { say: "Veja grupos separados com a mesma quantidade.", show: { foco: "grupos" }, sync: "junto" },
      { say: "Leia: N grupos de M.", show: { foco: "frase" }, sync: "junto" },
      { say: "Junte as quantidades de cada grupo.", show: { foco: "soma" }, sync: "junto" },
    ] }, dominio },
    { id: "g5x3", alvo: "Soma repetida até 5 × 3", kinds: ["grandeza"], params: {}, dominio },
    { id: "ponte5x5", alvo: "Ponte soma e multiplicação até 5 × 5", kinds: ["grandeza"], params: {}, dominio },
    { id: "m10x5", alvo: "Multiplicação até 10 × 5", kinds: ["grandeza"], params: {}, dominio },
    { id: "m10x10", alvo: "Multiplicação até 10 × 10", kinds: ["grandeza"], params: {}, dominio },
  ],
  erros_tipicos: [
    { id: EqualGroupsMisconception.SOMA_OS_FATORES, descricao: "Soma os dois números em vez de multiplicar." },
    { id: EqualGroupsMisconception.CONTA_UM_GRUPO, descricao: "Conta somente os itens de um grupo." },
    { id: EqualGroupsMisconception.PERDEU_UM_GRUPO, descricao: "Deixa um grupo inteiro fora da contagem." },
  ],
};
