import { FichaCompetencia, FichaDominio } from "../../schema";
import { ExpressaoF77Misconception } from "../../procedimentos/expressaoF77Contract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Procure primeiro o pacote que precisa ser resolvido.", show: { destacarPrioridade: true } },
  { fala: "Resolva o pacote e depois continue com o restante da expressão.", show: { colapsarPrioridade: true } },
];

/** F77 — A Expressão: ordem de resolução, incógnita e propriedades. */
export const AL_06: FichaCompetencia = {
  id: "AL.06",
  nome: "A Expressão",
  strand: "AL",
  faixa: "F3",
  prereqs: ["AL.05", "N4.06"],
  howto: "Multiplicação e divisão vêm primeiro. Elas são pacotes fechados.",
  explain: "Resolva o que está dentro da bolha antes de continuar.",
  distratores: [
    { regra: "resolve tudo rigidamente da esquerda para a direita", tag: ExpressaoF77Misconception.RESOLVE_DA_ESQUERDA },
    { regra: "ignora o agrupamento indicado pelos parênteses", tag: ExpressaoF77Misconception.IGNORA_PARENTESES },
    { regra: "só reconhece incógnita quando ela aparece no fim", tag: ExpressaoF77Misconception.SO_INCOGNITA_NO_FIM },
  ],
  niveis: {
    1: { primitiva: "balanca", micro: "mesma-ordem", andaime: "alto" },
    2: { primitiva: "balanca", micro: "precedencia", andaime: "medio" },
    3: { primitiva: "balanca", micro: "parenteses", andaime: "medio" },
    4: { primitiva: "balanca", micro: "incognita-meio", andaime: "minimo" },
    5: { primitiva: "balanca", micro: "propriedades", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "mesma-ordem", fonte: "F77", alvo: "resolver duas operações da mesma ordem sem perder termos", kinds: ["balanca"], params: { modo: "mesma-ordem", tutorial }, dominio },
    { id: "precedencia", fonte: "F77", alvo: "resolver multiplicação antes da adição porque ela forma um pacote", kinds: ["balanca"], params: { modo: "precedencia", tutorial }, dominio },
    { id: "parenteses", fonte: "F77", alvo: "tratar parênteses como agrupamento prioritário explícito", kinds: ["balanca"], params: { modo: "parenteses", tutorial }, dominio },
    { id: "incognita-meio", fonte: "F77", alvo: "determinar uma incógnita em posição interna preservando a igualdade", kinds: ["balanca"], params: { modo: "incognita-meio", tutorial }, dominio },
    { id: "propriedades", fonte: "F77", alvo: "reconhecer comutativa, associativa e distributiva como formas equivalentes", kinds: ["balanca"], params: { modo: "propriedades" }, dominio },
  ],
  erros_tipicos: [
    { id: ExpressaoF77Misconception.RESOLVE_DA_ESQUERDA, descricao: "Ignora a precedência e resolve apenas pela posição." },
    { id: ExpressaoF77Misconception.IGNORA_PARENTESES, descricao: "Desconsidera o agrupamento explícito dos parênteses." },
    { id: ExpressaoF77Misconception.SO_INCOGNITA_NO_FIM, descricao: "Não trata uma lacuna no meio da expressão como incógnita válida." },
  ],
};
