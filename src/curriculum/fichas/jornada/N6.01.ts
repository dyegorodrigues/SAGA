import { FichaCompetencia, FichaDominio } from "../../schema";
import { DecimalMisconception } from "../../procedimentos/decimalContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Este mesmo quadro que antes mostrava cem agora vale um inteiro.", show: { rotularInteiro: 1 } },
  { fala: "Uma coluna vale um décimo. Uma casinha vale um centésimo.", show: { destacarColuna: true, destacarCelula: true } },
];

/** F75 — Décimos e Centésimos. */
export const N6_01: FichaCompetencia = {
  id: "N6.01",
  nome: "Décimos e Centésimos",
  strand: "N6",
  faixa: "F3",
  prereqs: ["N5.02", "N2.04"],
  howto: "O quadrado inteiro é um. Cada coluna é um décimo. Cada quadradinho, um centésimo.",
  explain: "Conte as colunas ou as casinhas pintadas e leia o valor pela posição decimal, não como um número inteiro depois da vírgula.",
  distratores: [
    { regra: "compara os algarismos depois da vírgula como inteiros", tag: DecimalMisconception.DECIMAL_COMO_INTEIRO },
    { regra: "lê o decimal sem valor posicional", tag: DecimalMisconception.SEM_VALOR_POSICIONAL },
    { regra: "confunde décimos com centésimos", tag: DecimalMisconception.ORDEM_TROCADA },
  ],
  niveis: {
    1: { primitiva: "quadrado100", micro: "decimos", andaime: "alto" },
    2: { primitiva: "quadrado100", micro: "centesimos", andaime: "medio" },
    3: { primitiva: "quadrado100", micro: "fracao-decimal", andaime: "minimo" },
    4: { primitiva: "quadrado100", micro: "comparar", andaime: "minimo" },
    5: { primitiva: "quadrado100", micro: "ordenar", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "decimos", fonte: "F75", alvo: "reler colunas do Quadrado100 como décimos do inteiro", kinds: ["quadrado100"], params: { tutorial }, dominio },
    { id: "centesimos", fonte: "F75", alvo: "reler células do Quadrado100 como centésimos do inteiro", kinds: ["quadrado100"], params: { tutorial }, dominio },
    { id: "fracao-decimal", fonte: "F75", alvo: "reconhecer fração e decimal como duas notações da mesma região", kinds: ["quadrado100"], params: { tutorial }, dominio },
    { id: "comparar", fonte: "F75", alvo: "comparar decimais pela quantidade de inteiro que representam", kinds: ["quadrado100"], params: {}, dominio },
    { id: "ordenar", fonte: "F75", alvo: "ordenar decimais pelo valor na reta", kinds: ["quadrado100"], params: {}, dominio },
  ],
  erros_tipicos: [
    { id: DecimalMisconception.DECIMAL_COMO_INTEIRO, descricao: "Compara 25 com 5 e conclui que 0,25 é maior que 0,5." },
    { id: DecimalMisconception.SEM_VALOR_POSICIONAL, descricao: "Lê os algarismos sem entender décimos e centésimos." },
    { id: DecimalMisconception.ORDEM_TROCADA, descricao: "Troca o valor de uma coluna pelo de uma célula." },
  ],
};
