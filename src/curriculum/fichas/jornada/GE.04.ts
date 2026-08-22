import { FichaCompetencia } from "../../schema";
import { SolidosGeometricosMisconception } from "../../procedimentos/solidosGeometricosContract";

const dominio = { acertos: 3, de: 3, sessoes: 2 };

const tutorial = [
  { fala: "Gire o sólido e procure uma parte curva.", show: { girar: true } },
  { fala: "Agora destaque uma face.", show: { destacarFace: true } },
  { fala: "Vamos testar na rampa: a forma decide se ele rola.", show: { testarRampa: true } },
];

/** F59 — Sólidos Geométricos: nome, propriedade e estrutura. */
export const GE_04: FichaCompetencia = {
  id: "GE.04",
  nome: "Sólidos Geométricos",
  strand: "GE",
  faixa: "F2",
  prereqs: ["GE.02"],
  howto: "Olhe as faces: elas são planas ou curvas? Uma parte curva ajuda o sólido a rolar.",
  explain: "Gire o sólido, toque numa face e depois teste a sua previsão.",
  distratores: [],
  niveis: {
    1: { primitiva: "shapecanvas", micro: "solidos-basicos", andaime: "mao_fantasma" },
    2: { primitiva: "shapecanvas", micro: "familia-solidos", andaime: "alto" },
    3: { primitiva: "shapecanvas", micro: "rolagem", andaime: "medio" },
    4: { primitiva: "shapecanvas", micro: "empilhamento", andaime: "minimo" },
    5: { primitiva: "shapecanvas", micro: "elementos-solido", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "solidos-basicos", fonte: "F59", alvo: "nomear cubo e esfera sem confundir sólido com figura plana", kinds: ["shapecanvas"], params: { modo: "3D", tutorial }, dominio },
    { id: "familia-solidos", fonte: "F59", alvo: "nomear cilindro, cone e pirâmide pela estrutura tridimensional", kinds: ["shapecanvas"], params: { modo: "3D" }, dominio },
    { id: "rolagem", fonte: "F59", alvo: "prever e testar quais sólidos rolam relacionando o resultado à superfície curva", kinds: ["shapecanvas"], params: { modo: "3D", experimento: "rampa" }, dominio },
    { id: "empilhamento", fonte: "F59", alvo: "prever e testar quais sólidos empilham relacionando o resultado às faces planas", kinds: ["shapecanvas"], params: { modo: "3D", experimento: "empilhar" }, dominio },
    { id: "elementos-solido", fonte: "F59", alvo: "contar faces, vértices e arestas de um sólido em diferentes orientações", kinds: ["shapecanvas"], params: { modo: "3D" }, dominio },
  ],
  erros_tipicos: [
    { id: SolidosGeometricosMisconception.CONFUNDE_PLANO_SOLIDO, descricao: "Nomeia a face plana como se fosse o sólido inteiro." },
    { id: SolidosGeometricosMisconception.SO_UM_ANGULO, descricao: "Reconhece o sólido apenas em uma orientação." },
    { id: SolidosGeometricosMisconception.PROPRIEDADE_ERRADA, descricao: "Prevê rolagem ou empilhamento sem observar faces planas e superfícies curvas." },
  ],
};
