import type { FichaCompetencia } from "../../schema";

const dominio = { acertos: 3, de: 3, sessoes: 2 } as const;
const tutorial = [
  {
    fala: "O ponteiro grande percorre 60 minutos em uma volta; cada número do mostrador vale 5 minutos.",
    show: { destacarPonteiroMinutos: true, contarDeCincoEmCinco: true },
  },
  {
    fala: "Para descobrir uma duração, conte o tempo que passa: avance primeiro as horas inteiras e depois os minutos restantes.",
    show: { revelarRetaTempo: true, horasAntesDosMinutos: true },
  },
];

export const GM_06: FichaCompetencia = {
  id: "GM.06",
  nome: "Horas e minutos; duração",
  strand: "GM",
  faixa: "F2",
  prereqs: ["GM.04", "AL.03"],
  howto: "Conte os minutos de 5 em 5 no mostrador. Para descobrir a duração, caminhe do horário inicial ao final na reta de tempo.",
  explain: "Os 12 números do relógio representam 60 minutos: por isso cada número vale 5. Em duração, o relógio não é decimal; depois de 59 minutos vem a próxima hora.",
  distratores: [
    { regra: "Lê o número apontado como quantidade de minutos.", tag: "minuto-como-numero" },
    { regra: "Conta só os minutos e ignora a mudança de hora.", tag: "ignora-hora-na-duracao" },
    { regra: "Subtrai horários como números decimais de base 100.", tag: "subtrai-decimal" },
  ],
  niveis: {
    1: { primitiva: "relogio", micro: "a", andaime: "alto" },
    2: { primitiva: "relogio", micro: "b", andaime: "alto" },
    3: { primitiva: "relogio", micro: "c", andaime: "medio" },
    4: { primitiva: "relogio", micro: "d", andaime: "minimo" },
    5: { primitiva: "numberline", micro: "e", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "a", alvo: "Ler meia hora e quartos de hora no relógio.", kinds: ["relogio", "numberline"], params: { tutorial, modo: "meia-hora-quartos" }, dominio: { ...dominio } },
    { id: "b", alvo: "Ler minutos de 5 em 5 com numeração fantasma de apoio.", kinds: ["relogio", "numberline"], params: { tutorial, modo: "cinco-em-cinco-com-apoio" }, dominio: { ...dominio } },
    { id: "c", alvo: "Ler minutos de 5 em 5 sem numeração fantasma.", kinds: ["relogio", "numberline"], params: { tutorial, modo: "cinco-em-cinco" }, dominio: { ...dominio } },
    { id: "d", alvo: "Ler minutos minuto a minuto.", kinds: ["relogio", "numberline"], params: { tutorial, modo: "minuto-a-minuto" }, dominio: { ...dominio } },
    { id: "e", alvo: "Calcular duração entre dois horários usando saltos de hora e minuto.", kinds: ["relogio", "numberline"], params: { tutorial, modo: "duracao" }, dominio: { ...dominio } },
  ],
  erros_tipicos: [
    { id: "minuto-como-numero", descricao: "Lê o algarismo do mostrador como minutos, por exemplo 3 como 3 em vez de 15." },
    { id: "ignora-hora-na-duracao", descricao: "Calcula só a diferença dos minutos e esquece a hora atravessada." },
    { id: "subtrai-decimal", descricao: "Trata horários como decimais de base 100 em vez de usar 60 minutos por hora." },
  ],
};
