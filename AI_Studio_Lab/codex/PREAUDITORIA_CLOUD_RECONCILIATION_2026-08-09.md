# Pré-auditoria — Cloud Reconciliation

> **Próximo bloco após a Matrícula adaptativa.** Documento de investigação: não declarar bug nem aplicar merge campo-a-campo sem regressão que prove a perda/corrupção.

## 1. Objetivo

Provar que o SAGA não perde, mistura nem ressuscita progresso ao alternar entre armazenamento local e Firestore, entre aparelhos, abas, sessões offline e identidades de autenticação.

Cadeia obrigatória:

`Firebase Auth / UID → storage local escopado → cloud state → escolha/reconciliação → migrate/materialize → React state → persist local imediato → sincronizador cloud → logout/troca de conta/link anonymous→Google → reconexão/concorrência`.

## 2. O que já existe e deve ser preservado

### `src/lib/reconciliacaoDeSaves.ts`

- `carimbar()` materializa Aula + Dojo antes do save e grava `State.updatedAt`;
- `escolherSaveMaisRecente()` compara o `updatedAt` do estado local e do cloud;
- save carimbado vence save sem carimbo;
- empate técnico resolve pela nuvem;
- um único lado existente é usado sem inventar conflito.

### `src/App.tsx`

O contrato atual já possui testes que verificam:

- cloud, storage local escopado por UID e storage legado são lidos antes do bootstrap decidir;
- `persist()` carimba **uma vez** e envia o mesmo objeto ao storage local e ao sincronizador;
- gravação local ocorre imediatamente;
- só a nuvem passa pelo debounce.

### `src/lib/firebase.ts`

- Firestore usa cache persistente multi-tab quando disponível;
- Google Auth;
- anonymous auth;
- link anonymous→Google;
- `saveStateToCloud(state, expectedUid)` descarta write se o usuário atual mudou;
- falhas de rede mantêm a aula/local funcionando;
- `loadStateFromCloud()` retorna `null` quando não há estado ou quando a rede não permite carregar.

### `src/lib/sincronizadorDeNuvem.ts`

Testes atuais já provam:

- muitas questões viram um único write final;
- UID viaja junto do estado que venceu o debounce;
- troca de conta pode cancelar pendência antiga;
- `descarregar()` faz flush imediato;
- falha offline não impede um write posterior.

## 3. Matriz mínima de regressão

Antes de alterar produção, cobrir explicitamente:

1. nenhum save local e nenhum cloud;
2. local-only;
3. cloud-only;
4. local com `updatedAt` mais novo;
5. cloud com `updatedAt` mais novo;
6. timestamps iguais;
7. timestamp ausente;
8. timestamp inválido;
9. schema antigo/estado que exige migração;
10. storage local pertencente ao UID A com usuário atual UID B;
11. logout A → login B no mesmo aparelho;
12. anonymous → Google preservando o mesmo usuário quando o Firebase link mantém UID;
13. offline no bootstrap e reconexão posterior;
14. writer antigo chegando depois de um estado cloud mais novo;
15. duas abas com writes concorrentes;
16. dois dispositivos com writes fora de ordem;
17. materialização de `progress.aula` / `progress.dojo_*` antes de persistir;
18. preservação de `dojoTracks`, `masteryEvidence`, `bank`, `reviewForce`, `lastDay`, `schemaVersion` e novos campos em migração/reconciliação.

## 4. Hipóteses que exigem prova

### H1 — last-write-arrival pode derrotar last-state-time

O cliente escolhe o save mais recente no bootstrap pelo `State.updatedAt`, mas `saveStateToCloud()` usa `setDoc(..., { merge: true })` sem condição transacional sobre o carimbo já armazenado. Deve-se provar se um write atrasado de dispositivo A pode chegar depois e sobrescrever um estado logicamente mais novo de B.

Não corrigir por reflexo: primeiro teste/modele o caso e defina o contrato de autoridade.

### H2 — envelope Firestore possui outro `updatedAt`

O documento cloud grava:

- `state: JSON.stringify(state)` — cujo `state.updatedAt` é curricular;
- `updatedAt: new Date().toISOString()` — horário do write Firestore.

Auditar qual deles é fonte de verdade. A reconciliação atual lê o JSON e usa `state.updatedAt`; não deixar o envelope externo ganhar autoridade por acidente.

### H3 — troca de identidade e storage legado

Auditar `storageIdentity.ts`, `bootstrapState.ts` e o listener `onAuthStateChanged` para garantir que:

- UID A nunca aparece para UID B;
- legado é adotado apenas pelo dono correto;
- pending cloud write de A é cancelado/recusado após troca para B;
- modo visitante/E2E não cria brecha no fluxo real.

### H4 — anonymous→Google

O Firebase `linkWithPopup` normalmente preserva o UID do usuário anonymous, mas o código deve ser testado pelo contrato que ele realmente assume. Verificar também os caminhos `loginWithGoogle()` e `linkAnonymousWithGoogle()` para não carregar um cloud state e substituir o local mais novo sem passar pela reconciliação.

### H5 — offline/cache não é o mesmo que ausência de cloud

`getDoc()` pode usar comportamento/cache do SDK. Auditar bootstrap offline e posterior reconexão: um `null` temporário não pode ser interpretado como autorização para destruir um cloud state mais novo depois.

## 5. Método de implementação

Para cada hipótese:

`emissor → estado/UID → storage local → write/read cloud → bootstrap/reconcile → migrate/materialize → consumidor → efeito → regressão`.

Regras:

- não inventar merge campo-a-campo;
- não usar estrelas/XP/RT como autoridade curricular;
- não permitir que um write sem dono explícito atravesse troca de conta;
- não depender de relógio de chegada do Firestore quando o contrato usa relógio lógico do estado sem antes resolver o conflito;
- preferir funções puras e adapters injetáveis para testes de concorrência;
- preservar modo offline-first: local deve continuar instantâneo.

## 6. Firebase Console — participação do autor

**Nenhuma ação do autor é necessária para começar ou para a maior parte deste bloco.**

A auditoria e as correções de reconciliação podem ser feitas com:

- código existente;
- Vitest;
- mocks/fakes de auth/storage/write;
- testes de bootstrap;
- testes de isolamento de UID;
- testes do sincronizador;
- testes estáticos de rules/contratos já presentes.

Não pedir ao autor token, service-account, ID novo ou configuração de Console para essa fase.

Se, só depois da lógica fechada, surgir algo que seja exclusivamente de implantação — por exemplo deploy de Firestore Rules, habilitar provider, TTL, índice ou configuração de Console — registrar separadamente como **DEPLOYMENT-ONLY**. Não bloquear o desenvolvimento nem presumir que o autor consegue executar pelo tablet.

## 7. Gates

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

Chrome só é obrigatório neste bloco se bootstrap/login/tela/fluxo visível for alterado; mudanças puras de reconciliação ainda passam pelo Chrome permanente do CI para detectar regressão geral.

## 8. Depois

simulação longitudinal → gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release.
