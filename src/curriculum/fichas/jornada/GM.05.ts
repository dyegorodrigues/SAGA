import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

const dominio = { acertos: 3, de: 3, sessoes: 2 } as const;

export const GM_05: FichaCompetencia = {
  id: "GM.05",
  nome: "Medir com régua",
  strand: "GM",
  faixa: "F2",
  prereqs: ["GM.12", "N2.02"],
  bncc: "EF02MA16",

  howto: "Use unidades iguais. Na régua, alinhe o zero com a ponta do objeto e leia onde ele termina.",
  explain: "Medir é comparar com uma unidade padrão. A régua começa no zero, não no um.",
  distratores: [],

  niveis: {
    1: { primitiva: "regua", micro: "medida_informal", andaime: "mao_fantasma" },
    2: { primitiva: "regua", micro: "ler_regua_alinhada", andaime: "alto" },
    3: { primitiva: "regua", micro: "alinhar_zero", andaime: "medio" },
    4: { primitiva: "regua", micro: "medir_comparar", andaime: "minimo" },
    // 15s é observabilidade operacional silenciosa; nunca compra mastery/XP.
    5: { primitiva: "regua", micro: "estimar_conferir", andaime: "nenhum", rt_alvo: 15000 },
  },

  micros: [
    {
      id: "medida_informal",
      fonte: "F61",
      alvo: "entender medida como repetição de unidades iguais antes de introduzir a régua",
      kinds: ["regua"],
      params: {
        tutorial: [
          { fala: "Antes da régua, dá para medir repetindo unidades iguais.", show: { destacarClipes: true } },
          { fala: "Mas o clipe de cada pessoa pode ser diferente. Por isso existem unidades padrão.", show: { revelarRegua: true } },
        ],
      },
      dominio,
    },
    {
      id: "ler_regua_alinhada",
      fonte: "F61",
      alvo: "ler um comprimento em centímetros quando o zero já está alinhado",
      kinds: ["regua"],
      params: {
        tutorial: [
          { fala: "A régua começa no zero.", show: { destacarZero: true } },
          { fala: "Leia a marca onde o objeto termina.", show: { piscarMarcaFinal: true } },
        ],
      },
      dominio,
    },
    {
      id: "alinhar_zero",
      fonte: "F61",
      alvo: "alinhar fisicamente o zero da régua com a ponta do objeto e então medir",
      kinds: ["regua"],
      params: {
        tutorial: [
          { fala: "A régua está fora do lugar.", show: { mostrarDesalinhamento: true } },
          { fala: "Leve o zero até a ponta do objeto.", show: { alinharRegua: true } },
        ],
      },
      dominio: {
        ...dominio,
        exige: {
          evidencia: Evidencia.ALINHOU_ZERO,
          descricao: "alinhar o zero da régua com a ponta do objeto ao menos uma vez",
        },
      },
    },
    {
      id: "medir_comparar",
      fonte: "F61",
      alvo: "medir dois objetos com a mesma unidade e comparar os comprimentos",
      kinds: ["regua"],
      params: {},
      dominio,
    },
    {
      id: "estimar_conferir",
      fonte: "F61",
      alvo: "estimar o comprimento antes de medir e usar a régua para conferir a plausibilidade",
      kinds: ["regua"],
      params: {},
      dominio,
    },
  ],

  erros_tipicos: [
    {
      id: MisconceptionTag.COMECA_NO_UM,
      descricao: "Alinha a ponta do objeto na marca 1 e lê a marca final como se a régua começasse ali.",
    },
    {
      id: MisconceptionTag.REGUA_DESALINHADA,
      descricao: "Usa uma marca inicial diferente de zero mesmo com gesto preciso e repetível.",
    },
    {
      id: MisconceptionTag.CONFUNDE_UNIDADE,
      descricao: "Lê o valor mas escolhe uma unidade incompatível com a escala mostrada.",
    },
  ],
};
