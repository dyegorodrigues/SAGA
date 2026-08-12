# Decisão P20 — identidade do save e reconciliação local × nuvem

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Commit funcional:** `f45509ca73739d93fe32986c9cf7bcc5aaf6337a`

## Estado

**P20 FECHADA.**

O gate transacional `P20 - isolamento de identidade do save`, run `31273869346`, passou:

- aplicação do patch;
- TypeScript;
- testes focais de identidade/bootstrap/reconciliação/sincronizador/migração;
- auditorias do SAGA;
- suíte completa;
- build;
- publicação;
- remoção da bancada temporária.

O commit funcional final recebeu um run de CI com conclusão `action_required`, mas esse run contém **zero jobs**. Não é uma suíte vermelha nem uma falha funcional. A validação executável completa é o gate transacional acima, que terminou `success` antes de publicar o commit.

## Problemas encontrados

### 1. Save local global × nuvem por UID

O estado local era persistido na chave global `mk-state-v1`, enquanto o Firestore separava por Firebase UID. Em um tablet compartilhado, duas contas podiam concorrer pelo mesmo save local.

### 2. Trabalho pendente sem identidade

O sincronizador guardava o último `State`, mas o destino cloud era resolvido no instante do envio. Uma troca de autenticação durante a janela do debounce podia fazer um estado nascido sob A tentar subir quando B já fosse o usuário atual.

### 3. Bootstrap de login podia instalar estado vazio cedo demais

`handleLoginSuccess` instalava o cloud state diretamente e, se ele não existisse, fazia `persist(defaultState())`. Isso permitia que o callback de autenticação decidisse estado antes da reconciliação local × cloud.

### 4. Upgrade anônimo → Google podia trocar identidade

O fluxo Google usava sign-in normal mesmo quando já havia Firebase user anônimo. O caminho correto para preservar o mesmo UID/família é vincular a credencial Google ao usuário anônimo.

## Arquitetura final

### Save local por identidade

- chave de produção: `mk-state-v1:<firebaseUid>`;
- chave histórica `mk-state-v1` permanece apenas como ponte de migração;
- `mk-state-v1-legacy-owner` registra quem já reivindicou o legado;
- legado já reivindicado não cruza para outro UID;
- se cloud e legado já contêm famílias, `kid.id` precisa dar evidência de mesma família para o legado concorrer.

Código:

- `src/lib/storageIdentity.ts`
- `src/lib/storageIdentity.test.ts`

### Bootstrap único

`src/lib/bootstrapState.ts` é a função pura que recebe:

- local escopado;
- local legado;
- dono do legado;
- cloud;
- migrador atual.

Regras:

1. cada candidato é validado/migrado antes da escolha;
2. schema incompatível não vira um estado vazio capaz de ganhar um empate;
3. não há merge campo-a-campo silencioso de dois snapshots integrais;
4. vence o snapshot válido mais recente;
5. local vencedor repara a cópia cloud;
6. cloud vencedor não é regravado sem necessidade;
7. `fresh` só nasce quando nenhum candidato válido existe e não é enviado automaticamente como forma de “apagar” cloud.

### Sincronizador com contexto

O sincronizador preserva sua API anterior (`agendar`, `descarregar`, `temPendencia`, relógio injetável) e acrescenta:

- contexto de UID junto do estado pendente;
- `cancelarPendencia()` na fronteira real de autenticação.

`saveStateToCloud(state, expectedUid)` recusa o envio se `auth.currentUser.uid !== expectedUid`.

### Autenticação

- usuário anônimo + Google → `linkWithPopup`, preservando UID;
- LoginScreen informa identidade; não instala estado;
- App/bootstrap é o único dono da reconciliação;
- logout descarrega o trabalho pendente antes de `signOut`.

## Invariantes permanentes

1. Estado de produção nunca volta a ser persistido diretamente em `mk-state-v1` global.
2. Um trabalho cloud carrega o UID que o originou.
3. Troca de UID cancela trabalho pendente da identidade anterior.
4. Login não pode instalar `defaultState()` antes do bootstrap.
5. Cloud e local são lidos antes da decisão.
6. Migração/validação acontece antes da comparação temporal.
7. P20 não altera o schema lógico do `State`; altera a identidade do contêiner que o guarda.

Guardas permanentes:

- `src/lib/storageIsolationContract.test.ts`
- `src/lib/bootstrapState.test.ts`
- `src/lib/storageIdentity.test.ts`
- `src/lib/reconciliacaoDeSaves.test.ts`
- `src/lib/sincronizadorDeNuvem.test.ts`

## O que P20 não tenta resolver

- colaboração multiwriter em tempo real;
- merge CRDT/campo-a-campo de dois aparelhos que jogaram simultaneamente offline;
- versionamento remoto por transação/compare-and-swap;
- política final de backup/exportação parental.

Esses pontos só viram trabalho se o produto realmente exigir concorrência simultânea entre aparelhos. Para o modelo atual — um snapshot completo com local imediato + cloud coalescida — a fronteira de identidade ficou explícita e testada.
