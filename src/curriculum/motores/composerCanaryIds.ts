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

  // Bloco F0 promovido anteriormente.
  "N1.01",
  "N1.02",
  "N1.03",
  "N1.04",
  "N1.08",
  "AL.02",
] as const;