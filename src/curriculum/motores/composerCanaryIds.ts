/**
 * ÚNICA lista declarativa dos nós servidos pelo Composer em produção.
 *
 * Regra operacional:
 * - registrar uma ficha em `COMPOSER_FICHAS` NÃO ativa nada;
 * - promover um nó é adicionar exatamente um id aqui;
 * - rollback em runtime continua sendo `rollbackComposerCanary(id)`;
 * - cada alteração deste arquivo precisa atravessar `canaryContract.test.ts`.
 */
export const DEFAULT_COMPOSER_CANARY_IDS = [
  "N3.09",
  "N3.10",
  "N4.03",
  "N4.04",
  "N4.07",
  "N4.06",
  "N4.08",
  "N4.09",
  "N1.07",

  // Retomada F0 — promoções individuais já validadas.
  "N1.05",
  "N1.06",
  "N1.09",
  "N1.13",
  "N1.10",
  "N1.11",
  "AL.01",
  "GE.01",
  "GE.02",
  "GM.01",
  "GM.02",
  "GM.12",

  "N2.01",
  "N1.12",
  "GM.05",
  "N2.03",
  "N2.02",
  "N3.01",
  "N3.02",
  "N3.03",
  "AL.03",
  "N4.01",

  // W13 — F58: primeira estreia fallback-first.
  "GE.03",
  "AL.04",

  // W15 — F45: partes iguais. Inativo b32bee4c: CI 31760839221 + transversal 31760839210.
  "N5.01",

  // W16 — F72: fração como número. Inativo 4789636c: CI 31764367753 + transversal 31764367742.
  "N5.02",

  // W17 — F75: décimos e centésimos. O mesmo Quadrado100 é relido como 1 inteiro.
  // O canário inativo f52d74aa passou CI 31766412517 + transversal 31766412457 no mesmo SHA.
  "N6.01",

  // W18 — F73: frações equivalentes. Ficha já registrada no catálogo da Jornada;
  // canaryContract deriva seu REGISTRO de JOURNEY_FICHAS e valida a promoção aqui.
  "N5.03",

  // W19 — F69: divisão longa. Inativo 4ed4858d: CI 31798437057 + transversal 31798437091.
  "N4.10",

  // W20 — F63: perímetro como a volta; final inativo 72cf0375 passou CI 31808928178 + transversal 31808928379.
  "GM.07",

  // W21 — F46: igualdade como equilíbrio; inativo 72cf0375 passou CI 31808928178 + transversal 31808928379.
  "AL.05",

  // W22 — F87: porcentagem; inativo eed2b8ab passou CI 31820722322 + transversal 31820722277.
  "N6.03",

  // W23 — F78: ângulos; abertura dinâmica independente do comprimento dos lados.
  "GE.06",

  // W24 — F84: reta completa; inativo 1f912c8f passou CI 31825522496 + transversal 31825522510.
  "N7.01",

  // W25 — F64: Jornal da Turma; inativo 748724d0 passou CI 31842370575 + transversal 31842370542.
  "PE.02",

  // W26 — F81: área; o chão em unidades quadradas, reutilizando ArrayGrid.
  "GM.08",

  // W27 — F77: expressão numérica; materialização inativa dbd9c4c passou CI 31853918490 + transversal 31853918503.
  "AL.06",

  // W28 — F60: mapa do tesouro; materialização inativa e4c9349 com ShapeCanvas#grade.
  "GE.05",

  // W29 — F59: sólidos geométricos; promoção somente após o portão inativo exato.
  "GE.04",

  // W30 — F38: pares e ímpares; DragGroup em modo duplas.
  "N2.06",

  // W31 — F83: média e chance; promoção somente após o portão inativo exato.
  "PE.03",

  // W32 — F82: conversões e problemas de medida; NumberLine + Balanca.
  "GM.09",

  // W33 — F79: polígonos; ShapeCanvas + DragGroup.
  "GE.07",

  // W34 — F80: plano cartesiano; ShapeCanvas#grade.
  "GE.08",

  // W35 — F62: horas e minutos; Relogio + NumberLine.
  "GM.06",

  // W36 — F93: conversão de unidades; NumberLine + Balanca.
  "GM.10",

  // W37 — F85: operar com negativos; InteractiveNumberLine, domínio dos inteiros.
  "N7.02",

  // W38 — F89: linguagem das letras; SingaporeBars + plain.
  "AL.07",

  // W39 — F66: fábrica de retângulos; ArrayGrid. Inativo eb194d4b: CI 31976660344 + transversal 31976660441.
  "N2.07",

  // W40 — F91: círculo e áreas; ShapeCanvas. Inativo a771f960: CI 31981350463 + transversal 31981350512.
  "GE.09",

  // W41 — F92: volume e vistas; ArrayGrid#3D. Inativo 33ff7d34: CI 32001192111 + transversal 32001192091.
  "GE.10",

  // W42 — F70: primos e divisores; ArrayGrid + Quadrado100. Inativo 6129c5c8: CI 32034443674 + transversal 32034443648.
  "N4.11",

  // W43 — F71: dividir por dois dígitos; InteractiveVertical. Inativo 6c056a8d: CI 32044672592 + transversal 32044672629.
  "N4.12",

  // W44 — F74: somar frações; SingaporeBars. Inativo a41e6e9e: CI 32052726802 + transversal 32052726430.
  "N5.04",

  // W45 — F88: razão e proporção; SingaporeBars vinculada. Inativo fd93358b: CI 32074518557 + transversal 32074518604.
  "N6.04",

  // W46 — F90: equações como equilíbrio; Balanca. Inativo f3c7c4d4: CI 32085678926 + transversal 32085678976.
  "AL.08",

  // W47 — F76: contas com vírgula por valor posicional; InteractiveVertical + Quadrado100.
  // Inativo final 23e5be94: CI 32135341005 + transversal 32135340907, ambos success.
  "N6.02",

  // W48 — F94: volume de prismas por camadas; ArrayGrid#3D.
  // Inativo final fbc80f76: CI 32154072299 + transversal 32154072327, ambos success.
  "GM.11",

  // W49 — F95: estatística e chance; SingaporeBars + ArrayGrid.
  // Inativo final ba03c90b: CI 32169040052 + transversal 32169040050, ambos success.
  "PE.04",

  // W50 — F86: multiplicar frações; ArrayGrid#área.
  // Inativo final 340f219a: CI 32191494936 + transversal 32191494957 (9/9), ambos success.
  "N5.05",

  // Bloco F0 promovido anteriormente.
  "N1.01",
  "N1.02",
  "N1.03",
  "N1.04",
  "N1.08",
  "AL.02",

  // W51 — N4.02/F98. A ficha existia e nunca fora registrada no Composer: não
  // passara por nenhum dos dez gates. Registrada, os dez a aceitaram, e o
  // portão de giro que a CLASS-007 instalou nela apareceu no inventário.
  "N4.02",

  // W52 — N3.11/adição com reagrupamento. Mesma história da N4.02: ficha
  // pronta, nunca registrada. Os onze portões acharam nela o defeito que o
  // registro existe para achar — L1 e L2 declaravam params idênticos e o
  // `andaime` que os separava é prosa que nenhuma primitiva lê. Reparada a
  // escada CPA pela irmã N3.09, os onze aceitaram.
  "N3.11",

  // W53 — N3.04/F31. A primeira das doze competências que estavam SEM FICHA.
  // Não é estreia de conteúdo: o `gN3_04` legado já servia o nó. É a primeira
  // vez que ela tem ficha autoral, e portanto a primeira vez que passa por
  // portão nenhum. A F31 canônica foi transcrita inteira — os dois caminhos, o
  // custo de cada um, e a exigência do §9 de que duas das quatro tentativas
  // sejam casos em que completar é o caminho curto.
  "N3.04",

  // W54 — N3.06/F32. Palco composto ArrayGrid + TenFrame, como a ficha canônica
  // nomeia: a grade desenha as duas fileiras espelhadas do dobro, a moldura
  // mostra UMA delas dentro do dez. Preenchida com o total, a moldura seria a
  // resposta desenhada na tela.
  "N3.06",

  // W55 — N3.07/F33. A ficha canônica se chama a mais importante da faixa F1: é
  // onde os amigos do dez deixam de ser exercício e viram ferramenta. Fechar a
  // primeira caixa é ação probatória nos três níveis em que as molduras
  // existem; do L4 em diante elas somem e o portão some junto.
  "N3.07",

  // W56 — N3.05/F16. O triângulo aditivo: um trio, quatro contas. O vértice
  // perguntado recebe '?' literalmente, e as contas de apoio mascaram o mesmo
  // número — a primeira versão vazava por ali, escrevendo o todo oculto duas
  // vezes ao lado da pergunta.
  "N3.05",

  // W57 — N3.08/F34. O espelho da F33: a mesma estação do dez, na direção
  // contrária. Dois portões diferentes na mesma ficha — chegar ao dez enquanto
  // as molduras existem, escolher o caminho depois que elas somem.
  "N3.08",

  // W58 — PE.01/F56. O começo da estatística: a primeira vez que a criança lê
  // um dado coletado por outra pessoa. O degrau é a legenda de escala, e o L5
  // mistura as duas para que ela precise OLHAR a legenda em vez de supor.
  "PE.01",

  // W59 — GM.03/F53. Trouxe uma PRIMITIVA NOVA, `Moedas`: nenhuma existente
  // servia, porque dinheiro não é quantidade contínua, nem agrupamento
  // posicional, nem coleção homogênea. É a primeira vez no currículo em que o
  // valor não se lê no objeto — é atribuído a ele.
  "GM.03",

  // W60 — N2.04/F37. A dezena um nível acima, no mesmo material: dez barras
  // viram uma placa. O erro NAO_AGRUPA_DEZENAS tem nome próprio porque ele não
  // diz "errou a centena", diz "a dezena não está firme" — e o resgate certo é
  // para a N2.01, não mais exercício desta ficha.
  "N2.04",

  // W61 — N4.05/F99. Os dois rostos da divisão no MESMO componente, com o
  // parâmetro no outro lugar: desenhar duas telas diferentes ensinaria que são
  // duas contas diferentes, que é justamente o erro que a ficha combate.
  "N4.05",

  // W62 — N2.05/F65. Arredondar é escolher entre as duas marcas que cercam o
  // número, e o caso do meio exato é exigido de propósito: é só nele que a
  // convenção do cinco aparece, e só nele que arredondar sempre para baixo
  // deixa de acertar por acidente.
  "N2.05",

  // W63 — N3.12/F40 e W64 — N3.13/F41. As duas últimas das doze competências
  // que estavam sem ficha autoral. Com elas, as 90 competências do DAG têm
  // ficha, e a Jornada inteira é servida pelo Composer.
  "N3.12",
  "N3.13",
] as const;