import type { FichaCompetencia, FichaDominio } from "../../schema";
import {
  EQUACOES_L3_MAIS_EVIDENCIA,
  EquacoesMisconception,
} from "../../../constants/equacoesMisconceptions";

const dominio: FichaDominio = { acertos: 4, de: 4, sessoes: 3 };
const dominioL3: FichaDominio = {
  ...dominio,
  exige: {
    evidencia: EQUACOES_L3_MAIS_EVIDENCIA,
    descricao: "um acerto em equação com coeficiente ou em nível algébrico mais avançado",
  },
};
const tutorial = [
  { fala: "Uma equação é uma balança: os dois lados começam com o mesmo valor.", show: { equilibrio: true, sacoX: true } },
  { fala: "Para continuar equilibrada, toda operação feita em um prato precisa acontecer no outro também.", show: { doisLados: true } },
];

/** F90 — Equações: isolar a incógnita preservando causalmente o equilíbrio. */
export const AL_08: FichaCompetencia = {
  id: "AL.08",
  nome: "Equações",
  strand: "AL",
  faixa: "F4",
  prereqs: ["AL.07", "N7.02"],
  dominioNumerico: "racionais",
  howto: "Leia os dois lados como pratos da mesma balança. Escolha a operação inversa e aplique exatamente a mesma transformação aos dois lados.",
  explain: "Resolver não é passar termo trocando sinal: é preservar uma igualdade enquanto desfazemos, passo a passo, as operações que escondem x.",
  distratores: [
    { regra: "faz transformações diferentes nos dois lados e destrói a igualdade", tag: EquacoesMisconception.QUEBRA_EQUILIBRIO },
    { regra: "escolhe a operação que reforça, em vez de desfazer, a operação junto de x", tag: EquacoesMisconception.OPERACAO_INVERSA_ERRADA },
    { regra: "aplica a transformação correta em apenas um lado", tag: EquacoesMisconception.NAO_APLICA_AOS_DOIS },
    { regra: "trata o total visível como se já fosse o valor da incógnita", tag: EquacoesMisconception.RESPONDE_O_TODO },
  ],
  niveis: {
    1: { primitiva: "balanca", micro: "soma", andaime: "alto" },
    2: { primitiva: "balanca", micro: "subtracao", andaime: "medio" },
    3: { primitiva: "balanca", micro: "multiplicacao", andaime: "medio" },
    4: { primitiva: "balanca", micro: "dois-passos", andaime: "minimo" },
    5: { primitiva: "balanca", micro: "incognita-dois-lados", andaime: "nenhum", rt_alvo: 24000 },
  },
  micros: [
    { id: "soma", fonte: "F90", alvo: "resolver x + a = b removendo a mesma quantidade dos dois lados", kinds: ["balanca"], params: { modo: "soma", tutorial }, dominio },
    { id: "subtracao", fonte: "F90", alvo: "resolver x - a = b usando a operação inversa nos dois lados", kinds: ["balanca"], params: { modo: "subtracao", tutorial }, dominio },
    { id: "multiplicacao", fonte: "F90", alvo: "resolver ax = b dividindo os dois lados pelo mesmo coeficiente", kinds: ["balanca"], params: { modo: "multiplicacao", tutorial }, dominio: dominioL3 },
    { id: "dois-passos", fonte: "F90", alvo: "resolver ax + b = c por duas transformações equivalentes sucessivas", kinds: ["balanca"], params: { modo: "dois-passos", tutorial }, dominio },
    { id: "incognita-dois-lados", fonte: "F90", alvo: "resolver uma equação com incógnita nos dois lados sem quebrar a igualdade", kinds: ["balanca"], params: { modo: "incognita-dois-lados" }, dominio },
  ],
  erros_tipicos: [
    { id: EquacoesMisconception.QUEBRA_EQUILIBRIO, descricao: "Mudou os dois lados de maneiras diferentes e deixou a balança inclinada." },
    { id: EquacoesMisconception.OPERACAO_INVERSA_ERRADA, descricao: "Aplicou aos dois lados uma operação que não desfaz a operação que envolve x." },
    { id: EquacoesMisconception.NAO_APLICA_AOS_DOIS, descricao: "Fez a transformação correta em apenas um prato da balança." },
    { id: EquacoesMisconception.RESPONDE_O_TODO, descricao: "Tomou o total visível de um lado como se fosse diretamente o valor de x." },
  ],
};
