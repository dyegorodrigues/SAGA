# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md`. Próximo bloqueante único: **cloud reconciliation**.

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main `68fad4c575e28959b2ca4776e9a541d6828b63f3` protegida;
- PR #29 open + draft + não mesclar/ready/auto-merge;
- não tocar Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head antes de qualquer edição;
- GitHub remoto é a fonte da verdade: não assumir que chat/terminal salvou sem verificar arquivo/commit/CI.

## Primeira leitura

1. `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md`
2. `PREAUDITORIA_CLOUD_RECONCILIATION_2026-08-09.md`
3. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
4. `RETOMADA.md`
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

## Fechado

P17–P22, cânone, Radar/source/persist, Sensei full DAG, Oficina causal, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone/dia civil, recomendador secundário por estrelas, Misto elegível e **Matrícula adaptativa**.

Matrícula funcional: head `f4ed86fcd70241e6324392b40bd457d44279ba61`; CI #744 / run `31314596574`; 149 arquivos / 2.309 testes; build/TypeScript/auditores/higiene/binários/Chrome verdes; artefato `9038385938` com telefone + tablet.

## Próxima tarefa — cloud reconciliation

Leia a pré-auditoria antes de editar. O problema a resolver é perda/mistura de estado, não refactor estético.

### Cadeia

`auth/UID → storage local escopado → cloud → escolha/reconcile → migrate/materialize → React → persist local imediato → debounce cloud → logout/troca de conta/link anonymous→Google → offline/reconexão → concorrência`.

### Método

1. regressões para nenhum/local-only/cloud-only/local mais novo/cloud mais novo/empate/carimbo inválido;
2. schema antigo e migração;
3. UID A × UID B no mesmo aparelho;
4. logout/login e cancelamento de pending write;
5. anonymous→Google;
6. offline/cache/reconexão;
7. duas abas e dois dispositivos com writes fora de ordem;
8. preservar campos pedagógicos novos;
9. provar bug antes do patch;
10. não inventar merge campo-a-campo sem contrato;
11. gates completos;
12. checkpoint.

### Firebase / participação do autor

**Não precisa de participação do autor para iniciar este bloco.** Não pedir token, service account, ID novo ou uso do Firebase Console. O trabalho lógico usa código, Vitest, mocks e contracts já existentes. Se surgir uma operação realmente exclusiva do Console/deploy, isolá-la como `DEPLOYMENT-ONLY`; não bloquear o restante nem presumir que o autor consegue fazê-la pelo tablet.

## Dívida curricular não perdida

26 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias a classificar; primitivas incompletas no inventário. A fábrica entra depois da Coverage Matrix.

## Fila posterior

simulação longitudinal → gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release.

## Gates

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
npm run sonda:sensei-dojo
```

**Uma competência só está pronta quando código, telemetria, persistência e experiência real da criança concordam.**
