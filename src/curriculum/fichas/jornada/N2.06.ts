import { FichaCompetencia } from "../../schema";
import { ParesImparesMisconception } from "../../procedimentos/paresImparesContract";

const dominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Forme uma dupla colocando dois objetos juntos.", show: { formarDupla: true } },
  { fala: "Continue de dois em dois até não dar mais.", show: { completarDuplas: true } },
  { fala: "Se ninguém sobrar, é par. Se sobrar um, é ímpar.", show: { observarSobra: true } },
];

/** F38 — Pares e Ímpares: a regra nasce das duplas, não da memorização. */
export const N2_06: FichaCompetencia = {
  id: "N2.06",
  nome: "Pares e Ímpares",
  strand: "N2",
  faixa: "F2",
  prereqs: ["N2.03"],
  howto: "Organize em duplas e observe se sobra alguém.",
  explain: "Par é o número que forma duplas sem sobrar ninguém; ímpar deixa exatamente um sem dupla.",
  distratores: [],
  niveis: {
    1: { primitiva: "draggroup", micro: "duplas-10", andaime: "mao_fantasma" },
    2: { primitiva: "draggroup", micro: "duplas-20", andaime: "alto" },
    3: { primitiva: "draggroup", micro: "decidir-visual", andaime: "medio" },
    4: { primitiva: "draggroup", micro: "ultimo-algarismo", andaime: "minimo" },
    5: { primitiva: "draggroup", micro: "paridade-somas", andaime: "nenhum", rt_alvo: 12000 },
  },
  micros: [
    { id: "duplas-10", fonte: "F38", alvo: "formar duplas até 10 e decidir pela sobra", kinds: ["draggroup"], params: { modo: "duplas", tutorial }, dominio },
    { id: "duplas-20", fonte: "F38", alvo: "formar duplas até 20 e decidir pela sobra", kinds: ["draggroup"], params: { modo: "duplas" }, dominio },
    { id: "decidir-visual", fonte: "F38", alvo: "reconhecer paridade visualmente sem precisar executar todo o pareamento", kinds: ["draggroup"], params: { modo: "duplas" }, dominio },
    { id: "ultimo-algarismo", fonte: "F38", alvo: "usar a regra do último algarismo explicando-a pela estrutura de duplas", kinds: ["draggroup"], params: { modo: "duplas" }, dominio },
    { id: "paridade-somas", fonte: "F38", alvo: "prever a paridade de somas a partir da paridade das parcelas", kinds: ["draggroup"], params: { modo: "duplas" }, dominio },
  ],
  erros_tipicos: [
    { id: ParesImparesMisconception.CONFUNDE_TAMANHO, descricao: "Decide pela aparência ou pelo tamanho do conjunto, não pela formação de duplas." },
    { id: ParesImparesMisconception.ZERO_IMPAR, descricao: "Diz que zero é ímpar por achar que ele não tem uma dupla." },
    { id: ParesImparesMisconception.DECORA_SEM_ENTENDER, descricao: "Recita a regra do último algarismo sem conseguir justificá-la com duplas." },
  ],
};
