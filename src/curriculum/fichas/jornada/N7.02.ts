import { FichaCompetencia, FichaDominio } from "../../schema";
import { OperarNegativosMisconception } from "../../procedimentos/operarNegativosContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Comece no primeiro número e use o sinal da operação para decidir o movimento.", show: { destacarZero: true } },
  { fala: "Somar um negativo é caminhar para a esquerda; somar um positivo é caminhar para a direita.", show: { mostrarDirecao: true } },
];

/** F85 — Operar com Negativos: movimento na reta e significado de dívida/saldo. */
export const N7_02: FichaCompetencia = {
  id: "N7.02",
  nome: "Operar com Negativos",
  strand: "N7",
  faixa: "F4",
  prereqs: ["N7.01", "N3.13"],
  // A ficha opera no conjunto dos inteiros; sinais negativos são conteúdo, não ruído.
  dominioNumerico: "inteiros",
  howto: "Marque o primeiro número na reta. Positivo move para a direita; negativo move para a esquerda.",
  explain: "Pense em saldo e dívida. Somar uma dívida reduz o saldo; cancelar uma dívida aumenta o saldo.",
  distratores: [
    { regra: "ignora o sinal e opera apenas os valores absolutos", tag: OperarNegativosMisconception.IGNORA_SINAL },
    { regra: "move na direção contrária ao sinal da parcela", tag: OperarNegativosMisconception.DIRECAO_ERRADA },
    { regra: "trata subtrair um negativo como subtrair um positivo", tag: OperarNegativosMisconception.SUBTRAIR_NEGATIVO },
  ],
  niveis: {
    1: { primitiva: "numberline", micro: "soma-pos-neg", andaime: "alto" },
    2: { primitiva: "numberline", micro: "soma-neg-pos", andaime: "medio" },
    3: { primitiva: "numberline", micro: "dois-negativos", andaime: "medio" },
    4: { primitiva: "numberline", micro: "subtracao-negativo", andaime: "minimo" },
    5: { primitiva: "numberline", micro: "expressoes-mistas", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "soma-pos-neg", fonte: "F85", alvo: "somar um negativo a um positivo atravessando o zero quando necessário", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine", contexto: "saldo", tutorial }, dominio },
    { id: "soma-neg-pos", fonte: "F85", alvo: "somar um positivo partindo de um número negativo", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine", contexto: "saldo", tutorial }, dominio },
    { id: "dois-negativos", fonte: "F85", alvo: "somar duas quantidades negativas como duas dívidas sucessivas", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine", contexto: "divida" }, dominio },
    { id: "subtracao-negativo", fonte: "F85", alvo: "interpretar subtrair um negativo como cancelar uma dívida", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine", contexto: "divida" }, dominio },
    { id: "expressoes-mistas", fonte: "F85", alvo: "resolver expressões mistas com três ou mais operações em inteiros", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine" }, dominio },
  ],
  erros_tipicos: [
    { id: OperarNegativosMisconception.IGNORA_SINAL, descricao: "Ignora o sinal e usa apenas o valor absoluto." },
    { id: OperarNegativosMisconception.DIRECAO_ERRADA, descricao: "Move para o lado oposto ao indicado pela parcela." },
    { id: OperarNegativosMisconception.SUBTRAIR_NEGATIVO, descricao: "Não reconhece que retirar uma dívida aumenta o saldo." },
  ],
};
