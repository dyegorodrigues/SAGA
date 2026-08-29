import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F31 — VOLTAR CONTANDO. Subtração tem dois caminhos, e a criança precisa dos dois.
 *
 * `11 − 3` é curto voltando: dez, nove, oito. `11 − 8` é curto completando: do
 * oito até o onze são três. Quem só aprendeu um caminho leva oito passos onde
 * bastavam três — e erra pelo caminho.
 *
 * **A escolha da estratégia é a competência.** É por isso que do L2 em diante
 * escolher o caminho é ação probatória: responder sem escolher mede subtração,
 * não flexibilidade, e as duas têm nomes diferentes porque são diferentes.
 */
const dominio = { acertos: 4, de: 4, sessoes: 2 };

/**
 * §9 da F31: das quatro tentativas do domínio, **duas** precisam ser problemas
 * em que completar é o caminho curto. Sem isso a coroa de "sabe escolher" cai
 * sobre quem usou sempre a mesma estratégia — que é o erro `ESTRATEGIA_UNICA`
 * que a própria ficha nomeia, e a CLASS-008 na forma exata.
 *
 * Vale de L2 a L5, os níveis que oferecem os dois caminhos. O L1 é só voltar:
 * ali não há escolha a fazer, e exigir duas famílias seria cobrar uma decisão
 * que o nível ainda não apresentou.
 */
const dominioComEscolha = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N3.04",
    "Demonstrar os dois caminhos: um caso em que voltar é mais curto e um em que completar é mais curto.",
  ),
};

const tutorial = [
  { fala: "Estamos no total, aqui em cima da reta.", show: { destacarTotal: true } },
  { fala: "Vamos voltar de um em um, contando os pulos.", show: { caminho: "voltar" } },
  { fala: "Onde a gente parou é a resposta.", show: { destacarChegada: true } },
];

export const N3_04: FichaCompetencia = {
  id: "N3.04",
  nome: "Voltar Contando",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N3.02", "N1.02", "N1.12"],

  howto: "Se o número que sai é pequeno, volte contando. Se é grande, conte do menor até o maior.",
  explain: "Olhe os dois números na reta. Conte quantos pulos separam eles.",

  distratores: [
    { regra: "conta_a_casa_de_partida", tag: "OFF_BY_ONE" },
    { regra: "junta_em_vez_de_tirar", tag: "INVERTE_DIRECAO" },
  ],

  niveis: {
    1: { primitiva: "numberline", micro: "voltar-guiado", andaime: "mao_fantasma" },
    2: {
      primitiva: "numberline",
      micro: "escolher-ate-10",
      andaime: "alto",
      acaoProbatoria: {
        id: "escolher-caminho",
        porque: "A competência da ficha é escolher entre voltar e completar. Aceitar o resultado sem a escolha mede subtração, não flexibilidade estratégica.",
      },
    },
    3: {
      primitiva: "numberline",
      micro: "comparar-passos",
      andaime: "medio",
      acaoProbatoria: {
        id: "escolher-caminho",
        porque: "A comparação dos passos só ensina depois de a criança ter apostado num caminho; mostrada antes, entrega qual é o curto.",
      },
    },
    4: {
      primitiva: "numberline",
      micro: "escolha-cobrada",
      andaime: "minimo",
      acaoProbatoria: {
        id: "escolher-caminho",
        porque: "Neste nível o caminho longo já conta como estratégia ineficiente; sem registrar a escolha não há o que diagnosticar.",
      },
    },
    5: {
      primitiva: "numberline",
      micro: "mental",
      andaime: "nenhum",
      rt_alvo: 12000,
      acaoProbatoria: {
        id: "escolher-caminho",
        porque: "Sem a reta, dizer por onde foi é a única evidência de que a criança escolheu em vez de decorar o resultado.",
      },
    },
  },

  micros: [
    { id: "voltar-guiado", fonte: "F31", alvo: "voltar contando até três casas, com a mão demonstrando o primeiro pulo", kinds: ["numberline"], params: { start: 0, end: 10, tutorial }, dominio },
    { id: "escolher-ate-10", fonte: "F31", alvo: "escolher entre voltar e completar em totais até dez", kinds: ["numberline"], params: { start: 0, end: 10 }, dominio: dominioComEscolha },
    { id: "comparar-passos", fonte: "F31", alvo: "ver quantos pulos custa cada caminho e reconhecer o mais curto", kinds: ["numberline"], params: { start: 0, end: 20 }, dominio: dominioComEscolha },
    { id: "escolha-cobrada", fonte: "F31", alvo: "escolher o caminho curto sem a comparação ser oferecida antes", kinds: ["numberline"], params: { start: 0, end: 20 }, dominio: dominioComEscolha },
    { id: "mental", fonte: "F31", alvo: "escolher e calcular sem a reta", kinds: ["numberline"], params: { start: 0, end: 20 }, dominio: dominioComEscolha },
  ],

  erros_tipicos: [
    { id: "off_by_one", descricao: "Conta a casa de partida como se fosse pulo." },
    { id: "inverte_direcao", descricao: "Vai para o lado errado da reta: junta em vez de tirar." },
    { id: "estrategia_ineficiente", descricao: "Escolhe voltar quando sai quase tudo — oito pulos onde bastavam três." },
    { id: "estrategia_unica", descricao: "Usa sempre o mesmo caminho, sem avaliar qual é o curto." },
  ],
};
