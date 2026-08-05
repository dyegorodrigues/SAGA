import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F68 — O Modelo de Área. Partir para multiplicar.
 *
 * **O que a ficha corrige:** o "zero da segunda linha" da multiplicação armada
 * é ensinado como regra de escrita — *põe um zero e depois multiplica*. Quem
 * aprende assim escreve o zero certo por anos e nunca sabe por quê, e trava no
 * primeiro dia em que a conta muda de forma.
 *
 * **O que ela ensina no lugar:** que `13 × 4` se resolve partindo em
 * `(10 × 4) + (3 × 4)`. O zero deixa de ser regra e passa a ser consequência —
 * aquela linha é o retângulo das DEZENAS.
 *
 * **O que vem de graça:** a distributiva. A criança a usa aqui, anos antes de
 * ouvir o nome, e `(a+b)×c` em álgebra vira o mesmo retângulo partido.
 */

const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * A micro-aula, vinda da Coreografia da ficha F68 §8.
 *
 * Nasce ligada ao palco desde o primeiro commit. As seis competências
 * anteriores declararam coreografia sem ninguém ter ligado o `tutShow` ao
 * componente, e ficaram meses ensinando sem momento de ensino (§6.23) — aqui o
 * teste da ficha cobra os dois lados.
 *
 * **Nenhum passo diz o total.** "Dez vezes quatro é quarenta" nomeia a REGIÃO;
 * somar as regiões continua sendo o trabalho da criança. Um passo que dissesse
 * "cinquenta e dois" transformaria a aula na resposta.
 */
const tutorial = [
  { fala: "Olhe as medidas do retângulo. O primeiro número fica deitado em cima.", show: { destacarMedida: "cima" } },
  { fala: "O segundo número fica em pé, na lateral.", show: { destacarMedida: "lado" } },
  { fala: "Cada pedaço vale o número de cima vezes o número do lado.", show: { destacarRegiao: 0 } },
  { fala: "Este é o pedaço das dezenas.", show: { destacarRegiao: 0 } },
  { fala: "E este é o das unidades.", show: { destacarRegiao: 1 } },
  { fala: "Agora junte os dois pedaços. A soma deles é a resposta.", show: { juntarRegioes: true } },
];

export const N4_09: FichaCompetencia = {
  id: "N4.09",
  nome: "Multiplicação com dois dígitos pelo modelo de área",
  strand: "N4",
  faixa: "F3",
  prereqs: ["N4.08"],
  howto: "Parta o número em dezenas e unidades. Multiplique cada parte e some.",
  explain: "Olhe as duas regiões do retângulo. Quanto vale cada uma?",
  distratores: [
    { regra: "parcela_unica", tag: MisconceptionTag.PARCELA_UNICA },
    { regra: "corte_errado", tag: MisconceptionTag.CORTE_ERRADO },
    { regra: "zero_esquecido", tag: MisconceptionTag.ZERO_ESQUECIDO },
  ],
  niveis: {
    // O nível 1 alfabetiza no desenho, com conta que a criança já sabe de cor.
    // O modelo de área é idioma novo depois de 27 nós usando o arranjo para
    // contar; estrear idioma novo em conteúdo novo foi o erro do §6.36.
    1: { primitiva: "area", micro: "corte_marcado", andaime: "alto" },
    2: { primitiva: "area", micro: "corte_proprio", andaime: "alto" },
    3: { primitiva: "area", micro: "area_e_algoritmo", andaime: "medio" },
    4: { primitiva: "area", micro: "quatro_regioes", andaime: "minimo" },
    5: { primitiva: "area", micro: "so_algoritmo", andaime: "nenhum", rt_alvo: 15000 },
  },
  micros: [
    { id: "corte_marcado", alvo: "aprender a LER o retângulo: medida em cima, medida na lateral, cada pedaço é um vezes o outro", kinds: ["area"], params: { audio_prompt: "Escute e responda.", tutorial }, dominio },
    { id: "corte_proprio", alvo: "imaginar o corte sem ele desenhado", kinds: ["area"], params: { audio_prompt: "Escute e responda.", tutorial }, dominio },
    { id: "area_e_algoritmo", alvo: "ligar cada região à linha correspondente da conta armada", kinds: ["area"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "quatro_regioes", alvo: "partir os dois fatores: quatro regiões, quatro parcelas", kinds: ["area"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "so_algoritmo", alvo: "resolver pela conta armada, com a área já internalizada", kinds: ["area"], params: { audio_prompt: "Escute e responda." }, dominio },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.PARCELA_UNICA, descricao: "Multiplicou uma região e parou, sem somar as partes." },
    { id: MisconceptionTag.CORTE_ERRADO, descricao: "Partiu pelo algarismo: leu o 1 de 13 como um, não como dez." },
    { id: MisconceptionTag.ZERO_ESQUECIDO, descricao: "Esqueceu o zero da segunda linha da conta armada." },
  ],
};
