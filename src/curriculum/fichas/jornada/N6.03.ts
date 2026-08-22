import { FichaCompetencia, FichaDominio } from "../../schema";
import { PorcentagemMisconception } from "../../procedimentos/porcentagemContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "O quadrado inteiro vale cem por cento.", show: { destacarInteiro: true } },
  { fala: "Por cento quer dizer de cada cem.", show: { ligarCem: true } },
];

/** F87 — Porcentagem: quatro notações, uma mesma quantidade. */
export const N6_03: FichaCompetencia = {
  id: "N6.03",
  nome: "Porcentagem",
  strand: "N6",
  faixa: "F4",
  prereqs: ["N6.01", "N5.03"],
  howto: "Por cento significa 'de cada cem'. Conte quantos quadradinhos de 100 estão pintados.",
  explain: "Metade do quadrado são 50 quadradinhos. Isso é 50 por cento.",
  distratores: [
    { regra: "trata a porcentagem como um número inteiro numa soma ou subtração", tag: PorcentagemMisconception.PORCENTO_COMO_NUMERO },
    { regra: "subtrai o número do desconto em vez de calcular a porcentagem", tag: PorcentagemMisconception.DESCONTO_ABSOLUTO },
    { regra: "não reconhece porcentagem, fração e decimal como notações equivalentes", tag: PorcentagemMisconception.NOTACOES_SEPARADAS },
  ],
  niveis: {
    1: { primitiva: "quadrado100", micro: "parte-de-cem", andaime: "alto" },
    2: { primitiva: "quadrado100", micro: "ancoras", andaime: "medio" },
    3: { primitiva: "storypanel", micro: "percentual-de", andaime: "minimo" },
    4: { primitiva: "storypanel", micro: "desconto-acrescimo", andaime: "minimo" },
    5: { primitiva: "storypanel", micro: "percentual-inverso", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "parte-de-cem", fonte: "F87", alvo: "ler a parte pintada de um quadro de cem como porcentagem", kinds: ["quadrado100"], params: { tutorial }, dominio },
    { id: "ancoras", fonte: "F87", alvo: "reconhecer 10%, 25%, 50% e 75% como âncoras visuais e fracionárias", kinds: ["quadrado100"], params: { tutorial }, dominio },
    { id: "percentual-de", fonte: "F87", alvo: "calcular uma porcentagem de uma quantidade por decomposição visual", kinds: ["storypanel"], params: { suporte: "SingaporeBars", tutorial }, dominio },
    { id: "desconto-acrescimo", fonte: "F87", alvo: "aplicar desconto ou acréscimo percentual sem tratar % como quantidade absoluta", kinds: ["storypanel"], params: { suporte: "SingaporeBars" }, dominio },
    { id: "percentual-inverso", fonte: "F87", alvo: "recuperar o inteiro quando uma porcentagem dele é conhecida", kinds: ["storypanel"], params: { suporte: "SingaporeBars" }, dominio },
  ],
  erros_tipicos: [
    { id: PorcentagemMisconception.PORCENTO_COMO_NUMERO, descricao: "Trata 50% como o inteiro 50 numa operação comum." },
    { id: PorcentagemMisconception.DESCONTO_ABSOLUTO, descricao: "Interpreta 25% de desconto como tirar 25 unidades." },
    { id: PorcentagemMisconception.NOTACOES_SEPARADAS, descricao: "Não relaciona porcentagem com fração e decimal equivalentes." },
  ],
};
