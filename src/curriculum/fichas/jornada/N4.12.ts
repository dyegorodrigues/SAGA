import type { FichaCompetencia, FichaDominio } from "../../schema";
import { DivisaoDoisDigitosMisconception } from "../../../constants/divisaoDoisDigitosMisconceptions";
import { Evidencia } from "../../../constants/evidencias";

const dominio: FichaDominio = { acertos: 4, de: 4, sessoes: 3 };
const dominioComAjuste: FichaDominio = {
  ...dominio,
  exige: {
    evidencia: Evidencia.AJUSTE_PRIMEIRA_ESTIMATIVA_F71,
    descricao: "ajustar pelo menos uma primeira estimativa depois da multiplicação de teste",
  },
};
const acessibilidade = { toqueAlternativo: true, snapGeneroso: true, alvoMinPx: 80, erroMotorNaoTag: true };
const tutorialEstimativa = [
  { say: "Antes de dividir, arredonde o divisor para ter uma estimativa de quantos grupos cabem.", show: { foco: "InteractiveVertical", alfabetizarModo: "estimativa" }, sync: "junto" },
  { say: "Escreva a estimativa no rascunho e multiplique pelo divisor real para testar.", show: { destacarRascunho: true }, sync: "junto" },
  { say: "Se o produto passou, diminua. Se ainda cabe outro grupo, aumente. Ajustar faz parte da divisão.", show: { destacarAjuste: true }, sync: "depois" },
];

/** F71 — estimar, testar por multiplicação e ajustar o quociente em divisões por dois dígitos. */
export const N4_12: FichaCompetencia = {
  id: "N4.12",
  nome: "Dividir por Dois Dígitos",
  strand: "N4",
  faixa: "F3",
  prereqs: ["N4.10", "N2.04"],
  howto: "Arredonde o divisor para estimar. Depois teste e ajuste.",
  explain: "Multiplique sua estimativa e veja se cabe. Se passar, diminua.",
  distratores: [
    { regra: "pula a estimativa e tenta adivinhar o quociente sem referência", tag: DivisaoDoisDigitosMisconception.NAO_ESTIMA },
    { regra: "mantém a primeira estimativa mesmo depois de o produto mostrar que precisa mudar", tag: DivisaoDoisDigitosMisconception.NAO_AJUSTA },
    { regra: "aceita resto que ainda comporta outro divisor", tag: DivisaoDoisDigitosMisconception.RESTO_INVALIDO },
  ],
  niveis: {
    1: { primitiva: "vertical", micro: "divisor-redondo", andaime: "alto" },
    2: { primitiva: "vertical", micro: "divisor-quase-redondo", andaime: "alto" },
    3: { primitiva: "vertical", micro: "divisor-geral", andaime: "medio" },
    4: { primitiva: "vertical", micro: "com-resto", andaime: "minimo" },
    5: { primitiva: "vertical", micro: "zero-quociente", andaime: "nenhum", rt_alvo: 30000 },
  },
  micros: [
    { id: "divisor-redondo", fonte: "F71", alvo: "estimar quociente quando o divisor já é uma dezena redonda e validar por multiplicação", kinds: ["vertical"], params: { modo: "divisor-redondo", tutorial: tutorialEstimativa, acessibilidade }, dominio },
    { id: "divisor-quase-redondo", fonte: "F71", alvo: "arredondar 19/21, testar a primeira estimativa com o divisor real e ajustá-la", kinds: ["vertical"], params: { modo: "divisor-quase-redondo", tutorial: tutorialEstimativa, acessibilidade }, dominio: dominioComAjuste },
    { id: "divisor-geral", fonte: "F71", alvo: "estimar e ajustar quociente com qualquer divisor de dois dígitos", kinds: ["vertical"], params: { modo: "divisor-geral", tutorial: tutorialEstimativa, acessibilidade }, dominio },
    { id: "com-resto", fonte: "F71", alvo: "concluir divisão por dois dígitos mantendo resto menor que o divisor", kinds: ["vertical"], params: { modo: "com-resto", tutorial: tutorialEstimativa, acessibilidade }, dominio },
    { id: "zero-quociente", fonte: "F71", alvo: "preservar o zero posicional no quociente enquanto estima e testa cada ordem", kinds: ["vertical"], params: { modo: "zero-quociente", tutorial: tutorialEstimativa, acessibilidade }, dominio },
  ],
  erros_tipicos: [
    { id: DivisaoDoisDigitosMisconception.NAO_ESTIMA, descricao: "Tentou dividir sem criar uma estimativa orientada pelo divisor arredondado." },
    { id: DivisaoDoisDigitosMisconception.NAO_AJUSTA, descricao: "O produto de teste mostrou excesso ou folga, mas a primeira estimativa não foi ajustada." },
    { id: DivisaoDoisDigitosMisconception.RESTO_INVALIDO, descricao: "Aceitou resto maior ou igual ao divisor, embora ainda coubesse outro grupo." },
  ],
};
