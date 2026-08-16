import type { FichaCompetencia } from "../../schema";

const dominio = { acertos: 3, de: 3, sessoes: 2 } as const;
const tutorial = [
  { fala: "A quantidade física continua igual quando trocamos a unidade usada para medi-la.", show: { preservarQuantidade: true, alinharEscalas: true } },
  { fala: "Se a unidade de destino é menor, precisamos de mais unidades; se é maior, precisamos de menos.", show: { compararTamanhoDasUnidades: true, destacarDirecaoDaConversao: true } },
];

export const GM_10: FichaCompetencia = {
  id: "GM.10", nome: "Conversão de unidades", strand: "GM", faixa: "F4", prereqs: ["GM.05", "N2.04"],
  howto: "Unidade menor: você precisa de mais delas. Unidade maior: menos.",
  explain: "A quantidade é a mesma. Só o nome e o número mudam.",
  distratores: [
    { regra: "Multiplica quando deveria dividir, ou divide quando deveria multiplicar.", tag: "inverte-operacao" },
    { regra: "Converte entre grandezas diferentes como se fossem equivalentes.", tag: "mistura-grandezas" },
    { regra: "Ignora a parte decimal ao mudar a escala da unidade.", tag: "ignora-decimal" },
  ],
  niveis: {
    1: { primitiva: "numberline", micro: "a", andaime: "alto" }, 2: { primitiva: "balanca", micro: "b", andaime: "alto" },
    3: { primitiva: "numberline", micro: "c", andaime: "medio" }, 4: { primitiva: "balanca", micro: "d", andaime: "minimo" },
    5: { primitiva: "numberline", micro: "e", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "a", alvo: "Converter centímetros e metros em escalas alinhadas.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "cm-m" }, dominio: { ...dominio } },
    { id: "b", alvo: "Converter massa e capacidade preservando a grandeza.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "massa-capacidade" }, dominio: { ...dominio } },
    { id: "c", alvo: "Converter medidas com decimais.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "decimal" }, dominio: { ...dominio } },
    { id: "d", alvo: "Escolher uma unidade adequada à quantidade medida.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "unidade-adequada" }, dominio: { ...dominio } },
    { id: "e", alvo: "Resolver problemas com conversão embutida.", kinds: ["numberline", "balanca"], params: { tutorial, modo: "problema" }, dominio: { ...dominio } },
  ],
  erros_tipicos: [
    { id: "inverte-operacao", descricao: "Inverte a direção da conversão entre unidade maior e menor." },
    { id: "mistura-grandezas", descricao: "Mistura comprimento, massa ou capacidade numa conversão inválida." },
    { id: "ignora-decimal", descricao: "Perde a parte decimal ao escalar a medida." },
  ],
};
