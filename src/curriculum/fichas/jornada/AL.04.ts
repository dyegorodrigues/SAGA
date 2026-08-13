import { FichaCompetencia, FichaDominio } from "../../schema";
import {
  REGRA_SEQUENCIA_DESAFIO_PREFIX,
  RegraSequenciaMisconception,
} from "../../procedimentos/regraSequenciaContract";

const dominio: FichaDominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  evidenciasDistintas: {
    prefixo: REGRA_SEQUENCIA_DESAFIO_PREFIX,
    minimo: 1,
    descricao: "Resolver pelo menos uma sequência decrescente ou com lacuna no meio.",
  },
};

const coreografia = [
  { fala: "De dois para cinco.", show: { arcoEntre: [0, 1], valor: 3 } },
  { fala: "Somou três.", show: { destacarPasso: 3 } },
  { fala: "E aqui também!", show: { arcoEntre: [1, 2], valor: 3 } },
];

/** F57 — A Regra da Sequência: descobrir a operação invisível e aplicá-la. */
export const AL_04: FichaCompetencia = {
  id: "AL.04",
  nome: "A Regra da Sequência",
  strand: "AL",
  faixa: "F2",
  prereqs: ["AL.03", "N3.09"],
  howto: "Veja o que muda de um número para o outro. A mesma coisa acontece sempre.",
  explain: "Compare o primeiro com o segundo. Depois o segundo com o terceiro. É a mesma mudança?",
  distratores: [],
  niveis: {
    1: { primitiva: "fileira", micro: "aditiva-curta", andaime: "alto" },
    2: { primitiva: "fileira", micro: "aditiva-ampla", andaime: "medio" },
    3: { primitiva: "fileira", micro: "aditiva-decrescente", andaime: "minimo" },
    4: { primitiva: "fileira", micro: "lacuna-meio", andaime: "minimo" },
    5: { primitiva: "fileira", micro: "multiplicativa", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "aditiva-curta", fonte: "F57", alvo: "descobrir e aplicar uma regra constante de mais um ou mais dois vendo os arcos do passo", kinds: ["fileira", "numberline"], params: { apoio: "numberline", tutorial: coreografia }, dominio },
    { id: "aditiva-ampla", fonte: "F57", alvo: "generalizar a regra aditiva para passos de três, cinco ou dez verificando todos os pares", kinds: ["fileira", "numberline"], params: { apoio: "numberline" }, dominio },
    { id: "aditiva-decrescente", fonte: "F57", alvo: "reconhecer que a mesma regra também pode diminuir a sequência", kinds: ["fileira"], params: {}, dominio },
    { id: "lacuna-meio", fonte: "F57", alvo: "descobrir a regra e aplicá-la dos dois lados de uma lacuna intermediária", kinds: ["fileira"], params: {}, dominio },
    { id: "multiplicativa", fonte: "F57", alvo: "distinguir uma regra multiplicativa de uma soma sugerida apenas pelo último par", kinds: ["fileira"], params: {}, dominio },
  ],
  erros_tipicos: [
    { id: RegraSequenciaMisconception.SO_ULTIMO_PAR, descricao: "Usa apenas os dois últimos termos e não verifica a regra em todos os pares." },
    { id: RegraSequenciaMisconception.SOMA_QUANDO_MULTIPLICA, descricao: "Interpreta uma sequência multiplicativa como se o último aumento fosse uma soma fixa." },
    { id: RegraSequenciaMisconception.IGNORA_DIRECAO, descricao: "Mantém a ideia de somar quando a sequência está diminuindo." },
  ],
};
