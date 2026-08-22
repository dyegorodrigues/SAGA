import type { FichaCompetencia, FichaDominio } from "../../schema";
import { Evidencia } from "../../../constants/evidencias";
import { MultiplicarFracoesMisconception } from "../../../constants/multiplicarFracoesMisconceptions";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const dominioFracaoPorFracao: FichaDominio = {
  ...dominio,
  exige: {
    evidencia: Evidencia.FRACAO_VEZES_FRACAO_F86,
    descricao: "resolver corretamente ao menos uma multiplicação de fração por fração usando a interseção de áreas",
  },
};
const acessibilidade = { toqueAlternativo: true, semArrastoObrigatorio: true, alvoMinPx: 80, erroMotorNaoTag: true };
const tutorial = [
  { say: "Você já usou este chão quadriculado para medir área. Agora vamos pintar uma fração dele.", show: { alfabetizarModo: "arraygrid-area", destacar: "particao" }, sync: "junto" },
  { say: "Multiplicar por uma fração significa pegar uma parte: metade de oito é quatro, então um meio vezes oito também é quatro.", show: { destacar: "de", exemplo: "1/2 de 8 = 1/2 × 8 = 4" }, sync: "junto" },
  { say: "Quando são duas frações, uma pintura vem numa direção e a outra cruza na outra direção. A interseção é o produto.", show: { destacar: "intersecao", cruzarPinturas: true }, sync: "depois" },
];

/** F86 — multiplicação/divisão de frações como área e medida, não como regra mecânica. */
export const N5_05: FichaCompetencia = {
  id: "N5.05",
  nome: "Multiplicar Frações",
  strand: "N5",
  faixa: "F4",
  prereqs: ["N5.04", "N6.04"],
  dominioNumerico: "racionais",
  howto: "Leia × como 'de'. Pinte uma fração e depois a outra; a parte que se cruza é o produto.",
  explain: "Multiplicar nem sempre aumenta: tomar uma fração de uma quantidade pode diminuí-la. Na área, a interseção mostra exatamente quanto ficou.",
  distratores: [
    { regra: "espera que todo produto seja maior que os fatores", tag: MultiplicarFracoesMisconception.MULTIPLICAR_AUMENTA },
    { regra: "soma numeradores e denominadores em vez de multiplicar", tag: MultiplicarFracoesMisconception.SOMA_EM_VEZ_DE_MULTIPLICAR },
    { regra: "espera que toda divisão torne a quantidade menor", tag: MultiplicarFracoesMisconception.DIVIDIR_DIMINUI },
  ],
  niveis: {
    1: { primitiva: "arraygrid", micro: "fracao-inteiro", andaime: "alto" },
    2: { primitiva: "arraygrid", micro: "fracao-inteiro-modelo", andaime: "medio" },
    3: { primitiva: "arraygrid", micro: "fracao-fracao-area", andaime: "medio" },
    4: { primitiva: "arraygrid", micro: "fracao-fracao-simbolico", andaime: "minimo" },
    5: { primitiva: "arraygrid", micro: "divisao-fracoes", andaime: "nenhum", rt_alvo: 22000 },
  },
  micros: [
    { id: "fracao-inteiro", fonte: "F86", alvo: "interpretar multiplicação por fração como tomar uma parte de uma quantidade inteira", kinds: ["arraygrid"], params: { modo: "fracao-inteiro", visualizacao: "área", tutorial, acessibilidade }, dominio },
    { id: "fracao-inteiro-modelo", fonte: "F86", alvo: "calcular fração de um inteiro por partição em grupos iguais no modelo de área", kinds: ["arraygrid"], params: { modo: "fracao-inteiro-modelo", visualizacao: "área", tutorial, acessibilidade }, dominio },
    { id: "fracao-fracao-area", fonte: "F86", alvo: "multiplicar fração por fração como interseção de duas partições do mesmo inteiro", kinds: ["arraygrid"], params: { modo: "fracao-fracao-area", visualizacao: "área", tutorial, acessibilidade }, dominio: dominioFracaoPorFracao },
    { id: "fracao-fracao-simbolico", fonte: "F86", alvo: "generalizar produto de frações multiplicando numeradores e denominadores sem depender da área preenchida", kinds: ["arraygrid"], params: { modo: "fracao-fracao-simbolico", visualizacao: "área", tutorial, acessibilidade }, dominio },
    { id: "divisao-fracoes", fonte: "F86", alvo: "interpretar divisão por fração como quantas partes desse tamanho cabem na quantidade", kinds: ["arraygrid"], params: { modo: "divisao-fracoes", visualizacao: "área", tutorial, acessibilidade }, dominio },
  ],
  erros_tipicos: [
    { id: MultiplicarFracoesMisconception.MULTIPLICAR_AUMENTA, descricao: "Supõe que multiplicar sempre aumenta e rejeita um produto menor que o inteiro inicial." },
    { id: MultiplicarFracoesMisconception.SOMA_EM_VEZ_DE_MULTIPLICAR, descricao: "Soma numeradores e denominadores quando a situação exige multiplicar as duas frações." },
    { id: MultiplicarFracoesMisconception.DIVIDIR_DIMINUI, descricao: "Supõe que dividir sempre diminui e não interpreta quantas frações cabem no todo." },
  ],
};
