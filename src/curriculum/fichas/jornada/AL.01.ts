import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/classificacaoProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F51 — Separar por atributo. Classificar: a operação lógica que vem **antes**
 * da matemática.
 *
 * ---
 *
 * **O que a criança aprende (§2):** agrupar por uma característica — e perceber
 * que o **mesmo conjunto** pode ser agrupado de formas diferentes.
 *
 * **Por que é a base de tudo:** *"classificar é o que permite contar (contar o
 * quê?), comparar (comparar quais?) e mais tarde entender conjuntos, fatores e
 * categorias de dados."*
 *
 * **O que quase ninguém ensina, e é o coração:** o **"não pertence"**. Colocar
 * corretamente **fora** do grupo é resposta certa. Sem isso, a criança acha que
 * tudo tem que caber em alguma caixa.
 *
 * ---
 *
 * ### O que esta versão corrigiu
 *
 * A AL.01 estava **ativa em produção** servindo `intruso_math` — *"qual é o
 * diferente?"*, em múltipla escolha. Não é uma implementação parcial da F51: é
 * **outra competência com o nome desta**. A criança nunca separava nada, nunca
 * decidia um "fora", e os cinco níveis chamavam o mesmo gerador com o mesmo
 * `params` — a escada da §5 não existia em degrau nenhum.
 *
 * O que passou a existir, degrau a degrau (§5):
 *
 * | Nível | O que muda | Por que este é o próximo |
 * |---|---|---|
 * | 1 | um laço, critério de **cor** | cor é o único atributo que uma criança de 4 anos nomeia sem comparar duas peças — tamanho é relativo, forma exige vocabulário |
 * | 2 | dois laços **excludentes** | dois valores do mesmo atributo: nenhuma peça cabe nos dois, e ela aprende que os laços competem |
 * | 3 | o critério **muda** | as MESMAS peças, outro agrupamento — é o marco da §2 |
 * | 4 | dois laços que **se cruzam** | *"o degrau mais difícil do raciocínio lógico infantil"*: pertencer a dois grupos ao mesmo tempo |
 * | 5 | ela **descobre** o critério | a inversão: em vez de aplicar a regra, lê a regra no agrupamento pronto |
 *
 * ### ⚠️ Observação de progressão, registrada (P11)
 *
 * `DragGroup` estreia em **dois modos**, em **dois nós raiz**: `parear` no
 * N1.01 e `caixas/laços` aqui. Nenhum é pré-requisito do outro, então não há
 * ordem — a criança pode encontrar qualquer um primeiro.
 *
 * Não mudo o grafo por conta própria: a §2 desta ficha argumenta que
 * classificar vem **antes** de contar, e inverter a ordem seria decisão de
 * cânone. O que dá para fazer é o que a JD1 ensinou — **a coreografia é o
 * alfabeto** —, e a §8 já manda a Mão Fantasma pôr uma peça dentro e deixar
 * outra fora antes de a criança agir.
 */

/** §9: 3 de 3 em 2 sessões — **incluindo uma peça corretamente deixada fora**. */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * §8, transcrita.
 *
 * Os dois gestos que a Mão Fantasma faz são **um dentro e um fora**, nessa
 * ordem — e o segundo é o que a ficha inteira existe para ensinar. Uma
 * demonstração que só pusesse peças dentro ensinaria que tudo cabe, que é
 * exatamente o `TUDO_CABE`.
 */
const coreografia = [
  { fala: "Vamos separar os vermelhos.", show: { destacarLaco: true } },
  { fala: "Este é vermelho, entra.", show: { moverParaDentro: 0 } },
  { fala: "Este não é. Fica fora!", show: { deixarFora: 1 } },
];

export const AL_01: FichaCompetencia = {
  id: "AL.01",
  nome: "Classificar por atributo (o laço e o 'não pertence')",
  strand: "AL",
  faixa: "F0",
  prereqs: [],
  bncc: "EI03ET05",

  howto: FALAS.howto,
  explain: FALAS.explain,

  distratores: [
    { regra: "força tudo para dentro do laço", tag: MisconceptionTag.TUDO_CABE },
    { regra: "agrupa por outro atributo", tag: MisconceptionTag.CRITERIO_ERRADO },
    { regra: "fixa no primeiro critério", tag: MisconceptionTag.NAO_RECLASSIFICA },
    { regra: "não aceita pertencer a dois", tag: MisconceptionTag.SEM_INTERSECAO },
  ],

  // A escada cresce em ESTRUTURA — quantos laços, se eles se cruzam, se o
  // critério muda, e por fim quem descobre a regra. Nenhum degrau aumenta só a
  // quantidade de peças, que seria escada falsa (Padrão Ouro §1).
  niveis: {
    1: { primitiva: "classificacao", micro: "um_laco", andaime: "mao_fantasma" },
    2: { primitiva: "classificacao", micro: "dois_lacos", andaime: "alto" },
    3: { primitiva: "classificacao", micro: "reclassificar", andaime: "medio" },
    4: { primitiva: "classificacao", micro: "intersecao", andaime: "minimo" },
    5: { primitiva: "classificacao", micro: "descobrir", andaime: "nenhum", rt_alvo: 20000 },
  },

  micros: [
    {
      id: "um_laco",
      fonte: "F51",
      alvo: "um critério de cor — e a primeira peça corretamente deixada FORA",
      kinds: ["classificacao"],
      params: { audio_prompt: FALAS.audioPrompt, tutorial: coreografia },
      dominio,
    },
    {
      id: "dois_lacos",
      fonte: "F51",
      alvo: "dois laços excludentes: nenhuma peça cabe nos dois",
      kinds: ["classificacao"],
      params: { audio_prompt: FALAS.audioPrompt },
      dominio,
    },
    {
      id: "reclassificar",
      fonte: "F51",
      alvo: "as MESMAS peças, outro critério — o mesmo conjunto se agrupa de formas diferentes",
      kinds: ["classificacao"],
      params: { audio_prompt: FALAS.audioPrompt },
      dominio,
    },
    {
      id: "intersecao",
      fonte: "F51",
      alvo: "pertencer a DOIS grupos ao mesmo tempo — o degrau mais difícil da lógica infantil",
      kinds: ["classificacao"],
      params: { audio_prompt: FALAS.audioPrompt },
      dominio,
    },
    {
      id: "descobrir",
      fonte: "F51",
      alvo: "ler a regra no agrupamento pronto: por que estas estão juntas?",
      kinds: ["classificacao"],
      params: { audio_prompt: "Por que estas estão juntas?" },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.TUDO_CABE, descricao: "Força tudo para dentro do laço: acha que toda peça tem de caber em alguma caixa." },
    { id: MisconceptionTag.CRITERIO_ERRADO, descricao: "Agrupou coerentemente, mas por outro atributo." },
    { id: MisconceptionTag.NAO_RECLASSIFICA, descricao: "O critério mudou e ela continuou no anterior." },
    { id: MisconceptionTag.SEM_INTERSECAO, descricao: "Não aceita que uma peça pertença a dois grupos." },
  ],
};
