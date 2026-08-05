import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F67 — Multiplicar por dez. Cada algarismo sobe uma casa.
 *
 * **A correção que a ficha faz:** multiplicar por 10 DESLOCA cada algarismo uma
 * ordem. Não "acrescenta zero".
 *
 * **Por que isso importa anos depois:** a regra do zero funciona com inteiros e
 * quebra com decimais — 0,5 × 10 não é "0,50". Quem decora acerta por três anos
 * e erra no quarto, sem entender por quê.
 */

const dominio = { acertos: 3, de: 3, sessoes: 2 };

export const N4_08: FichaCompetencia = {
  id: "N4.08",
  nome: "Multiplicação por 1 dígito e por 10 e 100",
  strand: "N4",
  faixa: "F3",
  prereqs: ["N4.07"],
  howto: "Multiplicar por dez faz cada algarismo subir uma casa.",
  explain: "Veja o material: cada peça virou a peça de cima.",
  distratores: [
    { regra: "acrescenta_zero", tag: MisconceptionTag.ACRESCENTA_ZERO_SEM_ENTENDER },
    { regra: "ordem_errada", tag: MisconceptionTag.ORDEM_ERRADA },
    { regra: "esquece_reagrupamento", tag: MisconceptionTag.ESQUECE_REAGRUPAMENTO },
  ],
  niveis: {
    1: { primitiva: "deslocamento", micro: "dez_com_material", andaime: "alto" },
    2: { primitiva: "deslocamento", micro: "cem", andaime: "alto" },
    3: { primitiva: "deslocamento", micro: "dez_sem_material", andaime: "medio" },
    4: { primitiva: "deslocamento", micro: "por_digito", andaime: "minimo" },
    5: { primitiva: "deslocamento", micro: "combinado", andaime: "nenhum", rt_alvo: 10000 },
  },
  micros: [
    { id: "dez_com_material", alvo: "ver a promoção das peças ao multiplicar por dez", kinds: ["deslocamento"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "cem", alvo: "entender que cem sobe duas ordens, não uma", kinds: ["deslocamento"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "dez_sem_material", alvo: "deslocar sem o apoio do material", kinds: ["deslocamento"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "por_digito", alvo: "multiplicar por um dígito, com reagrupamento", kinds: ["deslocamento"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "combinado", alvo: "combinar tabuada e deslocamento: vinte, trinta, quatrocentos", kinds: ["deslocamento"], params: { audio_prompt: "Escute e responda." }, dominio },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.ACRESCENTA_ZERO_SEM_ENTENDER, descricao: "Aplicou 'acrescenta zero' e pôs só um no ×100." },
    { id: MisconceptionTag.ORDEM_ERRADA, descricao: "Deslocou o número errado de ordens." },
    { id: MisconceptionTag.ESQUECE_REAGRUPAMENTO, descricao: "Esqueceu de somar o que veio da ordem anterior." },
  ],
};
