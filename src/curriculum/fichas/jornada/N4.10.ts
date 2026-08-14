import type { FichaCompetencia, FichaDominio } from "../../schema";
import { DivisaoLongaMisconception } from "../../procedimentos/divisaoLongaContract";

const dominio: FichaDominio = { acertos: 4, de: 4, sessoes: 3 };

/** F69 — Divisão Longa: concreto → ponte → algoritmo, com resto e zero no quociente. */
export const N4_10: FichaCompetencia = {
  id: "N4.10",
  nome: "Divisão Longa",
  strand: "N4",
  faixa: "F3",
  prereqs: ["N4.08", "N4.09"],
  howto: "Descubra quantos grupos cabem, registre o quociente e confira se o resto ficou menor que o divisor.",
  explain: "O algoritmo é o mesmo agrupamento que o arranjo mostra: dividir, multiplicar, subtrair e baixar o próximo algarismo sem pular posições.",
  distratores: [
    { regra: "pula zero necessário no quociente", tag: DivisaoLongaMisconception.ZERO_PULADO },
    { regra: "inverte dividendo e divisor", tag: DivisaoLongaMisconception.ORDEM_INVERTIDA },
    { regra: "aceita resto maior ou igual ao divisor", tag: DivisaoLongaMisconception.RESTO_INVALIDO },
    { regra: "não baixa o próximo algarismo", tag: DivisaoLongaMisconception.NAO_BAIXOU },
  ],
  niveis: {
    1: { primitiva: "arraygrid", micro: "arranjo-exata", andaime: "alto" },
    2: { primitiva: "arraygrid", micro: "arranjo-resto", andaime: "medio" },
    3: { primitiva: "vertical", micro: "ponte-algoritmo", andaime: "medio" },
    4: { primitiva: "vertical", micro: "algoritmo", andaime: "minimo" },
    5: { primitiva: "vertical", micro: "zero-quociente", andaime: "nenhum", rt_alvo: 25000 },
  },
  micros: [
    { id: "arranjo-exata", fonte: "F69", alvo: "interpretar divisão exata por arranjo", kinds: ["arraygrid"], params: {}, dominio },
    { id: "arranjo-resto", fonte: "F69", alvo: "identificar quociente e resto no arranjo", kinds: ["arraygrid"], params: {}, dominio },
    { id: "ponte-algoritmo", fonte: "F69", alvo: "ligar o arranjo às etapas do algoritmo", kinds: ["vertical"], params: {}, dominio },
    { id: "algoritmo", fonte: "F69", alvo: "executar divisão longa com um algarismo no divisor", kinds: ["vertical"], params: {}, dominio },
    { id: "zero-quociente", fonte: "F69", alvo: "preservar o zero posicional no quociente", kinds: ["vertical"], params: {}, dominio },
  ],
  erros_tipicos: [
    { id: DivisaoLongaMisconception.ZERO_PULADO, descricao: "Omite um zero necessário no quociente." },
    { id: DivisaoLongaMisconception.ORDEM_INVERTIDA, descricao: "Troca o papel de dividendo e divisor." },
    { id: DivisaoLongaMisconception.RESTO_INVALIDO, descricao: "Encerra a conta com resto que ainda comporta outro grupo." },
    { id: DivisaoLongaMisconception.NAO_BAIXOU, descricao: "Esquece de baixar o próximo algarismo." },
  ],
};
