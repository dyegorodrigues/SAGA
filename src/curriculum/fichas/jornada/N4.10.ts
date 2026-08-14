import { FichaCompetencia } from "../../schema";

/** F69 — Divisão Longa: concreto → ponte → algoritmo, sem decorar passos cegos. */
const dominio = { acertos: 4, de: 4, sessoes: 3 };

export const N4_10: FichaCompetencia = {
  id: "N4.10",
  nome: "Divisão com resto e algoritmo",
  strand: "N4",
  faixa: "F3",
  prereqs: ["N4.06", "N4.05", "N3.12"],
  howto: "Vá tirando grupos grandes primeiro. Cem grupos de seis são seiscentos.",
  explain: "Quantos grupos de seis cabem no que sobrou?",
  distratores: [
    { regra: "zero_pulado", tag: "zero-pulado-no-quociente" },
    { regra: "ordem_invertida", tag: "ordem-invertida-na-divisao" },
    { regra: "resto_invalido", tag: "resto-maior-ou-igual-divisor" },
    { regra: "nao_baixou", tag: "nao-baixou-proximo-algarismo" },
  ],
  niveis: {
    1: { primitiva: "arraygrid", micro: "arranjo_exato", andaime: "alto" },
    2: { primitiva: "arraygrid", micro: "arranjo_resto", andaime: "alto" },
    3: { primitiva: "vertical", micro: "ponte_algoritmo", andaime: "medio" },
    4: { primitiva: "vertical", micro: "algoritmo", andaime: "minimo" },
    5: { primitiva: "vertical", micro: "zero_quociente", andaime: "nenhum", rt_alvo: 25000 },
  },
  micros: [
    { id: "arranjo_exato", alvo: "retirar grupos grandes de uma divisão exata usando o retângulo", kinds: ["arraygrid"], params: { revelacaoProgressiva: true }, dominio },
    { id: "arranjo_resto", alvo: "reconhecer que o resto precisa ser menor que o divisor", kinds: ["arraygrid"], params: { revelacaoProgressiva: true }, dominio },
    { id: "ponte_algoritmo", alvo: "ligar as retiradas do retângulo às linhas da divisão armada", kinds: ["vertical"], params: { revelacaoProgressiva: true }, dominio },
    { id: "algoritmo", alvo: "dividir da esquerda para a direita estimando, multiplicando, subtraindo e baixando", kinds: ["vertical"], params: { revelacaoProgressiva: true }, dominio },
    { id: "zero_quociente", alvo: "preservar a posição com zero quando nenhuma vez cabe naquela ordem", kinds: ["vertical"], params: { revelacaoProgressiva: true, exigeEvidencia: "divisao-zero-quociente-nivel-5" }, dominio },
  ],
  erros_tipicos: [
    { id: "zero-pulado-no-quociente", descricao: "Pulou uma posição vazia e apagou o zero necessário no quociente." },
    { id: "ordem-invertida-na-divisao", descricao: "Tentou iniciar a divisão pela ordem errada." },
    { id: "resto-maior-ou-igual-divisor", descricao: "Aceitou um resto que ainda comporta outro grupo do divisor." },
    { id: "nao-baixou-proximo-algarismo", descricao: "Não trouxe a próxima ordem antes de continuar o algoritmo." },
  ],
};
