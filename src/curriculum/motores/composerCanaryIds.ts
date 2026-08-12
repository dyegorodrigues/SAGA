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

  // W3 — F21: dezena como unidade composta; promovida somente após a cadeia
  // inativa (contrato/palco/boundary/a11y/evidência) ficar integralmente verde.
  "N2.01",

  // W4 — F19: reta numérica responsiva e interativa. Promoção somente após
  // contrato/palco/boundary/a11y + sonda Chrome 320/390/900 ficarem verdes.
  "N1.12",

  // W5 — F61: medida padronizada com régua. Promoção somente depois do canário
  // inativo passar suíte completa + Chrome real 320/390/900, L1–L5, tap/drag.
  "GM.05",

  // W6 — F29: comparação simbólica Grupo-backed. N1.05/W2 é pré-requisito
  // direto; promoção somente após suíte e Chrome real da ficha registrada/inativa.
  "N2.03",

  // W7 — F36: Quadrado100 10×10 com percurso autoral. N2.01/W3 é pré-requisito
  // direto; promoção após suíte + onboarding visual + Chrome 320/390/900 + 390×8.
  "N2.02",

  // W8 — F13: VisualAddition autoral com ação de juntar, retirada progressiva
  // de objetos e prova L4 sem suporte concreto. Promoção após suíte + onboarding
  // + Chrome 320/390/900 + transversal 390×8 verdes no SHA inativo final.
  "N3.01",

  // W9 — F15: EmojiRow#riscar autoral. A alfabetização explícita de X=saiu,
  // preservação geométrica do slot, domínio sem crédito por correção e Chrome
  // 320/390/900 ficaram verdes no SHA inativo 4218ac68 antes da promoção.
  "N3.02",

  // W10 — F14: counting on por estratégia. O Stage composto LinkingCubes +
  // NumberLine, diagnóstico da partida e resolução R0-A passaram suíte + Chrome
  // 320/390/900 + transversal 390×8 no SHA inativo 8ee8cad1 antes da promoção.
  "N3.03",

  // Bloco F0 promovido anteriormente.
  "N1.01",
  "N1.02",
  "N1.03",
  "N1.04",
  "N1.08",
  "AL.02",
] as const;
