import { FichaCompetencia } from "../../schema";

/**
 * F37 — A CENTENA. A mesma regra de agrupamento, um nível acima.
 *
 * Dez cubinhos viram barra; dez barras viram placa. É literalmente o mesmo
 * movimento da dezena, e quem entendeu o primeiro agrupamento entende o segundo
 * em minutos.
 *
 * **Quem não entendeu trava aqui — e o problema é lá atrás, não aqui.** É por
 * isso que o erro `NAO_AGRUPA_DEZENAS` tem nome próprio: ele não diz "errou a
 * centena", diz "a dezena não está firme", e o resgate correto é para a N2.01,
 * não mais exercício desta ficha.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

const tutorial = [
  { fala: "Dez cubinhos fazem uma barra.", show: { agrupar: "dezena" } },
  { fala: "E dez barras fazem uma placa.", show: { agrupar: "centena" } },
  { fala: "Cada placa vale cem.", show: { destacarOrdem: "centenas" } },
];

export const N2_04: FichaCompetencia = {
  id: "N2.04",
  nome: "A Centena",
  strand: "N2",
  faixa: "F2",
  prereqs: ["N2.02", "N2.01"],

  howto: "Conte as placas, depois as barras, depois os cubinhos.",
  explain: "Cada placa vale cem, cada barra vale dez, cada cubinho vale um.",

  distratores: [
    { regra: "soma_ordens_diferentes", tag: "IGNORA_VALOR" },
    { regra: "le_de_tras_para_frente", tag: "INVERTE_ORDENS" },
    { regra: "dez_barras_sem_virar_placa", tag: "NAO_AGRUPA_DEZENAS" },
  ],

  niveis: {
    1: { primitiva: "tens", micro: "agrupar-ate-199", andaime: "mao_fantasma" },
    2: { primitiva: "tens", micro: "ate-500", andaime: "alto" },
    3: { primitiva: "tens", micro: "ate-999", andaime: "medio" },
    4: { primitiva: "tens", micro: "ler-e-montar", andaime: "minimo" },
    5: { primitiva: "tens", micro: "decompor", andaime: "nenhum", rt_alvo: 15000 },
  },

  micros: [
    { id: "agrupar-ate-199", fonte: "F37", alvo: "ler o material com uma placa e reconhecer a centena", kinds: ["tens"], params: { tutorial }, dominio },
    { id: "ate-500", fonte: "F37", alvo: "ler o material com até cinco placas", kinds: ["tens"], params: {}, dominio },
    { id: "ate-999", fonte: "F37", alvo: "ler o material nas três ordens até novecentos e noventa e nove", kinds: ["tens"], params: {}, dominio },
    { id: "ler-e-montar", fonte: "F37", alvo: "partir do numeral e decidir quantas placas montar", kinds: ["tens"], params: {}, dominio },
    { id: "decompor", fonte: "F37", alvo: "decompor o numeral em centenas, dezenas e unidades sem o material", kinds: ["tens"], params: {}, dominio },
  ],

  erros_tipicos: [
    { id: "ignora_valor", descricao: "Soma placas com cubinhos como se fossem a mesma coisa." },
    { id: "inverte_ordens", descricao: "Lê 347 como 743: troca as ordens de ponta a ponta." },
    { id: "nao_agrupa_dezenas", descricao: "Dez barras não viram placa. O problema está na dezena, não na centena." },
  ],
};
