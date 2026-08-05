import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F07 — Um pra cada. A primeira competência matemática da vida.
 *
 * ---
 *
 * **Por que esta ficha vem antes de todas.** A criança de 4 anos recita "um,
 * dois, três" sem entender que o último número *é* a quantidade. Antes de o
 * número significar alguma coisa, ela precisa de **correspondência**: um
 * capacete para cada bombeiro. É o alicerce de contagem, comparação, divisão e
 * fração — tudo depende de saber parear.
 *
 * ### ⚠️ A regra dura
 *
 * > **Nenhum numeral aparece nesta ficha, em nenhum nível.**
 *
 * Se aparecer número, virou N1.04 (contar). A competência aqui é pré-numérica, e
 * `nenhumNumeralNaTela()` varre o spec inteiro atrás de dígito.
 *
 * ### O que esta versão corrigiu
 *
 * A versão anterior tinha **dois micros para cinco níveis**, e os níveis só
 * mudavam o rótulo do andaime — a escada da F07 §5 (3 e 3 → 3 e 4 → espalhado →
 * cena → prever) não existia no runtime. Faltavam também:
 *
 * - **a pergunta final "sobrou?"**, que a ficha chama de *"o coração"*
 * - **o nível 5 invertido**: prever *antes* de distribuir
 * - **a coreografia da §8** — havia uma fala genérica no lugar de quatro passos
 * - **os três erros da §6**, substituídos por uma string solta fora do catálogo
 *
 * Nada disso era bug de código: era a ficha não tendo sido lida ao construir.
 */

const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * A coreografia da ficha F07 §8, aplicada ao nível 1.
 *
 * **As falas são neutras de tema de propósito.** A cena sorteia bombeiros, dinos
 * ou macacos; um passo que dissesse "olha os bombeiros" ficaria errado em dois
 * terços das vezes. "Olha quem está esperando" é verdade nas três, e mantém a
 * concretude — a criança está olhando para eles enquanto ouve.
 *
 * O último passo passa a bola: a Mão Fantasma faz **um** par, e só um. Fazer
 * dois já resolveria metade da tarefa por ela.
 */
const tutorial = [
  { fala: "Olha quem está esperando.", show: { destacarFileira: "receptores" } },
  { fala: "Cada um precisa de um.", show: { destacarFileira: "itens" } },
  { fala: "Assim, ó.", show: { maoFantasma: true } },
  { fala: "Agora você!", show: { pulsar: true } },
];

export const N1_01: FichaCompetencia = {
  id: "N1.01",
  nome: "Parear um a um (um pra cada)",
  strand: "N1",
  faixa: "F0",
  prereqs: [],
  bncc: "EI03ET07",
  excecaoCPA: "perceptual",

  howto: "Um de cada vez. Pegue um e leve para quem ainda está sem.",
  // O explain aponta a REGRA, não entrega a resposta. E nunca elogia (F07 §7).
  explain: "Cada um precisa de um só. Veja se alguém ficou sem.",
  // Ficha de PRODUÇÃO: o diagnóstico vem da ação, não de alternativas.
  distratores: [],

  niveis: {
    1: { primitiva: "pareamento", micro: "exato_com_mao", andaime: "mao_fantasma" },
    2: { primitiva: "pareamento", micro: "sobra_um", andaime: "alto" },
    3: { primitiva: "pareamento", micro: "espalhado", andaime: "medio" },
    4: { primitiva: "pareamento", micro: "cena", andaime: "minimo" },
    5: { primitiva: "pareamento", micro: "prever", andaime: "nenhum", rt_alvo: 12000 },
  },

  micros: [
    {
      id: "exato_com_mao",
      alvo: "aprender o gesto do um-pra-cada, sem sobra e sem falta",
      kinds: ["pareamento"],
      params: { audio_prompt: "Escute e distribua.", tutorial },
      dominio,
    },
    {
      id: "sobra_um",
      alvo: "distribuir sozinha e perceber que sobrou",
      kinds: ["pareamento"],
      params: { audio_prompt: "Escute e distribua.", tutorial },
      dominio,
    },
    {
      id: "espalhado",
      alvo: "parear sem a ajuda da fila — os itens vêm espalhados",
      kinds: ["pareamento"],
      params: { audio_prompt: "Escute e distribua." },
      dominio,
    },
    {
      id: "cena",
      alvo: "parear numa cena, com todos fora de fileira",
      kinds: ["pareamento"],
      params: { audio_prompt: "Escute e distribua." },
      dominio,
    },
    {
      id: "prever",
      alvo: "PREVER se tem para todos, antes de distribuir — o salto comparativo",
      kinds: ["pareamento"],
      params: { audio_prompt: "Escute e responda antes de distribuir." },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.DISTRIBUICAO_DESIGUAL, descricao: "Pôs dois ou mais no mesmo lugar: ainda não tem a regra 'um e só um'." },
    { id: MisconceptionTag.PAREAMENTO_INCOMPLETO, descricao: "Deixou alguém sem, com item sobrando: perdeu o fio e não varreu todos." },
    { id: MisconceptionTag.COMPARACAO_VISUAL, descricao: "Disse que sobrou quando não sobrou: julgou pela aparência, não pelo pareamento." },
  ],
};
