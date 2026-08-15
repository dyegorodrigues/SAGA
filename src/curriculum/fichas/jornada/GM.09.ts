import type { FichaCompetencia } from "../../schema";

const dominio = { acertos: 3, de: 3, sessoes: 2 } as const;
const tutorial = {
  instruction: "Coloque as medidas na mesma unidade antes de comparar ou operar.",
  say: "A quantidade não muda quando a unidade muda; muda apenas o número usado para descrevê-la.",
};

export const GM_09: FichaCompetencia = {
  id: "GM.09",
  nome: "Conversões e problemas de medida",
  strand: "GM",
  faixa: "F3",
  prereqs: ["GM.05", "N4.08", "N6.01"],
  howto: "Primeiro transforme as medidas para a mesma unidade. Depois compare ou faça a operação pedida.",
  explain: "Converter não altera a quantidade medida. Um metro e cem centímetros descrevem o mesmo comprimento; um quilograma e mil gramas descrevem a mesma massa.",
  distratores: [
    { regra: "Compara os números antes de igualar as unidades.", tag: "compara-sem-converter" },
    { regra: "Multiplica quando deveria dividir, ou divide quando deveria multiplicar.", tag: "inverte-operacao" },
    { regra: "Opera medidas de grandezas/unidades diferentes como se fossem equivalentes.", tag: "mistura-grandezas" },
  ],
  niveis: {
    1: { primitiva: "numberline", micro: "a", andaime: "alto" },
    2: { primitiva: "balanca", micro: "b", andaime: "medio" },
    3: { primitiva: "numberline", micro: "c", andaime: "medio" },
    4: { primitiva: "numberline", micro: "d", andaime: "minimo" },
    5: { primitiva: "balanca", micro: "e", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "a", alvo: "Converter centímetros e metros preservando a mesma quantidade.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "converter-comprimento" }, dominio: { ...dominio } },
    { id: "b", alvo: "Converter massa e capacidade entre unidades usuais.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "converter-grandezas" }, dominio: { ...dominio } },
    { id: "c", alvo: "Comparar medidas somente depois de colocá-las na mesma unidade.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "comparar-apos-converter" }, dominio: { ...dominio } },
    { id: "d", alvo: "Operar medidas expressas inicialmente em unidades diferentes.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "operar-unidades-mistas" }, dominio: { ...dominio } },
    { id: "e", alvo: "Resolver problemas de medida com conversão e mais de uma etapa.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "problema-multietapa" }, dominio: { ...dominio } },
  ],
  erros_tipicos: [
    { id: "compara-sem-converter", descricao: "Compara valores numéricos antes de igualar as unidades." },
    { id: "inverte-operacao", descricao: "Inverte a direção da conversão." },
    { id: "mistura-grandezas", descricao: "Mistura unidades/grandezas incompatíveis na mesma operação." },
  ],
};
