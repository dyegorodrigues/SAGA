import { TutStep } from "./tutorials";

// Migração das 14 coreografias legadas para dados puros (Contrato §7.4)
export const LEGACY_CHOREOGRAPHIES: Record<string, TutStep[]> = {
  numberline: [
    { say: "A reta numérica é um caminho com números ordenados." },
    { say: "Cada salto para frente soma um pouco." },
    { say: "Saltos para trás, tiram um pouco. Aonde nós vamos parar?", show: { saltarDe: 0 } }
  ],
  vertical: [
    { say: "Vamos armar a conta!" },
    { say: "Cada número no seu lugar: unidades com unidades, dezenas com dezenas." },
    { say: "Sempre começamos a resolver pelas unidades, do lado direito.", show: { destacarColuna: 'unidade' } }
  ],
  tenframe: [
    { say: "Esta é a caixa mágica: duas fileiras de cinco quadradinhos." },
    { say: "Uma fileira cheia já são cinco, sem precisar contar!", show: { destacarFileira: 1 } },
    { say: "Aí é só juntar os de baixo. Rapidinho você sabe quantos são.", show: { destacarFileira: 2 } }
  ],
  bond: [
    { say: "No alto fica o número inteiro, e embaixo os dois pedacinhos que formam ele.", show: { destacarTopo: true } },
    { say: "Se você sabe um pedaço, descobre o outro: juntos eles voltam a ser o de cima.", show: { destacarBases: true } },
    { say: "Esse é o segredo de somar de cabeça!" }
  ],
  weather: [
    { say: "O tempo muda! Quando o sol brilha sozinho no céu, é dia de sol.", show: "sol" },
    { say: "Quando a nuvem solta pinguinhos de água... é chuva!", show: "chuva" },
    { say: "E tem dia de frio, que pede casaco bem quentinho.", show: "frio" },
    { say: "Agora olhe o céu da cena e responda!" }
  ],
  grow: [
    { say: "Toda planta começa como uma sementinha, pequenina, dormindo na terra.", show: 1 },
    { say: "Com água e sol, nasce a raiz lá embaixo... e um brotinho verde aponta pra cima!", show: 2 },
    { say: "O brotinho cresce e ganha folhas.", show: 3 },
    { say: "Até virar uma árvore bem grande! É o ciclo da planta.", show: 4 }
  ],
  daypart: [
    { say: "O dia tem partes! De manhã, o sol está NASCENDO: fica baixinho, pertinho do chão, e o céu fica alaranjado.", show: "manha" },
    { say: "À tarde o sol já subiu: fica LÁ NO ALTO da nossa cabeça, e o céu bem azul.", show: "tarde" },
    { say: "E de noite o sol vai dormir: vem a lua e as estrelas!", show: "noite" },
    { say: "É sempre nessa ordem: manhã, tarde, noite. Agora olhe a cena e responda!" }
  ],
  emotion: [
    { say: "O rostinho conta como a gente se sente!" },
    { say: "Boca sorrindo e olhos brilhando: FELIZ.", show: "feliz" },
    { say: "Uma lágrima escorrendo: TRISTE.", show: "triste" },
    { say: "Testa franzida: BRAVO.", show: "bravo" },
    { say: "Olhos bem arregalados: com MEDO.", show: "medo" }
  ],
  lifestage: [
    { say: "A gente cresce a vida toda! Primeiro é um bebê, pequenininho no colo.", show: 1 },
    { say: "Depois vira criança, que corre e brinca.", show: 2 },
    { say: "Cresce mais e fica adulto.", show: 3 },
    { say: "E com muitos anos fica idoso, de cabelos branquinhos.", show: 4 }
  ],
  animal: [
    { say: "A galinha bota um ovo.", show: 1 },
    { say: "Dentro dele cresce um pintinho... e a casca começa a rachar!", show: 2 },
    { say: "O pintinho sai do ovo, pequenino e amarelinho.", show: 3 },
    { say: "Ele cresce, ganha penas... e vira uma galinha! E tudo recomeça.", show: 4 }
  ],
  count: [
    { say: "Olha só, para saber quantos tem, a gente toca em um de cada vez!", show: { tocarUmPorUm: true } }
  ],
  sum: [
    { say: "Vamos juntar! Primeiro a gente conta os de um lado...", show: { destacarGrupo1: true } },
    { say: "Depois a gente continua contando os do outro lado!", show: { destacarGrupo2: true } }
  ],
  subvis: [
    { say: "Para tirar, a gente começa com todos juntos...", show: { mostrarTodos: true } },
    { say: "E depois esconde os que vão embora!", show: { esconderTirados: true } }
  ],
  tens: [
    { say: "As barrinhas valem 10, e os cubinhos valem 1!", show: { destacarBarraCubinho: true } },
    { say: "Dez cubinhos juntos viram uma barra inteira!", show: { agruparDezena: true } }
  ]
};
