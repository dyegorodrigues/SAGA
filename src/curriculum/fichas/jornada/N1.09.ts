import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/producaoProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F04 — Produzir quantidade. *O inverso de contar.*
 *
 * ---
 *
 * **O que a criança aprende (§2):** transformar um número **ouvido** numa
 * quantidade **produzida**.
 *
 * **Por que é mais difícil que contar:** contar é ler o mundo. Produzir é **agir
 * sobre o mundo com um alvo em mente** — segurar o número na memória de trabalho
 * enquanto age, e saber quando parar.
 *
 * > *"Muita criança que conta 5 perfeitamente não consegue 'me dê 5'."*
 *
 * **Por que importa:** *"é o teste real da cardinalidade. Quem entendeu que
 * 'cinco' é uma quantidade consegue produzi-la. Quem só decorou a sequência,
 * não."*
 *
 * ---
 *
 * ### ⚠️ De quem é esta competência — divergência declarada
 *
 * A ficha diz N1.09 em três lugares; o `GRAFO_DE_CONHECIMENTO_SAGA.md` chama
 * N1.09 de *"contagem até 20 e a partir de qualquer número"* e põe *"produzir
 * conjunto: 'me dá N'"* como micro (d) da N1.04. Sigo a ficha, e a pendência
 * **P12** registra o que fica em aberto. O raciocínio inteiro está no cabeçalho
 * de `producaoProcedure.ts`.
 *
 * ### O que esta versão corrigiu
 *
 * O nó era servido por `gVis_Sequence`: *"Conte a partir do 47. Quais números
 * vêm depois?"*, três alternativas de texto, números sorteados até 119 — numa
 * competência de faixa F0, cuja criança tem quatro anos e ainda não lê. Não
 * havia produção nenhuma: era leitura de sequência numérica em múltipla escolha.
 *
 * E o `TouchPlace`, a primitiva que a ficha nomeia, **existia no código sem
 * estar ligado a lugar nenhum** — nem `case` no Composer, nem no renderizador.
 * É o segundo caso idêntico do bloco, depois do `AudioChoice` da F05.
 *
 * ### A escada da §5
 *
 * | Nível | Quantidade | Vagas fantasma | Bandeja |
 * |---|---|---|---|
 * | 1 | 1 a 3 | visíveis, pulsando | 5 |
 * | 2 | 1 a 5 | visíveis | 8 |
 * | 3 | 1 a 5 | só contorno, sem pulsar | 8 |
 * | 4 | 1 a 10 | **nenhuma** — cena livre | 12 |
 * | 5 | 1 a 10 | nenhuma | o pedido é falado **uma vez** |
 *
 * > *"O nível 4 é o salto: sem as vagas, a criança precisa contar enquanto
 * > coloca e saber parar sozinha. É a produção de quantidade sem andaime."*
 */

/**
 * §9: 3 de 3 em 2 sessões — **e a regra extra**: pelo menos um acerto **sem
 * vagas fantasma** (nível 4+).
 *
 * *"Produzir com o alvo visível não prova cardinalidade produtiva."* Com as
 * vagas na tela, preencher todas é correspondência um-a-um (F07), não produção
 * de quantidade. A regra está em `dominou`, no procedimento.
 */
const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  /** §9: *"produzir com o alvo visível não prova cardinalidade produtiva"*. */
  exige: {
    evidencia: Evidencia.SEM_ANDAIME,
    descricao: "Produzir a quantidade certa sem as vagas fantasma na tela.",
  },
};

/**
 * §8, a coreografia do nível 1 — com as falas **neutras de tema e de número**.
 *
 * A ficha escreve *"Preciso de três estrelas"* e *"Uma..."*. Mas o nível 1
 * sorteia de 1 a 3 em três temas: a fala literal estaria errada na maioria das
 * vezes — falaria "três" mostrando uma vaga, ou "estrelas" mostrando
 * dinossauros. Mesma decisão tomada na F01, e pelo mesmo motivo: a coreografia
 * aponta para o que está na tela; se ela mente, ensina o erro.
 */
