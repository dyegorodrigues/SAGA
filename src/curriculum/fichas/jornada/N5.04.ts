import type { FichaCompetencia, FichaDominio } from "../../schema";
import { SomaFracoesMisconception } from "../../procedimentos/somaFracoesContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * F74 — Somar Frações.
 *
 * O denominador nomeia o tamanho da parte. Com partes do mesmo tamanho, juntar
 * ou retirar altera somente quantas partes existem. A simplificação final relê
 * a equivalência da F73: mesma quantidade, outro nome.
 */
export const N5_04: FichaCompetencia = {
  id: "N5.04",
  nome: "Somar Frações",
  strand: "N5",
  faixa: "F3",
  prereqs: ["N5.03"],
  dominioNumerico: "racionais",
  howto: "Some só os de cima. O de baixo diz o tamanho do pedaço e não muda.",
  explain: "Olhe o tanque: ele continua dividido nas mesmas partes. Só ficou mais cheio ou menos cheio.",
  distratores: [
    { regra: "opera também o denominador ao juntar ou retirar partes", tag: SomaFracoesMisconception.SOMA_DENOMINADOR },
    { regra: "para na forma equivalente não reduzida quando a tarefa exige simplificar", tag: SomaFracoesMisconception.NAO_SIMPLIFICA },
    { regra: "rejeita fração maior que um inteiro como inválida", tag: SomaFracoesMisconception.IMPROPRIA_INVALIDA },
  ],
  niveis: {
    1: { primitiva: "storypanel", micro: "somar-barras", andaime: "alto" },
    2: { primitiva: "storypanel", micro: "somar-simbolico", andaime: "medio" },
    3: { primitiva: "storypanel", micro: "subtrair", andaime: "medio" },
    4: { primitiva: "storypanel", micro: "fracao-impropria", andaime: "minimo" },
    5: { primitiva: "storypanel", micro: "simplificar", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "somar-barras", fonte: "F74", alvo: "juntar partes do mesmo tamanho mantendo o denominador fixo", kinds: ["storypanel"], params: { modo: "somar-barras" }, dominio },
    { id: "somar-simbolico", fonte: "F74", alvo: "somar numeradores com denominador comum sem apoio do resultado pronto", kinds: ["storypanel"], params: { modo: "somar-simbolico" }, dominio },
    { id: "subtrair", fonte: "F74", alvo: "retirar partes do mesmo tamanho mantendo o denominador fixo", kinds: ["storypanel"], params: { modo: "subtrair" }, dominio },
    { id: "fracao-impropria", fonte: "F74", alvo: "aceitar resultado maior que um inteiro como fração válida", kinds: ["storypanel"], params: { modo: "fracao-impropria" }, dominio },
    { id: "simplificar", fonte: "F74", alvo: "simplificar como equivalência: mesma quantidade, outro nome", kinds: ["storypanel"], params: { modo: "simplificar" }, dominio },
  ],
  erros_tipicos: [
    { id: SomaFracoesMisconception.SOMA_DENOMINADOR, descricao: "Mudou o denominador como se juntar/retirar partes mudasse o tamanho delas." },
    { id: SomaFracoesMisconception.NAO_SIMPLIFICA, descricao: "Reconhece a quantidade, mas não a reescreve na forma simplificada quando solicitado." },
    { id: SomaFracoesMisconception.IMPROPRIA_INVALIDA, descricao: "Considera inválida uma fração só porque ela ultrapassa um inteiro." },
  ],
};
