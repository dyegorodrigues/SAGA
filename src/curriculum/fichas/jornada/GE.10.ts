import type { FichaCompetencia, FichaDominio } from "../../schema";
import { VolumeVistasMisconception } from "../../procedimentos/volumeVistasContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { say: "Esta é a construção. Veja como os cubos ocupam altura e profundidade.", show: { mostrar3D: true, alfabetizarModo: "arraygrid-3d" }, sync: "junto" },
  { say: "Olhando de frente, gire mentalmente a construção até esse lado ficar diante de você.", show: { girarPara: "frente" }, sync: "junto" },
  { say: "Vemos este desenho. Frente, lado e cima são projeções da mesma construção.", show: { destacarVista: 0 }, sync: "depois" },
];

/** F92 — Volume e vistas: rotação mental e reconstrução espacial com ArrayGrid em modo 3D. */
export const GE_10: FichaCompetencia = {
  id: "GE.10",
  nome: "Volume e Vistas",
  strand: "GE",
  faixa: "F4",
  prereqs: ["GE.04", "GM.08"],
  howto: "Imagine olhando de cima. O que você veria?",
  explain: "Gire a construção e compare com a vista pedida.",
  distratores: [
    { regra: "conta apenas os cubos visíveis e ignora os que ficam escondidos", tag: VolumeVistasMisconception.IGNORA_OCULTOS },
    { regra: "associa a construção à projeção de outra orientação", tag: VolumeVistasMisconception.VISTA_TROCADA },
    { regra: "responde sem transformar mentalmente a orientação da construção", tag: VolumeVistasMisconception.SEM_ROTACAO_MENTAL },
  ],
  niveis: {
    1: { primitiva: "arraygrid", micro: "vista-frontal", andaime: "alto" },
    2: { primitiva: "arraygrid", micro: "tres-vistas", andaime: "medio" },
    3: { primitiva: "arraygrid", micro: "reconstruir-vistas", andaime: "medio" },
    4: { primitiva: "arraygrid", micro: "cubos-ocultos", andaime: "minimo" },
    5: { primitiva: "arraygrid", micro: "desenhar-vistas", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "vista-frontal", fonte: "F92", alvo: "identificar a vista frontal de uma construção tridimensional sem confundir orientação", kinds: ["arraygrid"], params: { modo: "vista-frontal", tutorial }, dominio },
    { id: "tres-vistas", fonte: "F92", alvo: "relacionar frente, lado e cima como três projeções da mesma construção", kinds: ["arraygrid"], params: { modo: "tres-vistas", tutorial }, dominio },
    { id: "reconstruir-vistas", fonte: "F92", alvo: "reconstruir uma construção de cubos a partir das três vistas", kinds: ["arraygrid"], params: { modo: "reconstruir-vistas", tutorial }, dominio },
    { id: "cubos-ocultos", fonte: "F92", alvo: "contar cubos ocultos usando um modelo mental completo, não apenas o que está visível", kinds: ["arraygrid"], params: { modo: "cubos-ocultos", tutorial }, dominio },
    { id: "desenhar-vistas", fonte: "F92", alvo: "desenhar por toque as vistas frente, lado e cima de uma construção dada", kinds: ["arraygrid"], params: { modo: "desenhar-vistas", tutorial }, dominio },
  ],
  erros_tipicos: [
    { id: VolumeVistasMisconception.IGNORA_OCULTOS, descricao: "Contou só os cubos aparentes e deixou de representar camadas ocultas da construção." },
    { id: VolumeVistasMisconception.VISTA_TROCADA, descricao: "Trocou frente, lado ou cima ao associar a construção à projeção." },
    { id: VolumeVistasMisconception.SEM_ROTACAO_MENTAL, descricao: "Tentou usar a orientação atual sem imaginar a rotação necessária para a vista pedida." },
  ],
};