const coreografia = [
  { fala: "Olha as vagas: está faltando alguma coisa em cada uma.", show: { pulsarVagas: true } },
  { fala: "Pega uma da bandeja e coloca numa vaga.", show: { maoFantasma: { de: "bandeja", para: "vaga0" } } },
  { fala: "Agora você coloca as outras!", show: { pulsarVagas: true } },
];

export const N1_09: FichaCompetencia = {
  id: "N1.09",
  nome: "Produzir quantidade",
  strand: "N1",
  faixa: "F0",
  // §2: produzir exige a sequência oral (N1.02) e a cardinalidade (N1.04) já
  // firmes — é o teste de saída dela, não o de entrada.
  prereqs: ["N1.02", "N1.04"],
  bncc: "EI03ET07",

  howto: FALAS.howto,
  explain: FALAS.explain,

  // Ficha de PRODUÇÃO: não há alternativa. O diagnóstico vem do que ela FEZ —
  // quantos colocou, quantas vezes tentou passar do pedido, se despejou a
  // bandeja. Fabricar distratores aqui seria trocar a competência por outra.
  distratores: [],

  niveis: {
    1: { primitiva: "touchplace", micro: "vagas_pulsando", andaime: "mao_fantasma" },
    2: { primitiva: "touchplace", micro: "vagas_paradas", andaime: "alto" },
    3: { primitiva: "touchplace", micro: "so_contorno", andaime: "medio" },
    4: { primitiva: "touchplace", micro: "cena_livre", andaime: "minimo" },
    // O `rt_alvo` aqui NÃO é critério de domínio — §5.1-bis, o relógio
    // silencioso: nenhuma ficha da Jornada reprova por tempo. Ele existe para
    // alimentar a trilha do Dojo, e é generoso de propósito: o nível 5 pede até
    // 10 objetos, e cada um custa dois toques. Criança lenta seria penalizada
    // por ser lenta, que é o que a §2 desta ficha proíbe em letra maiúscula.
    5: { primitiva: "touchplace", micro: "pedido_unico", andaime: "nenhum", rt_alvo: 25000 },
  },

  micros: [
    {
      id: "vagas_pulsando",
      fonte: "F04",
      alvo: "aprender o gesto: pegar um de cada vez e contar enquanto coloca",
      kinds: ["touchplace"],
      params: { audio_prompt: FALAS.howto, tutorial: coreografia },
      dominio,
    },
    {
      id: "vagas_paradas",
      fonte: "F04",
      alvo: "produzir até 5 com o andaime visível, sem a vaga chamando",
      kinds: ["touchplace"],
      params: { audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "so_contorno",
      fonte: "F04",
      alvo: "o andaime fica discreto: o contorno ainda está lá, mas não aponta",
      kinds: ["touchplace"],
      params: { audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "cena_livre",
      fonte: "F04",
      alvo: "SEM vaga nenhuma: contar enquanto coloca e saber parar sozinha",
      kinds: ["touchplace"],
      params: { audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "pedido_unico",
      fonte: "F04",
      alvo: "o pedido é falado uma vez: o número tem de ser segurado na memória",
      kinds: ["touchplace"],
      params: { audio_prompt: FALAS.howto },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.PRODUCAO_INCOMPLETA, descricao: "Parou antes do pedido: perdeu a conta durante a ação." },
    { id: MisconceptionTag.NAO_MONITORA_ALVO, descricao: "Tentou colocar mais que o pedido: não segurou o número na memória enquanto agia." },
    { id: MisconceptionTag.IGNORA_QUANTIDADE, descricao: "Despejou a bandeja inteira: não processou o número, agiu por impulso." },
    { id: MisconceptionTag.DEPENDE_DE_ANDAIME, descricao: "Acerta com as vagas na tela e erra sem elas: ainda não internalizou a contagem produtiva." },
  ],
};
