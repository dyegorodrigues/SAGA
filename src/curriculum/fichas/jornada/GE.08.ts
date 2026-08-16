import type { FichaCompetencia, FichaDominio } from "../../schema";
import { PlanoCartesianoMisconception } from "../../procedimentos/planoCartesianoContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Comece no zero. Primeiro ande no eixo de baixo.", show: { destacarOrigem: true, andarEixoX: 1 } },
  { fala: "Depois suba. A ordem é sempre x, depois y.", show: { subirEixoY: 1, marcarPonto: true } },
];

/** F80 — O Plano Cartesiano: primeiro anda no x, depois sobe no y. */
export const GE_08: FichaCompetencia = {
  id: "GE.08",
  nome: "O Plano Cartesiano",
  strand: "GE",
  faixa: "F3",
  prereqs: ["GE.05", "N1.12"],
  howto: "Primeiro ande no eixo de baixo. Depois suba.",
  explain: "O primeiro número diz quanto andar no eixo x. O segundo diz quanto subir no eixo y.",
  distratores: [
    { regra: "troca x e y ao ler ou colocar o ponto", tag: PlanoCartesianoMisconception.INVERTE_XY },
    { regra: "começa a contar depois do zero e desloca a posição", tag: PlanoCartesianoMisconception.IGNORA_ORIGEM },
    { regra: "conta marcas em vez de intervalos do eixo", tag: PlanoCartesianoMisconception.CONTA_MARCAS },
  ],
  niveis: {
    1: { primitiva: "shapecanvas", micro: "ler-ponto", andaime: "alto" },
    2: { primitiva: "shapecanvas", micro: "colocar-ponto", andaime: "medio" },
    3: { primitiva: "shapecanvas", micro: "caminho", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "figura-coordenadas", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "padrao-alinhado", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "ler-ponto", fonte: "F80", alvo: "ler um ponto marcado no primeiro quadrante preservando a ordem x,y", kinds: ["shapecanvas"], params: { modo: "grade", tutorial }, dominio: { ...dominio } },
    { id: "colocar-ponto", fonte: "F80", alvo: "colocar um ponto a partir de um par ordenado com snap generoso e alternativa por toque", kinds: ["shapecanvas"], params: { modo: "grade", tutorial, alternativaPorToque: true, snapGeneroso: true }, dominio: { ...dominio } },
    { id: "caminho", fonte: "F80", alvo: "descrever o caminho horizontal e depois vertical entre dois pontos", kinds: ["shapecanvas"], params: { modo: "grade", tutorial }, dominio: { ...dominio } },
    { id: "figura-coordenadas", fonte: "F80", alvo: "desenhar figura ligando vértices dados por coordenadas", kinds: ["shapecanvas"], params: { modo: "grade", tutorial, alternativaPorToque: true, snapGeneroso: true }, dominio: { ...dominio } },
    { id: "padrao-alinhado", fonte: "F80", alvo: "identificar padrão em pontos alinhados e prever a próxima coordenada", kinds: ["shapecanvas"], params: { modo: "grade", tutorial }, dominio: { ...dominio } },
  ],
  erros_tipicos: [
    { id: PlanoCartesianoMisconception.INVERTE_XY, descricao: "Troca a ordem horizontal/vertical do par ordenado." },
    { id: PlanoCartesianoMisconception.IGNORA_ORIGEM, descricao: "Desconsidera a origem zero e desloca a contagem." },
    { id: PlanoCartesianoMisconception.CONTA_MARCAS, descricao: "Conta as marcas do eixo em vez dos intervalos percorridos." },
  ],
};
