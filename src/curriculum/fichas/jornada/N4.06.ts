import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F96 — Família × ÷. O triângulo multiplicativo.
 *
 * Três números formam uma família: 3, 4 e 12 dizem `3×4=12`, `4×3=12`,
 * `12÷3=4` e `12÷4=3`.
 *
 * **Corta o trabalho pela metade:** quem entende a família não precisa decorar
 * a tabuada de divisão. Sabendo 6×7=42, deduz 42÷7=6.
 */

const dominio = { acertos: 3, de: 3, sessoes: 2 };

export const N4_06: FichaCompetencia = {
  id: "N4.06",
  nome: "Família de multiplicação e divisão",
  strand: "N4",
  faixa: "F2",
  // CLASS-002 — a ficha dizia menos pré-requisitos do que o DAG cobra.
  //
  // Quem tranca a porta é o DAG: é dele que `unlockEngine` e `rescuePlanner`
  // leem. O campo aqui é documentação, e documentação que discorda do que o app
  // faz é pior que documentação ausente — ela convence de uma coisa errada.
  prereqs: ["N4.03", "N4.05"],
  howto: "Os dois de baixo multiplicados dão o de cima. E o de cima dividido por um dá o outro.",
  explain: "Olhe o triângulo: se você sabe a multiplicação, já sabe a divisão.",
  distratores: [
    { regra: "inverte_divisao", tag: MisconceptionTag.INVERTE_DIVISAO },
    { regra: "divide_subtraindo", tag: MisconceptionTag.DIVIDE_SUBTRAINDO },
    { regra: "soma_os_fatores", tag: MisconceptionTag.SOMA_OS_FATORES },
  ],
  niveis: {
    1: { primitiva: "familia", micro: "produto_pequeno", andaime: "alto" },
    2: { primitiva: "familia", micro: "multiplicacoes", andaime: "alto" },
    3: { primitiva: "familia", micro: "mult_e_div", andaime: "medio" },
    4: { primitiva: "familia", micro: "as_quatro", andaime: "minimo" },
    5: { primitiva: "familia", micro: "deduzir_divisao", andaime: "nenhum", rt_alvo: 8000 },
  },
  micros: [
    { id: "produto_pequeno", alvo: "ver os três números como uma família, com produtos até 20", kinds: ["familia"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "multiplicacoes", alvo: "reconhecer que a ordem dos fatores não muda o produto", kinds: ["familia"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "mult_e_div", alvo: "passar da multiplicação para a divisão dentro da mesma família", kinds: ["familia"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "as_quatro", alvo: "responder qualquer das quatro contas da família", kinds: ["familia"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "deduzir_divisao", alvo: "deduzir a divisão sem apoio, a partir da multiplicação que já sabe", kinds: ["familia"], params: { audio_prompt: "Escute e responda." }, dominio },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.INVERTE_DIVISAO, descricao: "Devolveu o divisor visível em vez do quociente." },
    { id: MisconceptionTag.DIVIDE_SUBTRAINDO, descricao: "Tratou a divisão como subtração." },
    { id: MisconceptionTag.SOMA_OS_FATORES, descricao: "Somou os fatores em vez de multiplicar." },
  ],
};
