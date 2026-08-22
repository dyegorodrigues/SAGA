import type { FichaCompetencia, FichaDominio } from "../../schema";
import { Evidencia } from "../../../constants/evidencias";
import { EstatisticaChanceMisconception } from "../../../constants/estatisticaChanceMisconceptions";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const dominioChanceFracao: FichaDominio = {
  ...dominio,
  exige: {
    evidencia: Evidencia.CHANCE_FRACAO_F95,
    descricao: "representar corretamente ao menos uma chance como fração dos casos favoráveis sobre o total",
  },
};
const acessibilidade = { toqueAlternativo: true, semArrastoObrigatorio: true, alvoMinPx: 80, erroMotorNaoTag: true };
const tutorial = [
  { say: "Primeiro conte todos os resultados que podem acontecer.", show: { destacar: "total" }, sync: "junto" },
  { say: "Depois conte quais desses resultados ajudam o evento pedido.", show: { destacar: "favoraveis" }, sync: "junto" },
  { say: "Chance compara favoráveis com o total. Em repetições independentes, o histórico não muda o próximo sorteio.", show: { destacar: "favoraveis-sobre-total" }, sync: "depois" },
];

/** F95 — chance como contagem de resultados, fração, frequência e independência. */
export const PE_04: FichaCompetencia = {
  id: "PE.04",
  nome: "Estatística e Chance",
  strand: "PE",
  faixa: "F4",
  prereqs: ["PE.03", "N6.03"],
  howto: "Conte o total de resultados e compare quantos são favoráveis; em eventos independentes, cada nova tentativa recomeça com a mesma chance.",
  explain: "Probabilidade compara casos favoráveis com todos os casos possíveis. Frequências podem oscilar no curto prazo, mas se aproximam da expectativa em muitas repetições.",
  distratores: [
    { regra: "acha que uma sequência anterior muda a chance do próximo evento independente", tag: EstatisticaChanceMisconception.FALACIA_APOSTADOR },
    { regra: "trata qualquer evento incerto como cinquenta por cento", tag: EstatisticaChanceMisconception.TUDO_CINQUENTA },
    { regra: "conta casos favoráveis sem comparar com o total", tag: EstatisticaChanceMisconception.IGNORA_TOTAL },
  ],
  niveis: {
    1: { primitiva: "storypanel", micro: "certo-possivel-impossivel", andaime: "alto" },
    2: { primitiva: "storypanel", micro: "mais-menos-provavel", andaime: "alto" },
    3: { primitiva: "storypanel", micro: "chance-fracao", andaime: "medio" },
    4: { primitiva: "storypanel", micro: "frequencia-independencia", andaime: "minimo" },
    5: { primitiva: "storypanel", micro: "contar-possibilidades", andaime: "nenhum", rt_alvo: 22000 },
  },
  micros: [
    { id: "certo-possivel-impossivel", fonte: "F95", alvo: "classificar eventos como certos, possíveis ou impossíveis", kinds: ["storypanel", "arraygrid"], params: { modo: "certo-possivel-impossivel", suporte: ["SingaporeBars", "ArrayGrid"], tutorial, acessibilidade }, dominio },
    { id: "mais-menos-provavel", fonte: "F95", alvo: "comparar eventos mais e menos prováveis pela relação entre favoráveis e total", kinds: ["storypanel", "arraygrid"], params: { modo: "mais-menos-provavel", suporte: ["SingaporeBars", "ArrayGrid"], tutorial, acessibilidade }, dominio },
    { id: "chance-fracao", fonte: "F95", alvo: "representar chance como fração dos casos favoráveis sobre o total", kinds: ["storypanel", "arraygrid"], params: { modo: "chance-fracao", suporte: ["SingaporeBars", "ArrayGrid"], tutorial, acessibilidade }, dominio: dominioChanceFracao },
    { id: "frequencia-independencia", fonte: "F95", alvo: "distinguir frequência observada de chance e reconhecer independência entre repetições", kinds: ["storypanel", "arraygrid"], params: { modo: "frequencia-independencia", suporte: ["SingaporeBars", "ArrayGrid"], tutorial, acessibilidade }, dominio },
    { id: "contar-possibilidades", fonte: "F95", alvo: "contar combinações possíveis por grade ou árvore de possibilidades", kinds: ["storypanel", "arraygrid"], params: { modo: "contar-possibilidades", suporte: ["SingaporeBars", "ArrayGrid"], tutorial, acessibilidade }, dominio },
  ],
  erros_tipicos: [
    { id: EstatisticaChanceMisconception.FALACIA_APOSTADOR, descricao: "Usou os resultados anteriores para mudar a chance de um próximo evento independente." },
    { id: EstatisticaChanceMisconception.TUDO_CINQUENTA, descricao: "Tratou um evento incerto como cinquenta por cento sem contar os resultados possíveis." },
    { id: EstatisticaChanceMisconception.IGNORA_TOTAL, descricao: "Contou somente os casos favoráveis e não os comparou com o total de resultados possíveis." },
  ],
};
