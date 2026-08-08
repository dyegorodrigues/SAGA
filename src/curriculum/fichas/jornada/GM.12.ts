import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/** F50 — massa e capacidade: comparar/conservar antes de qualquer unidade. */
const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  exige: {
    evidencia: Evidencia.CASO_CONTRAINTUITIVO,
    descricao: "Acertar um caso em que a aparência aponta para a resposta errada.",
  },
};

export const GM_12: FichaCompetencia = {
  id: "GM.12",
  nome: "Cabe mais ou menos? (massa e capacidade)",
  strand: "GM",
  faixa: "F0",
  prereqs: ["GM.01"],
  bncc: "EI03ET01",
  howto: "Use a referência da tela. O tamanho sozinho pode enganar.",
  explain: "Para comparar de verdade, use a balança ou despeje no mesmo recipiente.",
  distratores: [],
  niveis: {
    1: { primitiva: "medidas", micro: "peso_obvio", andaime: "mao_fantasma" },
    2: { primitiva: "medidas", micro: "capacidade_mesmo_formato", andaime: "alto" },
    3: { primitiva: "medidas", micro: "capacidade_formatos", andaime: "medio" },
    4: { primitiva: "medidas", micro: "peso_contraintuitivo", andaime: "minimo" },
    5: { primitiva: "medidas", micro: "seriacao", andaime: "nenhum", rt_alvo: 15000 },
  },
  micros: [
    { id: "peso_obvio", fonte: "F50", alvo: "ler qual prato desce numa diferença óbvia", kinds: ["medidas"], params: {}, dominio },
    { id: "capacidade_mesmo_formato", fonte: "F50", alvo: "comparar capacidade sem a variável formato", kinds: ["medidas"], params: {}, dominio },
    { id: "capacidade_formatos", fonte: "F50", alvo: "conservar capacidade quando a altura do líquido engana", kinds: ["medidas"], params: {}, dominio },
    { id: "peso_contraintuitivo", fonte: "F50", alvo: "aceitar que o menor pode ser mais pesado", kinds: ["medidas"], params: {}, dominio },
    { id: "seriacao", fonte: "F50", alvo: "ordenar três por peso ou capacidade usando referência comum", kinds: ["medidas"], params: {}, dominio },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.JULGA_PELO_TAMANHO, descricao: "Escolhe pelo tamanho aparente mesmo quando a referência contradiz." },
    { id: MisconceptionTag.CONFUNDE_PESO_VOLUME, descricao: "Usa volume aparente como se fosse peso." },
    { id: MisconceptionTag.IGNORA_FORMATO, descricao: "Compara altura do líquido sem neutralizar o formato do recipiente." },
  ],
};
