import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/** F50 — massa e capacidade: comparar/conservar antes de qualquer unidade. */
/**
 * A F50 estreia DUAS referências físicas. O tutorial acontece apenas no
 * primeiro degrau de cada linguagem: balança no L1 e despejo no L2. Depois a
 * criança precisa usar a referência sem a aula repetir a resposta.
 */
const tutorialPeso = [
  { fala: "Vamos pesar. A balança mostra o que os olhos não mostram." },
  { fala: "Veja qual lado desce. Esse lado está mais pesado.", show: { destacarCerto: true } },
];

const tutorialCapacidade = [
  { fala: "Os recipientes estão cheios. Queremos descobrir em qual cabe mais." },
  { fala: "Despeje em recipientes iguais. Agora dá para comparar sem o formato enganar.", show: { verificar: true } },
];

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
    {
      id: "peso_obvio", fonte: "F50",
      alvo: "ler qual prato desce numa diferença óbvia", kinds: ["medidas"],
      params: {
        howto: "Olhe a balança. O lado que desce é o mais pesado.",
        explain: "O tamanho pode enganar. Compare pelo que a balança faz.",
        tutorial: tutorialPeso,
      },
      dominio,
    },
    {
      id: "capacidade_mesmo_formato", fonte: "F50",
      alvo: "comparar capacidade sem a variável formato", kinds: ["medidas"],
      params: {
        howto: "Os dois estão cheios. Em qual recipiente cabe mais?",
        explain: "Despeje em recipientes iguais e compare as quantidades.",
        tutorial: tutorialCapacidade,
      },
      dominio,
    },
    {
      id: "capacidade_formatos", fonte: "F50",
      alvo: "conservar capacidade quando a altura do recipiente engana", kinds: ["medidas"],
      params: {
        howto: "Os dois estão cheios. Não decida só pela altura do recipiente.",
        explain: "O formato engana. Despeje em recipientes iguais para comparar o que cada um comporta.",
      },
      dominio,
    },
    {
      id: "peso_contraintuitivo", fonte: "F50",
      alvo: "aceitar que o menor pode ser mais pesado", kinds: ["medidas"],
      params: {
        howto: "Não escolha pelo tamanho. Veja qual lado da balança desce.",
        explain: "Um objeto pequeno pode pesar mais. A balança é a referência.",
      },
      dominio,
    },
    {
      id: "seriacao", fonte: "F50",
      alvo: "ordenar três por peso ou capacidade usando referência comum", kinds: ["medidas"],
      params: {}, dominio,
    },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.JULGA_PELO_TAMANHO, descricao: "Escolhe pelo tamanho aparente mesmo quando a referência contradiz." },
    { id: MisconceptionTag.CONFUNDE_PESO_VOLUME, descricao: "Usa volume aparente como se fosse peso." },
    { id: MisconceptionTag.IGNORA_FORMATO, descricao: "Compara altura do líquido sem neutralizar o formato do recipiente." },
  ],
};
