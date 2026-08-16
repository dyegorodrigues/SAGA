import { FichaCompetencia, FichaDominio } from "../../schema";
import { LinguagemLetrasMisconception } from "../../procedimentos/linguagemLetrasContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "A caixa vazia já guardava um número. Agora vamos dar a ela um nome curto: n.", show: { transformarCaixa: "n" } },
  { fala: "Uma regra geral precisa funcionar para qualquer número. Teste em pelo menos dois casos.", show: { testarValores: true } },
];

/** F89 — A Linguagem das Letras: da caixa vazia à generalização algébrica. */
export const AL_07: FichaCompetencia = {
  id: "AL.07",
  nome: "A Linguagem das Letras",
  strand: "AL",
  faixa: "F4",
  prereqs: ["AL.06", "AL.04"],
  howto: "A letra guarda o lugar de qualquer número. Leia a regra e teste com valores diferentes.",
  explain: "A letra não é um objeto: é um lugar que pode receber números diferentes. Uma regra geral precisa funcionar nos casos testados.",
  distratores: [
    { regra: "trata a letra como nome do objeto do contexto", tag: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
    { regra: "responde usando apenas um valor particular da tabela", tag: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
    { regra: "descreve os exemplos sem produzir uma regra que valha para todos", tag: LinguagemLetrasMisconception.NAO_GENERALIZA },
  ],
  niveis: {
    1: { primitiva: "plain", micro: "caixa-vira-letra", andaime: "alto" },
    2: { primitiva: "plain", micro: "expressao-simples", andaime: "medio" },
    3: { primitiva: "plain", micro: "expressao-contexto", andaime: "medio" },
    4: { primitiva: "plain", micro: "regra-padrao", andaime: "minimo" },
    5: { primitiva: "plain", micro: "equivalencia-expressoes", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "caixa-vira-letra", fonte: "F89", alvo: "reconhecer a letra como a mesma lacuna que a caixa vazia já representava", kinds: ["plain"], params: { suporte: ["SingaporeBars", "plain"], tutorial }, dominio },
    { id: "expressao-simples", fonte: "F89", alvo: "escrever uma expressão simples que represente uma regra verbal", kinds: ["plain"], params: { suporte: ["SingaporeBars", "plain"], tutorial }, dominio },
    { id: "expressao-contexto", fonte: "F89", alvo: "ler uma expressão como relação entre quantidade variável e contexto", kinds: ["plain"], params: { suporte: ["SingaporeBars", "plain"], tutorial }, dominio },
    { id: "regra-padrao", fonte: "F89", alvo: "generalizar um padrão e testar a regra em pelo menos dois casos", kinds: ["plain"], params: { suporte: ["SingaporeBars", "plain"], tutorial }, dominio },
    { id: "equivalencia-expressoes", fonte: "F89", alvo: "reconhecer expressões diferentes que representam a mesma quantidade", kinds: ["plain"], params: { suporte: ["SingaporeBars", "plain"] }, dominio },
  ],
  erros_tipicos: [
    { id: LinguagemLetrasMisconception.LETRA_COMO_OBJETO, descricao: "Interpreta a letra como nome de um objeto, não como lugar de um número." },
    { id: LinguagemLetrasMisconception.SO_CASO_PARTICULAR, descricao: "Valida a regra em um exemplo isolado e confunde caso com generalização." },
    { id: LinguagemLetrasMisconception.NAO_GENERALIZA, descricao: "Continua descrevendo exemplos sem produzir uma regra para qualquer valor." },
  ],
};
