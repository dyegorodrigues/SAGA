import { FichaCompetencia } from "../../schema";

/**
 * F33 — FAZER DEZ. A estratégia-rainha em ação.
 *
 * É onde os amigos do dez, aprendidos na N1.11, **deixam de ser exercício e
 * viram ferramenta**. Sem esta estratégia, toda soma acima de dez é contagem
 * nos dedos, pela vida inteira. A ficha canônica a chama de a mais importante
 * da faixa F1, e não é exagero de redação: é a primeira operação de múltiplos
 * passos do currículo.
 *
 * `8 + 5` vira `8 + 2 + 3`, que vira `10 + 3`. Três passos mentais encadeados:
 * quanto falta para dez, quebrar a segunda parcela, somar o resto.
 *
 * O domínio é rigoroso de propósito — quatro de quatro, três sessões, como os
 * próprios amigos do dez. Esta estratégia precisa virar automática.
 */
const dominio = { acertos: 4, de: 4, sessoes: 3 };

const tutorial = [
  { fala: "Temos oito na caixa.", show: { preencherAte: 8 } },
  { fala: "Faltam dois pra fechar.", show: { piscarVazias: true } },
  { fala: "Vou colocar dois...", show: { maoFantasma: [8, 9] } },
  { fala: "Fechou! Dez!", show: { fecharMoldura: 1, numeral: 10 } },
  { fala: "E ainda sobrou o resto da bandeja.", show: { destacarBandeja: true } },
];

export const N3_07: FichaCompetencia = {
  id: "N3.07",
  nome: "Fazer Dez",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N1.11", "N1.10", "N2.01"],

  howto: "Complete os dez primeiro. Depois some o que sobrou.",
  explain: "Quantos faltam para fechar a caixa? Use esses primeiro.",

  distratores: [
    { regra: "para_no_fechamento", tag: "PAROU_NO_DEZ" },
    { regra: "amigo_do_dez_errado", tag: "DECOMPOSICAO_ERRADA" },
    { regra: "conta_torto", tag: "OFF_BY_ONE" },
  ],

  niveis: {
    1: {
      primitiva: "tenframe",
      micro: "sobra-pouca",
      andaime: "mao_fantasma",
      acaoProbatoria: {
        id: "fechar-a-caixa",
        porque: "A ficha existe para que a criança feche o dez antes de somar o resto. Aceitar o total sem isso mede soma, não a estratégia — e convida ao NAO_FAZ_DEZ, que é o erro-alvo.",
      },
    },
    2: {
      primitiva: "tenframe",
      micro: "moldura-e-bandeja",
      andaime: "alto",
      acaoProbatoria: {
        id: "fechar-a-caixa",
        porque: "Com sobra maior, quebrar a parcela deixa de ser trivial: é fechando a caixa que a criança vê onde a segunda parcela se parte.",
      },
    },
    3: {
      primitiva: "tenframe",
      micro: "sem-decomposicao-escrita",
      andaime: "medio",
      acaoProbatoria: {
        id: "fechar-a-caixa",
        porque: "Sem a decomposição escrita, fechar a caixa é a única demonstração de que a criança encontrou o amigo do dez sozinha.",
      },
    },
    4: { primitiva: "tenframe", micro: "so-decomposicao", andaime: "minimo" },
    5: { primitiva: "tenframe", micro: "mental", andaime: "nenhum", rt_alvo: 10000 },
  },

  micros: [
    { id: "sobra-pouca", fonte: "F33", alvo: "fechar a caixa quando sobra pouco da segunda parcela", kinds: ["tenframe"], params: { tutorial }, dominio },
    { id: "moldura-e-bandeja", fonte: "F33", alvo: "quebrar a segunda parcela entre as duas caixas", kinds: ["tenframe"], params: {}, dominio },
    { id: "sem-decomposicao-escrita", fonte: "F33", alvo: "achar o amigo do dez sem a decomposição escrita na tela", kinds: ["tenframe"], params: {}, dominio },
    { id: "so-decomposicao", fonte: "F33", alvo: "aplicar a estratégia com a decomposição escrita e sem as caixas", kinds: ["tenframe"], params: {}, dominio },
    { id: "mental", fonte: "F33", alvo: "fazer dez de cabeça, sem caixas nem decomposição escrita", kinds: ["tenframe"], params: {}, dominio },
  ],

  erros_tipicos: [
    { id: "parou_no_dez", descricao: "Responde dez: fechou a caixa e esqueceu o resto da parcela." },
    { id: "nao_faz_dez", descricao: "Conta tudo do início, sem usar a estratégia. É o alvo da ficha." },
    { id: "decomposicao_errada", descricao: "Erra o amigo do dez e quebra a parcela no lugar errado." },
    { id: "off_by_one", descricao: "Estratégia certa, contagem torta por um." },
  ],
};
