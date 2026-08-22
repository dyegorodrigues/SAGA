import { FichaCompetencia, FichaDominio } from "../../schema";
import { MapaTesouroMisconception } from "../../procedimentos/mapaTesouroContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Primeiro ache a coluna.", show: { destacarColuna: true } },
  { fala: "Agora ache a linha. A resposta está no cruzamento.", show: { destacarLinha: true, piscarIntersecao: true } },
];

/** F60 — O Mapa do Tesouro: duas coordenadas em malhas e mapas. */
export const GE_05: FichaCompetencia = {
  id: "GE.05",
  nome: "O Mapa do Tesouro",
  strand: "GE",
  faixa: "F2",
  prereqs: ["GE.01"],
  howto: "Primeiro ache a coluna, depois desça até a linha. Onde elas se cruzam está o tesouro.",
  explain: "Você precisa de duas informações: a coluna e a linha.",
  distratores: [
    { regra: "troca a ordem das duas coordenadas", tag: MapaTesouroMisconception.INVERTE_COORDENADAS },
    { regra: "usa apenas uma das duas coordenadas", tag: MapaTesouroMisconception.SO_UMA_COORDENADA },
    { regra: "confunde linha horizontal com coluna vertical", tag: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA },
  ],
  niveis: {
    1: { primitiva: "shapecanvas", micro: "achar-objeto", andaime: "mao_fantasma" },
    2: { primitiva: "shapecanvas", micro: "dizer-coordenada", andaime: "alto" },
    3: { primitiva: "shapecanvas", micro: "colocar-objeto", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "descrever-caminho", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "pre-cartesiano", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "achar-objeto", fonte: "F60", alvo: "achar um objeto em grade 3×3 cruzando coluna e linha", kinds: ["shapecanvas"], params: { modo: "grade", tutorial }, dominio },
    { id: "dizer-coordenada", fonte: "F60", alvo: "nomear uma célula de grade 5×5 com duas coordenadas", kinds: ["shapecanvas"], params: { modo: "grade", tutorial }, dominio },
    { id: "colocar-objeto", fonte: "F60", alvo: "colocar um objeto na célula indicada por coluna e linha", kinds: ["shapecanvas"], params: { modo: "grade", tutorial }, dominio },
    { id: "descrever-caminho", fonte: "F60", alvo: "descrever deslocamento horizontal e vertical em uma malha", kinds: ["shapecanvas"], params: { modo: "grade" }, dominio },
    { id: "pre-cartesiano", fonte: "F60", alvo: "ler dois eixos numéricos preservando a ordem horizontal e vertical", kinds: ["shapecanvas"], params: { modo: "grade" }, dominio },
  ],
  erros_tipicos: [
    { id: MapaTesouroMisconception.INVERTE_COORDENADAS, descricao: "Troca a ordem horizontal/vertical ao localizar a célula." },
    { id: MapaTesouroMisconception.SO_UMA_COORDENADA, descricao: "Tenta localizar a posição usando só uma informação." },
    { id: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA, descricao: "Confunde coluna vertical com linha horizontal." },
  ],
};
