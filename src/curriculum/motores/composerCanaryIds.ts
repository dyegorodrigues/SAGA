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

  // Bloco F0 promovido anteriormente.
  "N1.01",
  "N1.02",
  "N1.03",
  "N1.04",
  "N1.08",
  "AL.02",
] as const;
