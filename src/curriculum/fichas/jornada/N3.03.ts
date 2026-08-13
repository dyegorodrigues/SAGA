import { FichaCompetencia } from "../../schema";
import { CountingOnMisconception } from "../../procedimentos/countingOnSemantics";

/** F14 — Contar a partir do maior. Counting on como estratégia observável. */
export const N3_03: FichaCompetencia = {
  id: "N3.03",
  nome: "Contar a partir do maior (counting on)",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N3.01", "N1.09", "N2.03"],

  howto: "O número maior já está pronto. Não precisa contar de novo. Agora conte só o que falta.",
  explain: "Não conte tudo de novo. Comece do número maior e dê os pulos que faltam.",
  distratores: [
    { regra: "recontar desde 1", tag: CountingOnMisconception.CONTA_TUDO },
    { regra: "começar pela parcela menor", tag: CountingOnMisconception.NAO_ESCOLHE_MAIOR },
    { regra: "contar o ponto de partida como um salto", tag: CountingOnMisconception.OFF_BY_ONE },
    { regra: "depender da reta depois da retirada do apoio", tag: CountingOnMisconception.DEPENDE_DA_RETA },
  ],

  niveis: {
    1: { primitiva: "numberline", micro: "trem_reta_guiado", andaime: "mao_fantasma" },
    2: { primitiva: "numberline", micro: "trem_reta", andaime: "alto" },
    3: { primitiva: "numberline", micro: "reta", andaime: "minimo" },
    4: { primitiva: "numberline", micro: "simbolo_reta_erro", andaime: "nenhum" },
    // O relógio continua silencioso e alimenta fluência; nunca compra domínio.
    5: { primitiva: "numberline", micro: "mental", andaime: "nenhum", rt_alvo: 6000 },
  },

  micros: [
    {
      id: "trem_reta_guiado",
      fonte: "F14",
      alvo: "confiar na parcela maior já conhecida e ligar cada cubo menor a um salto da reta",
      kinds: ["numberline"],
      params: {
        tutorial: [
          { fala: "Temos o bloco maior aqui.", show: { destacarBloco: "A", marcarPonto: "maior" }, sync: "junto" },
          { fala: "Ele já está pronto. Não precisa contar de novo.", show: { piscarNumeral: "maior" }, sync: "junto" },
          { fala: "Agora cada cubo do outro bloco vale um salto.", show: { demonstrarSalto: 1 }, sync: "junto" },
          { fala: "Mais um salto.", show: { demonstrarSalto: 2 }, sync: "junto" },
          { fala: "Continue até usar só os cubos que faltam.", show: { pulsarBlocoMenor: true }, sync: "depois" },
        ],
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "trem_reta",
      fonte: "F14",
      alvo: "escolher a maior parcela e produzir os saltos sincronizados sem Mão Fantasma",
      kinds: ["numberline"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "reta",
      fonte: "F14",
      alvo: "fazer counting on na reta sem cubos e com parcela menor de no máximo três",
      kinds: ["numberline"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "simbolo_reta_erro",
      fonte: "F14",
      alvo: "escolher mentalmente o ponto de partida; a reta só reaparece após erro",
      kinds: ["numberline"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "mental",
      fonte: "F14",
      alvo: "resolver mentalmente por counting on com parcela menor de no máximo três",
      kinds: ["numberline"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    { id: CountingOnMisconception.CONTA_TUDO, descricao: "Recomeça a contagem no 1 e não confia na quantidade já dada." },
    { id: CountingOnMisconception.NAO_ESCOLHE_MAIOR, descricao: "Começa pela parcela menor e usa um caminho desnecessariamente longo." },
    { id: CountingOnMisconception.OFF_BY_ONE, descricao: "Conta o ponto de partida como se já fosse um salto." },
    { id: CountingOnMisconception.DEPENDE_DA_RETA, descricao: "Acerta com a reta, mas ainda não internalizou a estratégia sem apoio visual." },
  ],
};
