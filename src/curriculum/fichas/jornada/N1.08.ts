import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/emojiRowProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * N1.08 — a âncora do 5. **Duas fichas, uma competência.**
 *
 * | Ficha | Primitiva | O que instala |
 * |---|---|---|
 * | **JD2** — A Mão Relâmpago | `EmojiRow` (flash, skin mão) | o 5 no corpo dela |
 * | **F02** — A Moldura de Dez | `TenFrame` | o 5 na estrutura |
 *
 * ---
 *
 * ### A ordem, e de onde ela vem
 *
 * Não é escolha minha: a **JD2 §2** escreve a posição dela em uma frase —
 *
 * > *"É o degrau que falta entre o Olhômetro (JD1, até 5 dispersos) e a Moldura
 * > de Dez (F02)."*
 *
 * A mão vem **antes** da moldura porque é o primeiro material concreto que toda
 * criança já tem, e é **estruturada por natureza**: cinco de um lado, cinco do
 * outro. Ela ensina a sub-base 5 sem que ninguém precise explicar a sub-base 5.
 *
 * Por isso os níveis 1 e 2 são a mão, e o 3 ao 5 são a moldura.
 *
 * ### ⚠️ Divergência declarada — os degraus 3 a 5 da JD2
 *
 * A JD2 §5 tem cinco níveis próprios (uma mão canônica → uma mão livre → duas
 * mãos com uma cheia → duas livres → duas sem cheia). A Jornada do N1.08 só tem
 * cinco degraus no total, e três deles pertencem à F02.
 *
 * Os degraus 1 e 2 da JD2 entram aqui; os degraus 3 a 5 ficam na **trilha JD2 do
 * Dojo**, que é onde a própria ficha diz que também mora (*"Também é trilha do
 * Dojo (JD2)"*) e cujo trabalho é automatizar. O procedimento já constrói os
 * cinco (`configuracaoDaMao`), então nada foi cortado — foi realocado, e está
 * escrito aqui em vez de ser descoberto por quem for construir o Dojo.
 *
 * **O que fica em aberto:** a escada da F02 nos níveis 3-5 é a do passo 3 do
 * `PLANO_DO_BLOCO_F0` (`TenFrame` — plain e flash). Ela continua como estava:
 * este passo constrói o `EmojiRow`, e reescrever a moldura de carona seria
 * exatamente o "pegou o que já existia e fez pior" que este trilho evita.
 *
 * ### ⚠️ `excecaoCPA: "perceptual"` (JD2 §2)
 *
 * Como a JD1, não tem forma abstrata: sobe por automaticidade — mais dedos,
 * menos tempo, configuração menos canônica —, nunca por abstração.
 */

/** JD2 §9 e F02: critério frouxo, coerente com a JD1. Sem critério de tempo. */
const dominio = { acertos: 4, de: 5, sessoes: 2 };

/**
 * JD2 §8, transcrita.
 *
 * `flash: { mao: 3 }` é a demonstração; `revelar: { mao: 3 }` é a mão **parada**
 * — o degrau *plain* da escada, o mesmo mecanismo que resolve a P1 na JD1.
 */
const coreografiaDaMao = [
  { fala: "Prepare o olho!", show: { fixarOlhar: true } },
  { fala: "Já!", show: { flash: { mao: 3, ms: 1500 } } },
  { fala: "Viu? Eram três.", show: { revelar: { mao: 3 } } },
];

export const N1_08: FichaCompetencia = {
  id: "N1.08",
  nome: "Subitização com estrutura (a mão e a moldura)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.03", "N1.04"],
  bncc: "EI03ET07",
  excecaoCPA: "perceptual",

  // A voz da F02, que serve os níveis 3 a 5. Os níveis da mão sobrescrevem na
  // micro — a §7 da JD2 proíbe em negrito dizer "conte" na tela dela.
  howto: "Use a fileira cheia para não precisar contar do começo. A fileira inteira vale cinco.",
  explain: "A fileira de cima está cheia, então são cinco. Continue contando os de baixo.",

  // As regras em forma de conta (`n+1`) são as que o Composer sabe casar com o
  // valor da alternativa, e servem os níveis da MOLDURA. As da mão não cabem
  // nesse formato — `ANCORA_CINCO_RIGIDA` fala do polegar e `CHUTE_SEGURO` da
  // posição na tela —, e por isso são atribuídas no builder da fileira, a
  // partir do procedimento. Ver `tagDaAlternativa` no Composer.
  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-5", tag: MisconceptionTag.IGNORA_SEGUNDA_MAO },
  ],

  niveis: {
    1: { primitiva: "fileira", micro: "mao_canonica", andaime: "mao_fantasma" },
    2: { primitiva: "fileira", micro: "mao_livre", andaime: "alto" },
    3: { primitiva: "tenframe", micro: "moldura", andaime: "medio" },
    4: { primitiva: "tenframe", micro: "moldura", andaime: "minimo" },
    5: { primitiva: "tenframe", micro: "moldura", rt_alvo: 2500 },
  },

  micros: [
    {
      id: "mao_canonica",
      alvo: "reconhecer 1 a 5 pela mão canônica — a mão cheia já é cinco",
      kinds: ["fileira"],
      params: {
        modo: "flash-mao",
        audio_prompt: FALAS.mao.audioPrompt,
        howto: FALAS.mao.howto,
        // §7 da JD2, e o veto: "nunca pode dizer 'conte os dedos'".
        explain: FALAS.mao.explain,
        tutorial: coreografiaDaMao,
      },
      dominio,
    },
    {
      id: "mao_livre",
      alvo: "reconhecer a mão em qualquer configuração: 4 é 'mão sem o polegar', não 'um-dois-três-quatro'",
      kinds: ["fileira"],
      params: {
        modo: "flash-mao",
        audio_prompt: FALAS.mao.audioPrompt,
        howto: FALAS.mao.howto,
        explain: FALAS.mao.explain,
      },
      dominio,
    },
    {
      id: "moldura",
      alvo: "reconhecer quantidades em dezena incompleta via estrutura de cinco",
      kinds: ["tenframe"],
      params: {
        n_min: 5,
        n_max: 10,
        flash_ms: 1500,
        moldura: 10,
        escopo_teclado: "1-10",
        audio_prompt: "A Caixa Mágica abriu e fechou! Quantos você viu?",
        tutorial: [{ fala: "Esta é a caixa mágica! Tente ver os números sem contar um por um!" }],
      },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Tentou contar dedo a dedo e perdeu o fio." },
    { id: MisconceptionTag.ANCORA_CINCO_RIGIDA, descricao: "Responde 5 para qualquer mão com polegar levantado: fixou 'mão = 5' e não vê a variação." },
    { id: MisconceptionTag.IGNORA_SEGUNDA_MAO, descricao: "Em duas mãos, responde só o de uma delas: não integra os dois conjuntos." },
    { id: MisconceptionTag.DEPENDE_DE_FORMATO, descricao: "Acerta a mão canônica e erra a livre: subitiza só com apoio estrutural." },
  ],
};
