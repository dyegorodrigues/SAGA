import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/grandezaProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F49 — Maior, menor, mais alto. *Comparar grandezas, e a regra de alinhar as
 * bases.*
 *
 * ---
 *
 * **⚠️ A regra pedagógica que quase todo material erra (§2):**
 *
 * > *"As **bases precisam estar alinhadas na mesma linha horizontal**. Comparar
 * > altura com objetos flutuando em posições diferentes ensina errado — é o
 * > equivalente visual de comparar quantidade pelo espaço ocupado."*
 *
 * **Por que trava:** *"a criança julga pelo que 'parece maior' sem critério. Um
 * objeto mais próximo ou mais colorido parece maior."*
 *
 * ---
 *
 * ### O que esta versão corrigiu
 *
 * **O nó GM.01 não tinha gerador nenhum.** Não está em `curriculum.ts` — uma
 * competência de faixa F0, com duas fichas escritas no cânone, servida pelo
 * fallback genérico.
 *
 * E o `Grupo`, a primitiva que a §1 nomeia, **não estava ligado a lugar
 * nenhum** — quarta primitiva órfã do bloco, depois do `AudioChoice`, do
 * `TouchPlace` e do `ShapeCanvas`. Pior: do jeito que estava, ele usa
 * `items-center`, com cada objeto flutuando no meio da própria caixa e sem
 * linha de chão. Usá-lo como estava produziria exatamente a tela que a §2 manda
 * não produzir.
 *
 * ### ⚠️ Onde fica a F50 — pendência P15
 *
 * O `GRAFO_DE_CONHECIMENTO_SAGA.md` põe *"pesado/leve, cheio/vazio"* **dentro
 * da GM.01**, junto com comprido/curto e alto/baixo — ou seja, o conteúdo da
 * F50 (capacidade e massa) é desta competência. Mas os cinco degraus da §5 já
 * são da F49, e a F50 tem outros cinco.
 *
 * A F50 diz na §1 que é a GM.02. O grafo chama GM.02 de *"tempo cotidiano"*, é
 * isso que `gGM_02` serve hoje, e a `GM.04` (Horas) declara `GM.02` como
 * pré-requisito querendo dizer partes do dia. Reassinar GM.02 mataria uma
 * competência viva e quebraria essa aresta.
 *
 * Fica registrado: a F50 não tem nó com vaga. Decisão curricular.
 *
 * ### A escada da §5
 *
 * | Nível | Atributo | Dificuldade |
 * |---|---|---|
 * | 1 | alto/baixo, diferença grande | óbvia |
 * | 2 | comprido/curto | clara |
 * | 3 | **diferença pequena** | exige comparar com cuidado |
 * | 4 | **objetos diferentes** | ignora o tipo |
 * | 5 | **ordenar três** | seriação |
 */

const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  /** §9: *"incluindo um com diferença pequena"* — enxergar não é comparar. */
  exige: {
    evidencia: Evidencia.DIFERENCA_PEQUENA,
    descricao: "Acertar quando os dois são quase do mesmo tamanho.",
  },
};

/** §8, transcrita. */
const coreografia = [
  { fala: "Os dois estão no chão.", show: { destacarLinhaBase: true } },
  { fala: "Veja qual sobe mais.", show: { subirLinhaTracejada: true } },
  { fala: "Este é mais alto!", show: { destacarMaior: true } },
];

export const GM_01: FichaCompetencia = {
  id: "GM.01",
  nome: "Maior, menor, mais alto (comparação de grandezas)",
  strand: "GM",
  faixa: "F0",
  prereqs: [],
  bncc: "EI03ET01",

  howto: FALAS.howto,
  explain: FALAS.explain,

  // Ficha de toque direto no objeto: a resposta é qual deles, não uma palavra.
  distratores: [],

  niveis: {
    1: { primitiva: "grandeza", micro: "alto_baixo", andaime: "mao_fantasma" },
    2: { primitiva: "grandeza", micro: "comprido_curto", andaime: "alto" },
    3: { primitiva: "grandeza", micro: "diferenca_pequena", andaime: "medio" },
    4: { primitiva: "grandeza", micro: "objetos_diferentes", andaime: "minimo" },
    5: { primitiva: "grandeza", micro: "seriacao", andaime: "nenhum", rt_alvo: 15000 },
  },

  micros: [
    {
      id: "alto_baixo",
      fonte: "F49",
      alvo: "alto/baixo com diferença gritante — e a linha de chão entrando em cena",
      kinds: ["grandeza"],
      params: { audio_prompt: FALAS.howto, tutorial: coreografia },
      dominio,
    },
    {
      id: "comprido_curto",
      fonte: "F49",
      alvo: "comprido/curto: o mesmo critério, outro eixo",
      kinds: ["grandeza"],
      params: { audio_prompt: FALAS.howto },
      dominio,
    },
    {
      id: "diferenca_pequena",
      fonte: "F49",
      alvo: "a diferença deixa de ser óbvia — é aqui que a régua fantasma serve",
      kinds: ["grandeza"],
      params: {
        howto: "Agora estão parecidos. Olhe a linha do chão e veja qual passa do outro.",
        explain: "Quando é parecido, a linha tracejada mostra quem sobe mais.",
      },
      dominio,
    },
    {
      id: "objetos_diferentes",
      fonte: "F49",
      alvo: "comparar coisas de tipos diferentes: a grandeza, não o objeto",
      kinds: ["grandeza"],
      params: {
        howto: "São coisas diferentes. Compare só a altura, do chão para cima.",
        explain: "Não importa o que é. Importa até onde vai, contando do chão.",
      },
      dominio,
    },
    {
      id: "seriacao",
      fonte: "F49",
      alvo: "ordenar três — comparações encadeadas, um marco cognitivo próprio",
      kinds: ["grandeza"],
      params: {
        howto: "Toque em ordem: primeiro o maior, depois o do meio, depois o menor.",
        explain: "Compare de dois em dois. Ache o maior de todos, depois o maior do que sobrou.",
      },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.BASE_DESALINHADA, descricao: "Decidiu antes de a linha do chão existir: julgou sem referência." },
    { id: MisconceptionTag.CONFUNDE_ATRIBUTOS, descricao: "Escolheu o mais volumoso quando a pergunta era a altura." },
    { id: MisconceptionTag.SO_DIFERENCA_GRANDE, descricao: "Acerta a diferença gritante e erra a pequena: enxerga, não compara." },
  ],
};
