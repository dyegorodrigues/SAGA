import { FichaCompetencia, FichaDominio } from "../../schema";
import { RetaCompletaMisconception } from "../../procedimentos/retaCompletaContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "A reta continua para a esquerda do zero.", show: { estenderReta: -5 } },
  { fala: "À esquerda do zero, quanto mais longe, menor.", show: { destacarPonto: 0 } },
];

/** F84 — A Reta Completa: negativos como continuação da reta conhecida. */
export const N7_01: FichaCompetencia = {
  id: "N7.01",
  nome: "A Reta Completa",
  strand: "N7",
  faixa: "F4",
  prereqs: ["N1.12", "N3.04"],
  // O sinal é o conteúdo desta ficha: −3 é gabarito, não defeito de gerador.
  dominioNumerico: "inteiros",
  howto: "À esquerda do zero os números ficam menores. Quanto mais longe, menor.",
  explain: "Olhe o termômetro: menos cinco é mais frio que menos dois. Então é menor.",
  distratores: [
    { regra: "compara apenas os valores absolutos e ignora o sinal", tag: RetaCompletaMisconception.NEGATIVO_COMO_POSITIVO },
    { regra: "conta o zero como um passo na distância", tag: RetaCompletaMisconception.ZERO_COMO_PASSO },
    { regra: "coloca o negativo à direita do zero", tag: RetaCompletaMisconception.LADO_ERRADO },
  ],
  niveis: {
    1: { primitiva: "numberline", micro: "localizar", andaime: "alto" },
    2: { primitiva: "numberline", micro: "comparar-negativos", andaime: "medio" },
    3: { primitiva: "numberline", micro: "ordenar-mistos", andaime: "minimo" },
    4: { primitiva: "numberline", micro: "distancia", andaime: "minimo" },
    5: { primitiva: "numberline", micro: "modulo", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "localizar", fonte: "F84", alvo: "localizar números negativos à esquerda do zero", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine", contexto: "termometro", tutorial }, dominio },
    { id: "comparar-negativos", fonte: "F84", alvo: "comparar dois negativos pela posição na reta", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine", contexto: "termometro", tutorial }, dominio },
    { id: "ordenar-mistos", fonte: "F84", alvo: "ordenar positivos e negativos numa única reta", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine" }, dominio },
    { id: "distancia", fonte: "F84", alvo: "medir distância entre pontos que atravessam o zero", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine" }, dominio },
    { id: "modulo", fonte: "F84", alvo: "interpretar módulo como distância até o zero", kinds: ["numberline"], params: { suporte: "InteractiveNumberLine" }, dominio },
  ],
  erros_tipicos: [
    { id: RetaCompletaMisconception.NEGATIVO_COMO_POSITIVO, descricao: "Ignora o sinal ao comparar dois negativos." },
    { id: RetaCompletaMisconception.ZERO_COMO_PASSO, descricao: "Conta o zero como passo extra na distância." },
    { id: RetaCompletaMisconception.LADO_ERRADO, descricao: "Posiciona negativos no lado positivo da reta." },
  ],
};
