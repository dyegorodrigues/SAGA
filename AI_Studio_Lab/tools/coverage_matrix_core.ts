import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { JOURNEY_FICHAS } from "../../src/curriculum/fichas";
import { ALL_MATH_TRACKS } from "../../src/curriculum/motores/curriculum";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
const require = createRequire(import.meta.url);
const uniq = <T>(items: Iterable<T>) => [...new Set(items)];
const sorted = <T extends string>(items: Iterable<T>) => [...items].sort((a, b) => a.localeCompare(b));

interface RuntimeMapEntry {
  primitive: string;
  kinds: string[];
  componentFiles: string[];
  builderKinds: string[];
  specializedBuilderIds?: string[];
  rendererKinds: string[];
  note?: string;
}
const { FICHA_RUNTIME_MAP } = require("./ficha_runtime_map.cjs") as { FICHA_RUNTIME_MAP: RuntimeMapEntry[] };

/** Snapshot imutável do fechamento da Coverage Matrix (P21.1). */
export const COVERAGE_CLOSED_BASELINE = {
  competencies: 90,
  authoredFichas: 94,
  composer: 26,
  legacy: 25,
  fallback: 39,
  served: 51,
  divergences: 21,
  modeSwaps: 12,
  toolIntroductions: 44,
  missingPrimitives: ["Moedas", "Regua"],
} as const;

type CoverageDelta = Partial<Record<
  "composer" | "legacy" | "fallback" | "served" | "divergences" | "modeSwaps" | "toolIntroductions",
  number
>>;
interface CoverageMigration { id: string; competence: string; rationale: string; delta: CoverageDelta; }

