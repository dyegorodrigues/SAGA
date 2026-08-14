import { FichaCompetencia, FichaDominio } from "../../schema";
import { FracaoNumeroMisconception } from "../../procedimentos/fracaoNumeroContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "A barra inteira vale um.", show: { destacarBarra: true } },
  { fala: "As divisões da barra viram marcas na reta.", show: { transformarEmReta: true } },
];

/** F72 — A Fração é um Número: parte-todo, coleção e reta se encontram. */
export const N5_02: FichaCompetencia = {
  id: "N5.02",
  nome: "A Fração é um Número",
  strand: "N5",
  faixa: "F3",
  prereqs: ["N5.01", "N4.05"],
  howto: "O de baixo diz em quantas partes iguais o inteiro foi dividido. O de cima diz quantas partes avançar.",
  explain: "A barra inteira vale 1. Quando as divisões da barra viram marcas na reta, cada fração ganha um lugar exato.",
  distratores: [
    { regra: "conta marcas em vez dos intervalos da reta", tag: FracaoNumeroMisconception.CONTA_MARCAS },
    { regra: "coloca fração maior antes de fração menor", tag: FracaoNumeroMisconception.NAO_ORDENA_FRACAO },
    { regra: "usa quantidade destacada como denominador da coleção", tag: FracaoNumeroMisconception.DENOMINADOR_ERRADO },
    { regra: "rejeita frações maiores que um", tag: FracaoNumeroMisconception.FRACAO_SO_MENOR_QUE_UM },
  ],
  niveis: {
    1: { primitiva: "storypanel", micro: "parte-todo", andaime: "alto" },
    2: { primitiva: "storypanel", micro: "colecao", andaime: "medio" },
    3: { primitiva: "numberline", micro: "reta-completa", andaime: "minimo" },
    4: { primitiva: "numberline", micro: "reta-parcial", andaime: "minimo" },
    5: { primitiva: "numberline", micro: "fracao-impropria", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "parte-todo", fonte: "F72", alvo: "identificar a fração pintada em uma barra dividida igualmente", kinds: ["storypanel"], params: { suporte: "SingaporeBars", tutorial }, dominio },
    { id: "colecao", fonte: "F72", alvo: "identificar numerador e denominador em uma coleção", kinds: ["storypanel"], params: { suporte: "colecao" }, dominio },
    { id: "reta-completa", fonte: "F72", alvo: "localizar uma fração própria numa reta com todas as marcas", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine", tutorial }, dominio },
    { id: "reta-parcial", fonte: "F72", alvo: "estimar a fração quando só 0, metade e 1 estão nomeados", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine" }, dominio },
    { id: "fracao-impropria", fonte: "F72", alvo: "localizar fração maior que um numa reta que chega a dois", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine" }, dominio },
  ],
  erros_tipicos: [
    { id: FracaoNumeroMisconception.CONTA_MARCAS, descricao: "Conta as marcas da reta em vez dos intervalos." },
    { id: FracaoNumeroMisconception.NAO_ORDENA_FRACAO, descricao: "Não ordena frações como números." },
    { id: FracaoNumeroMisconception.DENOMINADOR_ERRADO, descricao: "Não identifica o total da coleção como denominador." },
    { id: FracaoNumeroMisconception.FRACAO_SO_MENOR_QUE_UM, descricao: "Acha que frações maiores que um não existem." },
  ],
};
