/**
 * ÚNICA lista declarativa dos nós servidos pelo Composer em produção.
 *
 * Regra operacional:
 * - registrar uma ficha em `COMPOSER_FICHAS` NÃO ativa nada;
 * - promover um nó é adicionar exatamente um id aqui;
 * - rollback em runtime continua sendo `rollbackComposerCanary(id)`;
 * - cada alteração deste arquivo precisa atravessar `canaryContract.test.ts`.
 *
 * Separar esta lista do mecanismo evita reescrever `composerCanary.ts` a cada
 * promoção e torna o diff de ativação pequeno, auditável e reversível.
 */
export const DEFAULT_COMPOSER_CANARY_IDS = [
  "N3.09",
  "N3.10",
  "N4.03",
  "N4.04",
  "N4.07",
  "N4.06",
  "N4.08",
  "N1.07",

  // Retomada F0 — promoções individuais já validadas.
  "N1.06",
  "N1.13",
  "N1.10",
  "AL.01",
  "GE.01",
  "GE.02",
  "GM.01",

  // Bloco F0 promovido anteriormente.
  "N1.01",
  "N1.02",
  "N1.03",
  "N1.04",
  "N1.08",
  "AL.02",
] as const;