/** Ledger nominal: só recebe delta depois da observação vermelha da fonte real. */
export const COVERAGE_MIGRATIONS: readonly CoverageMigration[] = [
  { id: "W1-N1.04", competence: "N1.04", rationale: "F03 reconciliada com TouchCount e proveniência/voz F01+F03 explicitadas no runtime.", delta: { divergences: -1 } },
  { id: "W2-N1.05", competence: "N1.05", rationale: "F06 materializada no specialized builder Grupo-backed; o legado abstrato saiu de produção e a divergência ficha↔screen foi fechada.", delta: { composer: 1, legacy: -1, divergences: -1 } },
  { id: "W3-N2.01", competence: "N2.01", rationale: "F21 materializada como agrupamento manual 10U→1D com MaterialDourado + TenFrame, montagem inversa no L4 e decomposição mental no L5; o legado estático saiu de produção e a divergência ficha↔screen foi fechada.", delta: { composer: 1, legacy: -1, divergences: -1 } },
  { id: "W4-N1.12", competence: "N1.12", rationale: "F19 materializada na InteractiveNumberLine compartilhada com reta responsiva, tap/drag filtrados por geometria motora, salto e som sincronizados, arcos somente no L2 e sonda Chrome 320/390/900; o legado saiu de produção e a divergência ficha↔screen foi fechada.", delta: { composer: 1, legacy: -1, divergences: -1 } },
  { id: "W5-GM.05", competence: "GM.05", rationale: "F61 materializada com Regua especializada: medida informal→leitura→alinhamento do zero→comparação→estimativa, filtro motor e evidência ALINHOU_ZERO; canário inativo passou suíte completa e Chrome 320/390/900 antes da promoção. A Matrix observou 30 Composer, 38 fallback e 52 servidas após a ativação.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W6-N2.03", competence: "N2.03", rationale: "F29 materializada no specialized builder local Grupo-backed: quantidade→comparação→símbolo, com N1.05/W2 como pré-requisito direto; o legado saiu de produção e a divergência ficha↔screen foi fechada.", delta: { composer: 1, legacy: -1, divergences: -1 } },
  { id: "W7-N2.02", competence: "N2.02", rationale: "F36 materializada no specialized builder local Quadrado100-backed: +1 horizontal, +10 vertical, +5, vizinhos e lacunas, com onboarding explícito da estreia visual, processo no AnswerMeta e evidência de percurso vertical.", delta: { composer: 1, legacy: -1 } },
  { id: "W8-N3.01", competence: "N3.01", rationale: "F13 materializada no specialized builder local VisualAddition-backed: juntar preserva as parcelas até a fusão, retirada progressiva de objetos no L4 e símbolo puro no L5.", delta: { composer: 1, legacy: -1 } },
  { id: "W9-N3.02", competence: "N3.02", rationale: "F15 materializada no specialized builder local EmojiRow#riscar com preservação geométrica do slot e domínio sem crédito por correção.", delta: { composer: 1, legacy: -1, divergences: -1 } },
  { id: "W10-N3.03", competence: "N3.03", rationale: "F14 materializada no CountingOnStage composto LinkingCubes↔NumberLine, com retirada progressiva de andaimes e resolucao() R0-A.", delta: { composer: 1, legacy: -1, divergences: -1 } },
  { id: "OBS-COMPOSITE-N4.03", competence: "N4.03", rationale: "Observabilidade: TabuadaStage já renderizava Arranjo/ArrayGrid, Quadrado100 e NumberLine; o gate de palcos compostos removeu falsa divergência.", delta: { divergences: -1 } },
  { id: "W11-AL.03", competence: "AL.03", rationale: "F30 materializada no SkipCountStage, reutilizando InteractiveNumberLineSurface, compondo Quadrado100 no L3 e generalizando saltos 2..10.", delta: { composer: 1, legacy: -1, divergences: -1 } },
  { id: "W12-N4.01", competence: "N4.01", rationale: "F97 materializada no EqualGroupsStage, reutilizando Grupo e preservando a leitura N grupos de M, com resolução R0-A.", delta: { composer: 1, legacy: -1, divergences: -1 } },
  { id: "W13-GE.03", competence: "GE.03", rationale: "F58 materializada no DetetiveFormasStage, reutilizando ShapeCanvas. Primeira onda fallback-first; canário inativo 6092da5a passou CI 31735133641 + transversal 31735133586.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W14-AL.04", competence: "AL.04", rationale: "F57 materializada no RegraSequenciaStage, preservando EmojiRow + NumberLine. Canário inativo 1ff9aea6 passou CI 31747073742 + transversal 31747073736; promoção cfe4e31d fez a Matrix observar 39/15/36/54/11.", delta: { composer: 1, fallback: -1, served: 1 } },
  {
    id: "W15-N5.01",
    competence: "N5.01",
    rationale: "F45 materializada no PartesIguaisStage, compondo FiguraDesenhada de ShapeCanvas + SingaporeFractionBar da SingaporeBars. L4 produz equipartição com deslizar ou toque equivalente; evidência só nasce quando os intervalos são matematicamente iguais. O canário inativo b32bee4c passou CI 31760839221 + transversal 31760839210. Após a promoção baa382a0, a Matrix observou 40 Composer, 15 legado, 35 fallback, 55 servidas e uma falsa divergência de modo ShapeCanvas#partição, reconciliada explicitamente abaixo.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  { id: "W16-N5.02", competence: "N5.02", rationale: "F72 materializada compondo SingaporeBars + InteractiveNumberLine. A promoção foi observada pela Matrix como +1 Composer, -1 fallback e +1 servida.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W17-N6.01", competence: "N6.01", rationale: "F75 materializada relendo Quadrado100 como um inteiro em décimos e centésimos. A promoção foi observada pela Matrix como +1 Composer, -1 fallback e +1 servida.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W18-N5.03", competence: "N5.03", rationale: "F73 materializada com SingaporeBars de mesmo comprimento para equivalência e comparação. A promoção isolada ecdecfec foi observada antes do ledger: 43 Composer, 15 legado, 32 fallback, 58 servidas e 11 divergências.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W19-N4.10", competence: "N4.10", rationale: "F69 materializada no palco composto ArrayGrid + InteractiveVertical, com revelação progressiva, resto válido e zero posicional no quociente. O portão inativo 4ed4858d passou CI 31798437057 + transversal 31798437091. A promoção 056c19e3 fez a Matrix observar 44 Composer, 15 legado, 31 fallback, 59 servidas e 11 divergências antes deste ledger.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W20-GM.07", competence: "GM.07", rationale: "F63 materializada no palco composto ArrayGrid + ShapeCanvas para distinguir a volta (perímetro) do chão interno (área), com lado faltante no L5 e evidência específica no L4. O portão inativo f68b8bb6 passou CI 31803991249 + transversal 31803991246. A promoção isolada f30b05a2 fez a Matrix observar 45 Composer, 15 legado, 30 fallback, 60 servidas e 11 divergências antes deste ledger.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W21-AL.05", competence: "AL.05", rationale: "F46 materializada com Balanca como significado fisico de igualdade: o sinal = deixa de ser \"aqui vem a resposta\" e passa a ser equilibrio verificavel. Diversidade de dois casos distintos no L4 e resolucao R0-A. O primeiro Chrome real acusou overflow em 320px e a causa foi corrigida sem relaxar a sonda. O portao inativo 72cf0375 passou CI 31808928178 + transversal 31808928379. A promocao isolada 4a2d4d8e fez a Matrix observar 46 Composer, 15 legado, 29 fallback, 61 servidas e 11 divergencias antes deste ledger.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W22-N6.03", competence: "N6.03", rationale: "F87 materializada no palco composto Quadrado100 + SingaporeBars: parte de cem → âncoras → percentual de quantidade → desconto/acréscimo → percentual inverso, com resolucao R0-A e diagnósticos canônicos. O portão inativo eed2b8ab passou CI 31820722322 + transversal 31820722277. Promoção e ledger entraram atomicamente; nenhum delta de divergência foi presumido.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W23-GE.06", competence: "GE.06", rationale: "F78 materializada no AngulosStage como realização explícita do ShapeCanvas em modo ângulo: abertura dinâmica, comparação independente do comprimento dos lados, graus e polígonos, com resolucao R0-A. Promoção e ledger entram atomicamente neste SHA após o portão inativo exato; nenhum delta de divergência é presumido.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W24-N7.01", competence: "N7.01", rationale: "F84 materializada como extensão da InteractiveNumberLine para negativos, comparação, ordenação, distância e módulo. O portão inativo 1f912c8f passou CI 31825522496 + transversal 31825522510; promoção e ledger entram atomicamente neste SHA, sem antecipar número de Matrix.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W25-PE.02", competence: "PE.02", rationale: "F64 materializada no JornalTurmaStage como realização explícita do SingaporeBars em modo vertical: tabela → barras → comparação → construção → linguagem de probabilidade. O portão inativo 748724d0 passou CI 31842370575 + transversal 31842370542; promoção e ledger entram atomicamente neste SHA, sem antecipar número de Matrix.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W26-GM.08", competence: "GM.08", rationale: "F81 materializada no AreaF81Stage reutilizando ArrayGrid: contar unidades quadradas → linhas×colunas → fórmula → separar área de perímetro → compor áreas. Unidade cm² explícita e resolucao R0-A declarativa; promoção e ledger entram atomicamente após o portão inativo exato, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W27-AL.06", competence: "AL.06", rationale: "F77 materializada como expressão numérica com ordem operacional progressiva e resolução R0-A declarativa. O portão inativo dbd9c4c passou CI 31853918490 + transversal 31853918503; promoção e ledger entram atomicamente neste SHA, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W28-GE.05", competence: "GE.05", rationale: "F60 materializada no MapaTesouroStage, reutilizando ShapeCanvas#grade para coluna, linha, interseção e ponte pré-cartesiana. O portão inativo e4c9349 passou CI 31858284059 + transversal 31858284068; promoção e ledger entram atomicamente neste SHA, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W29-GE.04", competence: "GE.04", rationale: "F59 materializada no SolidosGeometricosStage, reutilizando ShapeCanvas#3D para nomeação, rampa experimental, empilhamento e contagem de faces/vértices/arestas. O portão inativo 9bec4f26 usa CI 31864008893 + transversal 31864008795; promoção e ledger entram atomicamente somente após ambos concluírem verdes, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W30-N2.06", competence: "N2.06", rationale: "F38 materializada sobre DragGroup#duplas: pareamento concreto até 10 e 20, decisão visual, regra do último algarismo e paridade de somas. O portão inativo exato c62beaad usa CI 31882628417 + transversal 31882628429; promoção e ledger entram atomicamente somente após a certificação desse SHA, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W31-PE.03", competence: "PE.03", rationale: "F83 materializada no MediaChanceStage como realização explícita de SingaporeBars: nivelar torres → média inteira → média fracionária por meio bloco/linha → chance como favoráveis/total → comparação de chances. O portão inativo exato 81ffa9b6 usa CI 31908108818 + transversal 31908108833; promoção e ledger entram atomicamente somente após a certificação desse SHA, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W32-GM.09", competence: "GM.09", rationale: "F82 materializada no ProblemasMedidaStage, compondo NumberLine + Balanca para tornar equivalência e conversão visíveis antes de comparar ou operar. O portão inativo exato ddaf40bf usa CI 31913279161 + transversal 31913279171; promoção e ledger entram atomicamente somente após a certificação desse SHA, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W33-GE.07", competence: "GE.07", rationale: "F79 reconciliada com a ficha canônica no PoligonosStage, compondo ShapeCanvas + DragGroup para classificar triângulos por lados e ângulos, quadriláteros, hierarquia e propriedades combinadas. O portão inativo canônico exato 04865f6a usa CI 31916409189 + transversal 31916409203; promoção e ledger entram atomicamente somente após a certificação desse SHA, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W34-GE.08", competence: "GE.08", rationale: "F80 materializada no PlanoCartesianoStage, reutilizando ShapeCanvas#grade com a regra primeiro x, depois y, alternativa por toque e snap generoso. O portão inativo exato 0fb800ac usa CI 31917798514 + transversal 31917798507; promoção e ledger entram atomicamente somente após a certificação desse SHA, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W35-GM.06", competence: "GM.06", rationale: "F62 materializada no HorasMinutosStage, compondo Relogio + NumberLine: meia hora/quartos → 5 em 5 com apoio → 5 em 5 sem apoio → minuto a minuto → duração. O portão inativo exato 779f4034 passou CI 31932785122 + transversal 31932785057; a primeira promoção 7d7689a revelou dívida real de onboarding em params.tutorial; o forward rollback 917e68f restaurou somente os três governantes. O inativo reparado c30f6d2 passou CI 31933937338 + transversal 31933937332; a promoção final c7d21d5 passou CI 31934324465 + transversal 31934324470 e a Matrix observou 60/15/15/75/11, sem relaxar gate, baseline ou divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W36-GM.10", competence: "GM.10", rationale: "F93 materializada no ConversaoUnidadesStage, compondo NumberLine + Balanca para manter a quantidade física invariável ao trocar de unidade. O portão inativo reparado 49487995 passou CI 31947628546 + transversal 31947628547. A promoção atômica 61c99d7 moveu somente os três governantes e fez a Matrix observar 61/15/14/76/11, mas expôs um único vermelho real no contrato do canário: a F93 usa racionais por desenho pedagógico. O reparo a742364 declarou dominioNumerico racionais e preservou finitude estrita; CI 31954561791 + transversal 31954561716 fecharam verdes, sem tocar baseline nem teste de conteúdo.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W37-N7.02", competence: "N7.02", rationale: "F85 materializada no OperarNegativosStage sobre InteractiveNumberLine: somas com sinais, dois negativos, subtração de negativo como cancelar uma dívida e expressões mistas. A ficha nasce com dominioNumerico inteiros ainda inativa. O portão inativo exato e7d7268b usa CI 31955540067 + transversal 31955540080; promoção e ledger entram atomicamente somente após ambos concluírem verdes, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W38-AL.07", competence: "AL.07", rationale: "F89 materializada no LinguagemLetrasStage, compondo SingaporeBars + plain para ligar quantidade concreta e regra algébrica geral. O regression-first 158c7407 falhou nominalmente só pela ausência da AL.07; a materialização inativa exata 0da3ecea usa CI 31959023444 + transversal 31959023443. Promoção e ledger entram atomicamente somente após ambos concluírem verdes, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W39-N2.07", competence: "N2.07", rationale: "F66 materializada no FatoresRetangulosStage reutilizando ArrayGrid: pares com dica → todos os pares → lista de fatores → primo pelo único retângulo 1×n → maior fator comum; tentativas com resto mantêm a sobra visível. O portão inativo exato eb194d4b passou CI 31976660344 + transversal 31976660441, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  { id: "W40-GE.09", competence: "GE.09", rationale: "F91 materializada no CirculoAreasStage reutilizando o ShapeCanvas físico: dois triângulos formam retângulo e expõem a metade → fórmula base × altura ÷ 2 derivada → paralelogramo cortado/encaixado conserva área → raio, diâmetro e circunferência → setores rearranjados aproximam πr². As transformações motoras usam ações por toque amplo, sem precisão de arrasto como evidência conceitual; as três tags F91 já pertencem ao Radar. O portão inativo exato a771f960 passou CI 31981350463 + transversal 31981350512, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.", delta: { composer: 1, fallback: -1, served: 1 } },
  {
    id: "W41-GE.10",
    competence: "GE.10",
    rationale: "F92 materializada no VolumeVistasStage reutilizando ArrayGrid#3D: vista frontal → três vistas → reconstrução pelas vistas → cubos ocultos → desenho das vistas, com onboarding explícito do mode swap, alternativa integral por toque, alvos mínimos de 80 px e diagnósticos canônicos ignora-ocultos/vista-trocada/sem-rotacao-mental. O portão inativo exato 33ff7d34 passou CI 32001192111 + transversal 32001192091, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W42-N4.11",
    competence: "N4.11",
    rationale: "F70 materializada no PrimosDivisoresStage compondo ArrayGrid + Quadrado100: múltiplos por saltos no quadro → divisores por retângulos sem sobra → distinção divisor/múltiplo → primos por exatamente dois divisores positivos → Crivo de Eratóstenes riscando múltiplos compostos nas próprias casas. A exploração por toque não compra resposta nem misconception; o papel do 1, primo≠ímpar e as tags inverte-divisor-multiplo/esquece-um/primo-errado ficam explícitos. O portão inativo exato 6129c5c8 passou CI 32034443674 + transversal 32034443648, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W43-N4.12",
    competence: "N4.12",
    rationale: "F71 materializada no DivisaoDoisDigitosStage reutilizando InteractiveVertical: divisor redondo → próximo de redondo → divisor arbitrário → resto → zero no quociente. O ciclo cognitivo estimar → testar por multiplicação → ajustar é explícito, com rascunho interativo, feedback passou/cabe mais, evidência P13 de ajuste da primeira estimativa, alternativa por toque com alvos generosos e diagnósticos canônicos nao-estima/nao-ajusta/resto-maior-ou-igual-divisor. O portão inativo exato 6c056a8d passou CI 32044672592 + transversal 32044672629, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W44-N5.04",
    competence: "N5.04",
    rationale: "F74 materializada no SomaFracoesStage reutilizando SingaporeBars: soma com barras → soma simbólica → subtração → fração imprópria → simplificação como mesma quantidade/outro nome, sempre com denominadores iguais e sem pré-renderizar a resposta. Diagnósticos soma-denominador/nao-simplifica/impropria-invalida pertencem ao Radar; acerto imediatamente após SOMA_DENOMINADOR é desqualificado de mastery pela autoridade compartilhada masteryDisqualifier. O portão inativo exato a41e6e9e passou CI 32052726802 + transversal 32052726430, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W45-N6.04",
    competence: "N6.04",
    rationale: "F88 materializada no RazaoProporcaoStage reutilizando SingaporeBars por SingaporeLinkedScaleBars: dobrar → triplicar → escala geral não inteira → razão como fração → regra de três causal. Um único fator deriva simultaneamente as duas barras; o par escalado só aparece após a decisão, as três misconceptions pertencem ao Radar, a evidência P13 de escala não inteira vem do mesmo emissor puro do runtime e correção após erro conceitual não compra mastery independente. O portão inativo reparado exato fd93358b passou CI 32074518557 + transversal 32074518604, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W46-AL.08",
    competence: "AL.08",
    rationale: "F90 materializada no EquacoesStage reutilizando Balanca: x + a = b → x - a = b → ax = b → dois passos → incógnita nos dois lados, sempre como transformação equivalente aplicada aos dois pratos. A alteração unilateral inclina fisicamente a balança; operação inversa errada permanece distinguível sem virar regra de troca de sinal; as quatro misconceptions pertencem ao Radar e a evidência P13 L3+ vem do emissor runtime. O portão inativo exato f3c7c4d4 passou CI 32085678926 + transversal 32085678976, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W47-N6.02",
    competence: "N6.02",
    rationale: "F76 materializada no ContasVirgulaStage compondo InteractiveVertical + Quadrado100: a vírgula funciona como eixo das ordens, casas ausentes recebem zero de preenchimento, subtração e reagrupamento preservam valor posicional e ×10/×100 é explicado como mudança de ordem, não regra mecânica de mover vírgula. As três misconceptions pertencem ao Radar; a evidência P13 de casas diferentes nasce somente em acerto L2; retry após erro conceitual não compra mastery independente; RT permanece apenas telemetria da ficha e não autoridade da questão. O portão inativo final exato 23e5be94 passou CI 32135341005 + transversal 32135340907, ambos completed/success; promoção e ledger entram atomicamente somente após essa certificação, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W48-GM.11",
    competence: "GM.11",
    rationale: "F94 materializada no VolumePrismasStage reutilizando ArrayGrid#3D e o helper isométrico já alfabetizado na F92: cubos unitários → camada → área da base × altura → dimensão faltante → prisma de base não retangular, sempre por camadas idênticas. As três misconceptions pertencem ao Radar; a evidência P13 de dimensão faltante nasce somente em acerto L4; toque alternativo com alvos mínimos de 80 px separa erro motor de misconception; RT permanece apenas telemetria da ficha. O portão inativo reparado exato fbc80f76 passou CI 32154072299 + transversal 32154072327, ambos completed/success; promoção e ledger entram atomicamente neste SHA, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W49-PE.04",
    competence: "PE.04",
    rationale: "F95 materializada no EstatisticaChanceStage como continuação causal de PE.03/F83, compondo SingaporeBars + ArrayGrid para certo/possível/impossível → chance como fração → independência → frequência observada → contagem de possibilidades. A falácia do apostador pertence ao Radar; a evidência P13 de chance como fração nasce somente em acerto L3; resolução assistida não compra mastery independente e interação permanece por toque amplo sem erro motor virar misconception. O portão inativo final exato ba03c90b passou CI 32169040052 + transversal 32169040050, ambos completed/success; promoção e ledger entram atomicamente neste SHA, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W50-N5.05",
    competence: "N5.05",
    rationale: "F86 materializada no MultiplicarFracoesStage reutilizando ArrayGrid#área: fração de inteiro → modelo de área → fração×fração pela interseção → generalização simbólica → divisão como quantas frações cabem. As misconceptions permanecem canônicas no Radar; a evidência de fração×fração nasce no nível 3; resolução assistida não compra mastery independente; os reparos reais de semântica ARIA entraram antes do portão final, sem enfraquecer teste ou acessibilidade. O portão inativo final exato 340f219a8eae3b3a71215d7a23e8e81a032afe1b passou CI 32191494936 + transversal 32191494957 (9/9), ambos completed/success; promoção e ledger entram atomicamente neste SHA com delta observado esperado +1 Composer, -1 fallback, +1 servida, sem presumir divergência.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W51-N4.02",
    competence: "N4.02",
    rationale: "F98 promovida do legado. A ficha existia desde antes e nunca fora registrada em COMPOSER_FICHAS: não passara por gate nenhum dos dez que hoje vigiam a Jornada. Registrada, os dez a aceitaram sem reparo próprio, e o portão de giro instalado pela frente da CLASS-007 apareceu sozinho no inventário de portões medidos — resultado esperado de uma promoção, não exceção. Registrá-la deslocou o fluxo do PRNG e a CLASS-009 acusou N5.04 L3: 6/7 menos 3/7 dá 3/7 e deixava a resposta escrita como um dos operandos da própria conta. Defeito estrutural, corrigido na origem antes desta promoção. O legado gN4_02 sai de produção. A divergência ficha↔screen NÃO fecha aqui, e o delta não a reivindica: a Matrix observada nunca listou N4.02 entre as onze divergências, e escrever -1 seria ajustar a expectativa para ficar verde.",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W52-N3.11",
    competence: "N3.11",
    rationale: "Adição com reagrupamento promovida do legado. Como a N4.02, a ficha existia completa — cinco micros, aulinha da troca declarada, distratores nomeados — e nunca fora registrada em COMPOSER_FICHAS: nenhum dos onze portões por descoberta a tinha olhado uma única vez. Registrada, a CLASS-001 acusou no primeiro sopro: L1 e L2 declaravam params idênticos byte a byte, e o único campo que os separava era o `andaime` — prosa da ficha que primitiva `vertical` nenhuma lê. A criança subia de degrau e a tela não mudava. O reparo veio da escada CPA da N3.09, ficha irmã que já atravessou todos os portões: no L1 o algoritmo escrito fica escondido e só o material conta a troca; do L2 em diante o registro escrito aparece ao lado do material. Reparada, os onze aceitaram. O legado gN3_11 sai de produção. Delta observado na Matrix real: +1 Composer, -1 legado; as onze divergências ficha↔screen não mudam e o delta não reivindica nenhuma.",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W53-N3.04",
    competence: "N3.04",
    rationale: "F31 Voltar Contando — a primeira das doze competências que estavam sem ficha autoral. Não é estreia de conteúdo: o gerador legado gN3_04 já servia o nó; é a primeira vez que a competência tem ficha e, portanto, a primeira vez que atravessa portão algum. A F31 canônica foi transcrita inteira, com contrato e palco próprios: os dois caminhos da subtração (voltar e completar), o custo em pulos de cada um, a comparação que só aparece depois da escolha, e a reta que some no nível mental. A escolha do caminho é ação probatória declarada em acaoProbatoria nos níveis 2 a 5 — a barra de respostas não abre antes dela, e os quatro portões entraram no inventário medido no mesmo instante. O §9 da ficha canônica pede que duas das quatro tentativas do domínio sejam casos em que completar é o caminho curto: virou evidenciasDistintas com as famílias voltar-curto e completar-curto, que é a CLASS-008 na forma exata que a própria ficha nomeia como erro ESTRATEGIA_UNICA. Registrar a ficha deslocou o PRNG e a CLASS-009 acusou GE.04 L3: o enunciado perguntava 'o {sólido} rola na rampa?' com 'rola' na barra logo abaixo — quem não soubesse ler a figura casava a palavra do enunciado com a do botão. Defeito estrutural anterior a esta ficha, corrigido na origem: a pergunta virou aberta e o verbo ficou só nas alternativas. O legado gN3_04 sai de produção. Delta observado na Matrix real: +1 Composer, -1 legado; e uma divergência ficha↔screen fecha: o nó pedia InteractiveNumberLine e o legado entregava outra coisa; o palco novo entrega a primitiva que a ficha nomeia, e as divergências caem de onze para dez.",
    delta: { composer: 1, legacy: -1, divergences: -1 },
  },
  {
    id: "W54-N3.06",
    competence: "N3.06",
    rationale: "F32 Dobros e Quase-Dobros — segunda das doze competências sem ficha autoral. O gerador legado gN3_06 já servia o nó; a ficha é nova. A F32 canônica foi transcrita com palco composto ArrayGrid + TenFrame, exatamente as duas primitivas que ela nomeia e cada uma com trabalho próprio: a grade desenha as duas fileiras espelhadas, que é a simetria de onde o dobro se fixa na memória, e a moldura mostra UMA fileira dentro do dez — preenchida com o total ela seria a resposta desenhada na tela, que é a CLASS-009 exata. A casa do extra fica fora da grade, porque é ela que a criança precisa enxergar como o que sobra do dobro. A escada é de tamanho e de apoio: dobros até cinco, dobros até dez com as faixas sem sobreposição, quase-dobro de mais um com o dobro escrito, quase-dobro nos dois sentidos sem apoio, e a mistura. O §9 diz que só dobros não prova a estratégia: virou evidenciasDistintas no L5, o único que mistura, com as famílias dobro e quase-dobro. Nos níveis 3 e 4 todo caso já é quase-dobro e a exigência se cumpre sozinha. O piso do L1 subiu de um para dois: com âncora um, o distrator do dobro-errado-para-menos vale zero e é descartado, e o nível ficava com duas alternativas — cara ou coroa não mede nada. Os doze portões aceitaram na primeira passagem. O legado gN3_06 sai de produção. Delta observado: +1 Composer, -1 legado, -1 divergência ficha↔screen, porque o palco novo entrega as duas primitivas que a ficha pede.",
    delta: { composer: 1, legacy: -1, divergences: -1 },
  },
  {
    id: "W55-N3.07",
    competence: "N3.07",
    rationale: "F33 Fazer Dez — terceira das doze competências sem ficha autoral, e a que a ficha canônica chama de mais importante da faixa F1: é onde os amigos do dez, aprendidos na N1.11, deixam de ser exercício e viram ferramenta. Palco de moldura dupla, como a F33 nomeia: a criança fecha a primeira caixa em dez por toque e a sobra começa a segunda, tornando visível a quebra da parcela — 8+5 vira 8+2+3, que vira 10+3. Sem arrasto e com alvo grande, porque o adendo §8.3-bis é explícito em que precisão de dedo nunca é requisito para demonstrar compreensão. Fechar a caixa é ação probatória declarada nos três níveis em que as molduras existem; do L4 em diante elas somem e o portão some junto, o que é o resultado certo — declarar prova numa tela que não tem porta seria mentira de cânone. A escada é de apoio que some: sobra pouca com a mão fantasma, moldura e bandeja, molduras sem a decomposição escrita, só a decomposição escrita, e o mental. Toda soma cruza a dezena e sempre sobra algo depois de fechar a caixa: uma soma que fechasse exatamente em dez não exercitaria o terceiro passo, que é o caro. Os dois erros de um a menos foram separados por direção — quem erra o amigo do dez chega a um a MENOS, quem sabe a estratégia e escorrega na contagem erra para qualquer lado —, o que permite ao Radar distinguir dois diagnósticos com resgates diferentes. A sonda cobrou uma correção antes da promoção: o L4 mandava fechar uma caixa que não estava mais na tela. O domínio é o rigoroso que a ficha pede, quatro de quatro em três sessões. O legado gN3_07 sai de produção. Delta observado: +1 Composer, -1 legado; as divergências ficha↔screen não mudam.",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W56-N3.05",
    competence: "N3.05",
    rationale: "F16 Família de Fatos — quarta das doze competências sem ficha autoral. O trio de números que gera quatro contas: quem entende a família não decora subtração separadamente, e é isso que reduz a carga pela metade. Palco NumberBond em modo triângulo aditivo, a primitiva que a ficha nomeia, com a mesma disciplina do triângulo multiplicativo da N4.06: o vértice perguntado recebe '?' literalmente, o número não chega ao componente, e não há bug de renderização capaz de mostrá-lo. A sonda achou um vazamento que a disciplina do triângulo sozinha não cobria: as contas de apoio existem para ensinar que os mesmos três números fazem quatro frases, e mascaravam só o resultado — perguntado o todo de 1+2, o apoio saía como '3 − 1 = ?' e '3 − 2 = ?', com o três que o triângulo escondia escrito ali do lado, duas vezes. CLASS-009 pela porta dos fundos. Corrigido na origem: o número oculto vira '?' em toda parte, e o teste nominal cobra que a resposta não apareça escrita em nenhum lugar da tela. O §9 pede pelo menos uma subtração deduzida: virou evidenciasDistintas do L3 em diante, com as famílias adicao e subtracao — nos L1 e L2 só se pergunta o todo, e exigir as duas ali seria pedir uma subtração que o nível não apresenta. O L5 esconde a conta escrita e deixa só o triângulo com um círculo vazio, que é a inversão que a ficha chama de raciocínio maduro; sem isso ele seria o L4 outra vez. As alternativas ganharam a segunda parte como distrator porque em trios pequenos a diferença coincide com uma delas e o nível ficava com duas opções. O legado gN3_05 sai de produção. Delta observado: +1 Composer, -1 legado.",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W57-N3.08",
    competence: "N3.08",
    rationale: "F34 Voltar pelo Dez — quinta das doze competências sem ficha autoral, e o espelho da F33: a mesma estação intermediária do dez, na direção contrária. Palco composto TenFrame duplo + InteractiveNumberLine, as duas primitivas que a ficha nomeia, com trabalhos distintos: as molduras mostram a decomposição como quantidade — os soltos saem primeiro, a caixa cheia se abre depois — e a reta mostra o mesmo percurso como distância, que é o suporte do erro suave que a ficha pede, e sobrevive até o L4 quando as molduras já saíram. Dois portões diferentes na mesma ficha: nos L1 e L2 chegar ao dez é a ação probatória, nos L3 e L4 é escolher o caminho, e o L5 é mental e não tem porta nem promete uma. A escolha estratégica da F31 volta aqui, porque 13−8 é mais curto completando do que voltando oito passos. A sonda cobrou uma correção antes da promoção: com total 19 ou 20 os soltos seriam 9 ou 10 e o subtraendo precisaria passar de nove, e aí não há unidade solta a tirar primeiro — a decomposição que a ficha ensina não existe naquele caso. Teto em 18, como todos os exemplos da própria F34. E o portão da CLASS-008 achou um erro de projeto meu antes que ele fosse servido: a evidência de família estava sendo emitida em todos os níveis, inclusive nos que não oferecem escolha nenhuma, afirmando que a criança demonstrou uma estratégia que ninguém lhe ofereceu. Agora só é emitida onde ela de fato escolhe. O SUBTRAI_INVERTIDO não é distrator qualquer: a ficha canônica diz que é o erro que depois vira o problema do reagrupamento na conta armada, e pegá-lo aqui é pegá-lo anos antes. O legado gN3_08 sai de produção. Delta observado: +1 Composer, -1 legado.",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W58-PE.01",
    competence: "PE.01",
    rationale: "F56 O Contador de Animais — sexta das doze competências sem ficha autoral, e o começo da estatística: a primeira vez que a criança lê um dado coletado por outra pessoa, precisando confiar na representação e extrair informação dela. Palco de pictograma em modo ícones sobre SingaporeBars, com rótulo à esquerda e desenhos repetidos à direita — a tabela que se aprende a LER, não a calcular. Os totais por linha ficam fora da tela até a resposta: escrevê-los ao lado apagaria a pergunta. A legenda é texto em palavras de propósito, porque o degrau da ficha é a criança ler a frase e agir sobre ela; escondê-la atrás de um ícone tornaria o IGNORA_ESCALA inevitável em vez de diagnosticável. A escada é a escala: um-para-um até o L3, dois no L4, e o L5 mistura, que é onde ela precisa olhar a legenda em vez de supor — e o L5 inverte a direção, indo de dados soltos para quantos desenhos a linha precisa ter. O §9 pede que o domínio inclua um caso com legenda de escala: virou evidenciasDistintas no L5, o único que mistura. Duas correções que a sonda e o teste nominal cobraram antes da promoção: as três contagens da tabela agora são distintas por construção, porque com duas linhas empatadas 'leu a linha errada' deixa de ser diagnosticável e o distrator some por coincidir com a resposta; e as duas outras linhas entram como distrator, não uma só, porque com uma o valor podia coincidir com resposta+escala e o nível caía para duas alternativas. O legado gPE_01 sai de produção. Delta observado: +1 Composer, -1 legado.",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W59-GM.03",
    competence: "GM.03",
    rationale: "F53 O Tesouro do Pirata — sétima das doze competências sem ficha autoral, e a primeira desta leva a trazer uma PRIMITIVA NOVA. Nenhuma existente servia: dinheiro não é quantidade contínua como a NumberLine, nem agrupamento posicional como o MaterialDourado, nem coleção homogênea como o ScatteredItems. É a primeira vez no currículo em que o valor NÃO se lê no objeto — é atribuído a ele. A primitiva Moedas desenha as moedas do Real com os diâmetros relativos do dinheiro de verdade, que não são a ordem dos valores: a de 25 é maior que a de 50. Desenhá-las todas iguais faria o erro VALOR_PELO_TAMANHO sumir da tela e com ele a chance de diagnosticá-lo; desenhá-las proporcionais ao valor ENSINARIA o erro. O contador do palco acumula o que a criança tocou, nunca o total da mesa, porque escrever o total seria o gabarito impresso — ele apoia a estratégia de ordenar da maior para a menor, que é o que a ficha ensina, e não responde por ela. A escada segue a ordem que a ficha canônica justifica: reconhecer o valor antes de qualquer operação, somar moedas iguais porque é multiplicação disfarçada, duas denominações de múltiplos compatíveis, compor um real que é a descoberta da equivalência, e por último a mistura, que exige lidar com múltiplos diferentes ao mesmo tempo. A checagem de primitiva bloqueadora da própria Matrix era unilateral para Moedas — escrita quando ela não existia — e ficou simétrica à que o repositório já tinha para Regua: enquanto a primitiva não existe ela deve bloquear, depois que existe não pode mais. A divergência ficha↔screen de GM.03 NÃO fecha e o delta não a reivindica: o cânone pede Moedas + NumberLine e o palco entrega Moedas; a tela que a F53 descreve não tem reta numérica, e inventar uma para satisfazer a métrica seria escrever UI que o cânone não pede. O legado gGM_03 sai de produção. Delta observado: +1 Composer, -1 legado.",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W60-N2.04",
    competence: "N2.04",
    rationale: "F37 A Centena — oitava das doze competências sem ficha autoral. É a dezena um nível acima, no mesmo material: dez cubinhos viram barra, dez barras viram placa, e quem entendeu o primeiro agrupamento entende o segundo em minutos. Palco composto MaterialDourado + Quadrado100, as duas primitivas que a ficha nomeia: o material mostra as três ordens como quantidade física, e o quadrado de cem aparece nos níveis que partem do numeral, dando tamanho à centena — uma placa é ISSO, e é essa ligação que impede a centena de virar mais um símbolo decorado. A escada é de alcance com faixas que não se sobrepõem: dentro de 199, de 200 a 500, acima de 500, e depois os dois níveis que partem do numeral. Nesses dois a resposta nunca é o próprio numeral, porque ele está escrito no enunciado — o L4 pergunta quantas placas montar e o L5 decompõe uma ordem. O erro NAO_AGRUPA_DEZENAS ganhou nome próprio de propósito: ele não diz que a criança errou a centena, diz que a dezena não está firme, e o resgate correto é para a N2.01, não mais exercício desta ficha. O legado gN2_04 sai de produção. Delta observado: +1 Composer, -1 legado, -1 divergência ficha↔screen, porque o palco novo entrega as duas primitivas que a ficha pede.",
    delta: { composer: 1, legacy: -1, divergences: -1 },
  },
  {
    id: "W61-N4.05",
    competence: "N4.05",
    rationale: "F99 Repartir e Medir — nona das doze competências sem ficha autoral. A mesma conta responde duas perguntas: na partição sabe-se quantos GRUPOS e descobre-se o TAMANHO; na medida sabe-se o TAMANHO e descobre-se quantos GRUPOS. O alvo da ficha é o SO_UM_SENTIDO — acertar partição e errar medida porque só se conhece um rosto. O palco usa o MESMO DragGroup nos dois modos, com o parâmetro no outro lugar: na partição o número de caixas é o divisor, na medida o boxCapacity é. Desenhar duas telas diferentes ensinaria que são duas contas diferentes, que é justamente o erro combatido. O L4 fecha a barra até a criança declarar qual sentido a pergunta pede, e a declaração é ação probatória: resolver sozinho não distingue quem reconheceu de quem tratou tudo como partição e acertou metade por sorte — sem ela o alvo da ficha fica invisível. Identificar o sentido errado emite diagnóstico próprio mesmo quando a conta sai certa. O L5 é o mais importante e o único em que o contexto decide o resto: doze crianças e vans de cinco precisam de três vans, não de duas e sobra dois, e parar no quociente é o erro que o nível existe para pegar. A escada é exata até o L3 e com resto do L4 em diante. Os níveis que alternam exigem os dois rostos por evidenciasDistintas; os de sentido fixo não etiquetam família, porque ali não há reconhecimento a afirmar. O legado gN4_05 sai de produção. Delta observado: +1 Composer, -1 legado.",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W62-N2.05",
    competence: "N2.05",
    rationale: "F65 Números Grandes — décima das doze competências sem ficha autoral. Arredondar é competência e não truque: é decidir qual precisão importa, e é a base da estimativa e do senso numérico. Palco composto InteractiveNumberLine + Quadrado100, as duas primitivas que a ficha nomeia. A reta desenha só a VIZINHANÇA do número — as duas marcas que o cercam e as nove entre elas —, não a escala inteira: uma reta de zero a nove mil esconderia justamente a distância que se quer medir. O quadrado de cem aparece nos níveis dessa ordem, para que arredondar para a centena não vire manipulação de dígitos. O caso do meio exato é sorteado de propósito e exigido por evidenciasDistintas nos três níveis que arredondam um número: é só nele que o cinco arredonda para cima deixa de ser regra decorada, porque em todos os outros a distância já decide e o ARREDONDA_SEMPRE_BAIXO acerta por acidente sem que ninguém veja. O L4 pergunta para qual ordem arredondar e o L5 estima uma soma; nenhum dos dois coloca a criança diante do empate, e por isso nenhum etiqueta família. A competência entra no registro da CLASS-009 como LEGITIMO: a resposta é sempre uma das duas marcas, mas as duas estão na reta e as duas estão na barra — escolher entre elas É a competência, e esconder a marca certa apagaria a pergunta em vez de protegê-la. A tela mostra onde o número cai, nunca qual marca está mais perto. O legado gN2_05 sai de produção. Delta observado: +1 Composer, -1 legado.",
    delta: { composer: 1, legacy: -1 },
  },
] as const;

const migrationDelta = (key: keyof CoverageDelta) => COVERAGE_MIGRATIONS.reduce((sum, migration) => sum + (migration.delta[key] ?? 0), 0);
export const COVERAGE_BASELINE = {
  ...COVERAGE_CLOSED_BASELINE,
  composer: COVERAGE_CLOSED_BASELINE.composer + migrationDelta("composer"),
  legacy: COVERAGE_CLOSED_BASELINE.legacy + migrationDelta("legacy"),
  fallback: COVERAGE_CLOSED_BASELINE.fallback + migrationDelta("fallback"),
  served: COVERAGE_CLOSED_BASELINE.served + migrationDelta("served"),
  divergences: COVERAGE_CLOSED_BASELINE.divergences + migrationDelta("divergences"),
  modeSwaps: COVERAGE_CLOSED_BASELINE.modeSwaps + migrationDelta("modeSwaps"),
  toolIntroductions: COVERAGE_CLOSED_BASELINE.toolIntroductions + migrationDelta("toolIntroductions"),
} as const;

type Status = "padrao-ouro" | "legado" | "fallback";
type OnboardingStatus = "n/a" | "presente" | "nao-comprovado" | "pendente-com-implementacao";
interface GraphNode { id: string; nome: string; strand: string; faixa: string; prereqs?: string[]; }
interface CanonicalFicha { ficha: string; file: string; competence: string; primitives: string[]; }
interface RuntimeSample { kinds: string[]; delivered: string[]; unknownKinds: string[]; error?: string; }
export interface CoverageMatrixRow {
  id: string; name: string; strand: string; faixa: string; prereqs: string[];
  canonicalFichas: string[]; canonicalFichaFiles: string[]; canonicalPrimitives: string[];
  implementation: string; generatorSource: string; runtimeKinds: string[]; runtimePrimitives: string[];
  composerSensei: string; tests: string[]; audits: string[]; status: Status; divergence: string[];
  modeSwaps: string[]; toolIntroductions: string[]; visualOnboarding: OnboardingStatus;
  visualOnboardingEvidence: string; missingPrimitives: string[]; debt: string[]; action: string;
  causalWave: number; downstream: number; causalOrder: string;
}
export interface CoverageMatrixCounts {
  competencies: number; authoredFichas: number; composer: number; legacy: number; fallback: number; served: number;
  divergences: number; modeSwaps: number; toolIntroductions: number; missingPrimitives: string[];
}
export interface CoverageMatrixResult { rows: CoverageMatrixRow[]; counts: CoverageMatrixCounts; failures: string[]; }

const graph = YAML.parse(read("curriculum/grafo_saga.yaml")) as { nodes: GraphNode[] };
const nodes = graph.nodes ?? [];
const ids = nodes.map(node => node.id);
const graphIds = new Set(ids);
const trackById = new Map(ALL_MATH_TRACKS.map(track => [track.id, track]));
const runtimeFichaById = new Map(JOURNEY_FICHAS.map(ficha => [ficha.id, ficha]));

function walkFiles(dir: string, predicate: (path: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(path, predicate)); else if (predicate(path)) out.push(path);
  }
  return out;
}
function readCanonicalFichas(): { entries: CanonicalFicha[]; blockCount: number } {
  const entries: CanonicalFicha[] = [];
  for (const file of readdirSync(join(ROOT, "AI_Studio_Lab/pedagogia/fichas")).filter(name => name.endsWith(".md")).sort()) {
    const relativeFile = join("AI_Studio_Lab/pedagogia/fichas", file);
    const source = read(relativeFile);
    const headings = [...source.matchAll(/^# FICHA\s+(\S+)\s+—\s+(.+)$/gm)];
    for (let i = 0; i < headings.length; i += 1) {
      const body = source.slice(headings[i].index, headings[i + 1]?.index ?? source.length);
      const identity = body.match(/^\*\*Competência:\*\*\s+((?:N[1-7]|AL|GE|GM|PE)\.\d{2})\b.*?\*\*Primitiva:\*\*\s+(.+?)(?:\s+·|$)/m);
      if (!identity) continue;
      const primitives = [...identity[2].matchAll(/`([A-Za-z][A-Za-z0-9]*)`\s*(?:\(modo ([^)]+)\))?/g)].map(match => match[2] ? `${match[1]}#${match[2].trim()}` : match[1]).filter(primitive => primitive !== "plain");
      entries.push({ ficha: headings[i][1], file: relativeFile, competence: identity[1], primitives });
    }
  }
  return { entries, blockCount: entries.length };
}
const canonical = readCanonicalFichas();
const fichaByCompetence = new Map<string, CanonicalFicha[]>();
for (const ficha of canonical.entries) if (graphIds.has(ficha.competence)) fichaByCompetence.set(ficha.competence, [...(fichaByCompetence.get(ficha.competence) ?? []), ficha]);
const canonicalPrimitives = (id: string) => uniq((fichaByCompetence.get(id) ?? []).flatMap(ficha => ficha.primitives));
const primitiveFiles = new Set(readdirSync(join(ROOT, "src/components/primitives")).filter(name => name.endsWith(".tsx") && !name.includes(".test.")).map(name => name.replace(".tsx", "")));

function observedKindMap(): Map<string, string[]> {
  const source = read("src/curriculum/conformidadeDeFichas.test.ts");
  const block = source.match(/const PRIMITIVA_DO_KIND:[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  const map = new Map<string, string[]>();
  for (const match of block?.[1].matchAll(/^\s*(?:"([^"]+)"|([A-Za-z0-9_-]+)):\s*\[([^\]]*)\],?/gm) ?? []) map.set(match[1] ?? match[2], [...match[3].matchAll(/"([^"]+)"/g)].map(item => item[1]));
  const fallback = new Map<string, string[]>();
  for (const entry of FICHA_RUNTIME_MAP) for (const kind of entry.rendererKinds) fallback.set(kind, uniq([...(fallback.get(kind) ?? []), entry.primitive]));
  for (const [kind, primitives] of fallback) if (!map.has(kind)) map.set(kind, primitives);
  return map;
}
function observedModeMap(): Map<string, string> {
  const source = read("src/curriculum/conformidadeDeFichas.test.ts");
  const block = source.match(/const MODO_DO_RUNTIME:[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  const map = new Map<string, string>();
  for (const match of block?.[1].matchAll(/^\s*(?:"([^"]+)"|([A-Za-z0-9_-]+)):\s*"([^"]+)",?/gm) ?? []) map.set(match[1] ?? match[2], match[3]);
  return map;
}
const primitiveByKind = observedKindMap();
const modeByRuntime = observedModeMap();
function deliveredPrimitives(q: any): { primitives: string[]; unknownKind?: string } {
  const kind = String(q?.kind ?? "");
  const bases = primitiveByKind.get(kind);
  if (!bases) return { primitives: [], unknownKind: kind || "<sem-kind>" };
  const rawMode = kind === "pareamento" ? "parear" : kind === "classificacao" ? "caixas/laços" : q?.uiProps?.modo;
  let qualified = [...bases];
  if (kind === "emojirow-riscar-f15" && rawMode === "riscar") qualified = bases.map(base => base === "EmojiRow" ? "EmojiRow#riscar" : base);
  else if (kind === "area") qualified = bases.map(base => base === "ArrayGrid" ? "ArrayGrid#área" : base);
  else if (kind === "moldura" && rawMode === "faltam") qualified = bases.map(base => base === "TenFrame" ? "TenFrame#flash" : base);
  else if (kind === "partes-iguais-f45") qualified = bases.map(base => base === "ShapeCanvas" ? "ShapeCanvas#partição" : base);
  else if (kind === "angulos-f78") qualified = bases.map(base => base === "ShapeCanvas" ? "ShapeCanvas#ângulo" : base);
  else if (kind === "jornal-turma-f64") qualified = bases.map(base => base === "SingaporeBars" ? "SingaporeBars#vertical" : base);
  else if (kind === "mapa-tesouro-f60") qualified = bases.map(base => base === "ShapeCanvas" ? "ShapeCanvas#grade" : base);
  else if (kind === "plano-cartesiano-f80") qualified = bases.map(base => base === "ShapeCanvas" ? "ShapeCanvas#grade" : base);
  else if (kind === "solidos-geometricos-f59") qualified = bases.map(base => base === "ShapeCanvas" ? "ShapeCanvas#3D" : base);
  else {
    const mode = rawMode ? modeByRuntime.get(String(rawMode)) : undefined;
    if (mode && bases.length) qualified = [`${bases[0]}#${mode}`, ...bases.slice(1)];
  }
  return { primitives: uniq([...qualified, ...qualified.map(item => item.split("#")[0])]) };
}
function sampleRuntime(id: string): RuntimeSample {
  const track: any = trackById.get(id);
  if (!track) return { kinds: [], delivered: [], unknownKinds: [], error: "track ausente" };
  if (track.contentStatus === "fallback") return { kinds: ["fallback"], delivered: [], unknownKinds: [] };
  try {
    const questions = [1, 2, 3, 4, 5].map(level => track.gen(level));
    const delivered: string[] = []; const unknownKinds: string[] = [];
    for (const question of questions) { const mapped = deliveredPrimitives(question); delivered.push(...mapped.primitives); if (mapped.unknownKind) unknownKinds.push(mapped.unknownKind); }
    return { kinds: uniq(questions.map(question => String(question.kind))), delivered: uniq(delivered), unknownKinds: uniq(unknownKinds) };
  } catch (error) { return { kinds: [], delivered: [], unknownKinds: [], error: error instanceof Error ? error.message : String(error) }; }
}
function missingPrimitives(id: string): string[] { return uniq(canonicalPrimitives(id).map(item => item.split("#")[0])).filter(base => !primitiveFiles.has(base)); }
function runtimeDivergence(id: string, sample: RuntimeSample): string[] {
  const track: any = trackById.get(id);
  if (!track || track.contentStatus === "fallback" || sample.error || sample.unknownKinds.length) return [];
  const delivered = new Set(sample.delivered);
  return canonicalPrimitives(id).filter(item => !delivered.has(item));
}
const prereqsById = new Map(nodes.map(node => [node.id, node.prereqs ?? []]));
const childrenById = new Map(nodes.map(node => [node.id, [] as string[]]));
for (const node of nodes) for (const prereq of node.prereqs ?? []) childrenById.set(prereq, [...(childrenById.get(prereq) ?? []), node.id]);
function closure(seed: string[], next: (id: string) => string[]): Set<string> { const seen = new Set<string>(); const queue = [...seed]; while (queue.length) { const id = queue.shift()!; if (seen.has(id)) continue; seen.add(id); queue.push(...next(id)); } return seen; }
const ancestors = (id: string) => closure(prereqsById.get(id) ?? [], current => prereqsById.get(current) ?? []);
const descendants = (id: string) => closure(childrenById.get(id) ?? [], current => childrenById.get(current) ?? []);
const depthMemo = new Map<string, number>();
function causalDepth(id: string): number { if (depthMemo.has(id)) return depthMemo.get(id)!; const prereqs = prereqsById.get(id) ?? []; const depth = prereqs.length ? Math.max(...prereqs.map(causalDepth)) + 1 : 0; depthMemo.set(id, depth); return depth; }
function visualIntroductions(id: string) {
  const before = ancestors(id); const exact = new Set([...before].flatMap(canonicalPrimitives)); const bases = new Set([...exact].map(item => item.split("#")[0]));
  const modeSwaps: string[] = []; const tools: string[] = []; const roots: string[] = [];
  for (const primitive of canonicalPrimitives(id).filter(item => !exact.has(item))) { const [base, mode] = primitive.split("#"); if (!before.size) roots.push(primitive); else if (mode && bases.has(base)) modeSwaps.push(`${base}→${mode}`); else tools.push(primitive); }
  return { modeSwaps, tools, roots };
}
function onboardingFor(id: string, status: Status, hasVisualIntroduction: boolean): { status: OnboardingStatus; evidence: string } {
  if (!hasVisualIntroduction) return { status: "n/a", evidence: "nenhuma estreia/troca visual nesta competência" };
  if (status === "fallback") return { status: "pendente-com-implementacao", evidence: "conteúdo ainda não é servido" };
  if (status === "legado") return { status: "nao-comprovado", evidence: "gerador legado não é governado pela ficha runtime autoral" };
  const ficha: any = runtimeFichaById.get(id);
  if (!ficha) return { status: "nao-comprovado", evidence: "Composer ativo sem ficha de Jornada inspecionável" };
  const tutorialMicros = (ficha.micros ?? []).filter((micro: any) => Array.isArray(micro?.params?.tutorial) && micro.params.tutorial.length > 0);
  if (tutorialMicros.length) return { status: "presente", evidence: `tutorial runtime em ${tutorialMicros.map((micro: any) => micro.id).join(", ")}` };
  return { status: "nao-comprovado", evidence: "ficha runtime ativa não declara tutorial explícito para a estreia" };
}
function generatorMap(): Map<string, string> {
  const source = read("src/curriculum/motores/curriculum.ts"); const block = source.match(/const GENERATOR_MAP[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  return new Map(block ? [...block[1].matchAll(/"((?:N[1-7]|AL|GE|GM|PE)\.\d{2})"\s*:\s*([A-Za-z0-9_]+)/g)].map(match => [match[1], match[2]] as const) : []);
}
const legacyGeneratorById = generatorMap();
const testFiles = walkFiles("src", path => /\.(?:test|spec)\.(?:ts|tsx|js|jsx)$/.test(path));
const testsById = new Map<string, string[]>();
for (const file of testFiles) { const source = read(file); for (const id of ids) if (source.includes(id)) testsById.set(id, [...(testsById.get(id) ?? []), file]); }
const GLOBAL_AUDITS = ["npm run auditar", "npm run fichas:auditar", "npm run fichas:conferir", "npm run grafo:check"];
function statusFor(id: string): Status { const source = String((trackById.get(id) as any)?.generatorSource ?? "fallback"); return source === "composer" ? "padrao-ouro" : source === "legacy" ? "legado" : "fallback"; }
function implementationFor(id: string, status: Status): string { const legacy = legacyGeneratorById.get(id); if (status === "padrao-ouro") return legacy ? `Composer ativo; rollback legado ${legacy}` : "Composer ativo; estreia sem gerador legado"; if (status === "legado") return `gerador legado ${legacy ?? "<não identificado>"}`; return "gFallback / placeholder Em construção"; }
function actionFor(row: Omit<CoverageMatrixRow, "action">): string {
  if (row.missingPrimitives.length) return `construir ${row.missingPrimitives.join(" + ")} com builder/onboarding/teste; só depois alinhar/ativar a ficha`;
  if (row.status === "fallback") return "fábrica curricular: materializar ficha no Composer/builder, validar screen, onboarding e regressões antes de ativar";
  if (row.divergence.length) return `alinhar entrega real à ficha (${row.divergence.join(" + ")}); preservar proveniência e testar os 5 níveis`;
  if (row.status === "legado") return "migrar legado para ficha/Composer por regression-first, com paridade ou divergência pedagógica explicitamente justificada";
  if ((row.modeSwaps.length || row.toolIntroductions.length) && row.visualOnboarding !== "presente") return "criar/validar onboarding ou ponte visual para a estreia antes de tratá-la como continuidade";
  if (row.tests.length === 0) return "preservar implementação; ao tocar neste nó, nascer teste nominal além dos gates globais";
  return "preservar; nenhuma dívida objetiva detectada pela Coverage Matrix";
}
function buildRows(): CoverageMatrixRow[] {
  return nodes.map(node => {
    const status = statusFor(node.id); const sample = sampleRuntime(node.id); const visual = visualIntroductions(node.id); const onboarding = onboardingFor(node.id, status, Boolean(visual.modeSwaps.length || visual.tools.length));
    const divergence = runtimeDivergence(node.id, sample); const missing = missingPrimitives(node.id); const tests = sorted(testsById.get(node.id) ?? []); const debt: string[] = [];
    if (status === "fallback") debt.push("sem conteúdo real servido"); if (status === "legado") debt.push("ficha pronta ainda servida por legado"); if (sample.error) debt.push(`runtime não amostrado: ${sample.error}`); if (sample.unknownKinds.length) debt.push(`kind sem tradução: ${sample.unknownKinds.join(", ")}`); if (divergence.length) debt.push(`ficha↔screen diverge: faltam ${divergence.join(" + ")}`); if (missing.length) debt.push(`primitiva bloqueadora ausente: ${missing.join(" + ")}`); if (visual.modeSwaps.length) debt.push(`troca de linguagem visual: ${visual.modeSwaps.join(", ")}; onboarding=${onboarding.status}`); if (visual.tools.length) debt.push(`ferramenta nova sem precedente: ${visual.tools.join(", ")}; onboarding=${onboarding.status}`); if (tests.length === 0) debt.push("sem teste nominal por ID; apenas cobertura transversal dos gates");
    const base: Omit<CoverageMatrixRow, "action"> = {
      id: node.id, name: node.nome, strand: node.strand, faixa: node.faixa, prereqs: node.prereqs ?? [], canonicalFichas: uniq((fichaByCompetence.get(node.id) ?? []).map(ficha => ficha.ficha)), canonicalFichaFiles: uniq((fichaByCompetence.get(node.id) ?? []).map(ficha => ficha.file)), canonicalPrimitives: canonicalPrimitives(node.id), implementation: implementationFor(node.id, status), generatorSource: String((trackById.get(node.id) as any)?.generatorSource ?? "fallback"), runtimeKinds: sample.kinds, runtimePrimitives: sample.delivered,
      composerSensei: status === "fallback" ? "conteúdo real ausente; não pode produzir evidência/recompensa como competência servida" : status === "padrao-ouro" ? "Composer ativo; elegibilidade continua vindo de learner state + DAG/Sensei" : "Composer inativo; legado continua sujeito à elegibilidade de learner state + DAG/Sensei",
      tests, audits: GLOBAL_AUDITS, status, divergence, modeSwaps: visual.modeSwaps, toolIntroductions: visual.tools, visualOnboarding: onboarding.status, visualOnboardingEvidence: onboarding.evidence, missingPrimitives: missing, debt, causalWave: causalDepth(node.id), downstream: descendants(node.id).size, causalOrder: `W${causalDepth(node.id)} · impacto ${descendants(node.id).size}`,
    };
    return { ...base, action: actionFor(base) };
  });
}
function countRows(rows: CoverageMatrixRow[]): CoverageMatrixCounts { return { competencies: rows.length, authoredFichas: canonical.blockCount, composer: rows.filter(row => row.status === "padrao-ouro").length, legacy: rows.filter(row => row.status === "legado").length, fallback: rows.filter(row => row.status === "fallback").length, served: rows.filter(row => row.status !== "fallback").length, divergences: rows.filter(row => row.divergence.length).length, modeSwaps: rows.reduce((sum, row) => sum + row.modeSwaps.length, 0), toolIntroductions: rows.reduce((sum, row) => sum + row.toolIntroductions.length, 0), missingPrimitives: sorted(new Set(rows.flatMap(row => row.missingPrimitives))) }; }
function validate(rows: CoverageMatrixRow[], counts: CoverageMatrixCounts): string[] {
  const failures: string[] = []; const check = (ok: boolean, message: string) => { if (!ok) failures.push(message); };
  check(nodes.length === COVERAGE_BASELINE.competencies, `grafo: ${nodes.length} vs ${COVERAGE_BASELINE.competencies}`); check(new Set(ids).size === nodes.length, "grafo contém IDs duplicados"); check(rows.length === COVERAGE_BASELINE.competencies, `matriz: ${rows.length} vs ${COVERAGE_BASELINE.competencies}`); check(canonical.blockCount === COVERAGE_BASELINE.authoredFichas, `fichas autorais: ${canonical.blockCount} vs ${COVERAGE_BASELINE.authoredFichas}`); check(fichaByCompetence.size === COVERAGE_BASELINE.competencies, `cobertura de ficha: ${fichaByCompetence.size}/90`); check(counts.composer === COVERAGE_BASELINE.composer, `Composer ativo divergiu: ${counts.composer} vs ${COVERAGE_BASELINE.composer}`); check(counts.legacy === COVERAGE_BASELINE.legacy, `legado divergiu: ${counts.legacy} vs ${COVERAGE_BASELINE.legacy}`); check(counts.fallback === COVERAGE_BASELINE.fallback, `fallback divergiu: ${counts.fallback} vs ${COVERAGE_BASELINE.fallback}`); check(counts.served === COVERAGE_BASELINE.served, `servido divergiu: ${counts.served} vs ${COVERAGE_BASELINE.served}`); check(counts.divergences === COVERAGE_BASELINE.divergences, `divergências ficha↔screen divergiram: ${counts.divergences} vs ${COVERAGE_BASELINE.divergences}`); check(counts.modeSwaps === COVERAGE_BASELINE.modeSwaps, `trocas visuais divergiram: ${counts.modeSwaps} vs ${COVERAGE_BASELINE.modeSwaps}`); check(counts.toolIntroductions === COVERAGE_BASELINE.toolIntroductions, `estreias divergiram: ${counts.toolIntroductions} vs ${COVERAGE_BASELINE.toolIntroductions}`);
  const closedMissing = new Set<string>(COVERAGE_CLOSED_BASELINE.missingPrimitives); for (const primitive of counts.missingPrimitives) check(closedMissing.has(primitive), `nova primitiva bloqueadora ausente: ${primitive}`);
  check(new Set(COVERAGE_MIGRATIONS.map(migration => migration.id)).size === COVERAGE_MIGRATIONS.length, "ledger da Coverage Matrix contém IDs de migração duplicados"); for (const migration of COVERAGE_MIGRATIONS) check(graphIds.has(migration.competence), `${migration.id}: competência inexistente ${migration.competence}`);
  for (const row of rows) { const sample = sampleRuntime(row.id); check(row.canonicalFichas.length > 0, `${row.id}: sem ficha canônica`); check(Boolean(trackById.get(row.id)), `${row.id}: sem Track runtime`); check(row.action.length > 0, `${row.id}: sem ação`); check(!sample.error, `${row.id}: falha runtime: ${sample.error ?? "?"}`); check(!sample.unknownKinds.length, `${row.id}: kind sem tradução: ${sample.unknownKinds.join(", ")}`); if (row.status === "padrao-ouro") check(!row.missingPrimitives.length, `${row.id}: padrão-ouro exige ${row.missingPrimitives.join(", ")}`); for (const prereq of row.prereqs) { check(graphIds.has(prereq), `${row.id}: prereq inexistente ${prereq}`); check(causalDepth(prereq) < row.causalWave, `${row.id}: ordem causal não põe ${prereq} antes`); } }
  const moedas = rows.filter(row => row.missingPrimitives.includes("Moedas")).map(row => row.id); const regua = rows.filter(row => row.missingPrimitives.includes("Regua")).map(row => row.id); const gm03Migrated = COVERAGE_MIGRATIONS.some(migration => migration.competence === "GM.03"); if (gm03Migrated || primitiveFiles.has("Moedas")) check(!moedas.includes("GM.03"), `Moedas já existe e não deveria bloquear GM.03; bloqueia ${moedas.join(", ") || "ninguém"}`); else check(moedas.includes("GM.03"), `Moedas deveria bloquear GM.03; bloqueia ${moedas.join(", ") || "ninguém"}`);
  const gm05Migrated = COVERAGE_MIGRATIONS.some(migration => migration.competence === "GM.05"); if (gm05Migrated || primitiveFiles.has("Regua")) check(!regua.includes("GM.05"), `Regua já existe e não deveria bloquear GM.05; bloqueia ${regua.join(", ") || "ninguém"}`); else check(regua.includes("GM.05"), `Regua deveria bloquear GM.05; bloqueia ${regua.join(", ") || "ninguém"}`);
  return failures;
}
export function buildCoverageMatrix(): CoverageMatrixResult { const rows = buildRows().sort((a, b) => a.causalWave - b.causalWave || b.downstream - a.downstream || a.id.localeCompare(b.id)); const counts = countRows(rows); return { rows, counts, failures: validate(rows, counts) }; }
const escapeCell = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, " ");
export function renderCoverageMatrixMarkdown(result = buildCoverageMatrix()): string {
  const { rows, counts } = result; const lines = ["# Coverage Matrix — SAGA", "", "> Projeção gerada das fontes reais. O gate executável é a autoridade; divergência exige investigação.", "", "## Baseline reconciliado", "", `- ${counts.competencies} competências / ${counts.authoredFichas} fichas autorais;`, `- Composer: ${counts.composer}; legado: ${counts.legacy}; fallback: ${counts.fallback}; servido: ${counts.served};`, `- divergências ficha↔screen: ${counts.divergences}; trocas visuais: ${counts.modeSwaps}; estreias: ${counts.toolIntroductions};`, `- primitivas bloqueadoras: ${counts.missingPrimitives.join(", ") || "nenhuma"}.`, "", "## Ordem causal", "", "Ondas W0→Wn seguem profundidade no DAG; dentro da onda, maior impacto vem primeiro. Primitiva ausente precede ativação e dependentes.", "", "| ID | Curriculum Graph | Ficha canônica | Implementação real | Screen/primitiva | Composer/Sensei | Testes/auditoria | Status | Onboarding | Dívida/bloqueio | Ação necessária | Ordem causal |", "|---|---|---|---|---|---|---|---|---|---|---|---|"];
  for (const row of rows) { const graphCell = `${row.name}; pré: ${row.prereqs.join(", ") || "raiz"}`; const fichaCell = `${row.canonicalFichas.join("+")} · ${row.canonicalPrimitives.join(", ") || "sem primitiva"}`; const runtimeCell = `${row.runtimeKinds.join(", ") || "—"} → ${row.runtimePrimitives.join(", ") || "sem primitiva"}`; const testsCell = row.tests.length ? `${row.tests.slice(0, 3).join(", ")}${row.tests.length > 3 ? ` +${row.tests.length - 3}` : ""}; gates globais` : "gates globais; sem teste nominal"; const onboardingCell = `${row.visualOnboarding}: ${row.visualOnboardingEvidence}`; lines.push(`| ${row.id} | ${escapeCell(graphCell)} | ${escapeCell(fichaCell)} | ${escapeCell(row.implementation)} | ${escapeCell(runtimeCell)} | ${escapeCell(row.composerSensei)} | ${escapeCell(testsCell)} | ${row.status} | ${escapeCell(onboardingCell)} | ${escapeCell(row.debt.join("; ") || "nenhuma objetiva")} | ${escapeCell(row.action)} | ${row.causalOrder} |`); }
  return `${lines.join("\n")}\n`;
}
export function renderCoverageMatrixJson(result = buildCoverageMatrix()): string { return JSON.stringify(result, null, 2); }