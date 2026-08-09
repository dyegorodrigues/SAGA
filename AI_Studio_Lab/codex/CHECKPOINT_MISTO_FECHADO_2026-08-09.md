# CHECKPOINT — MISTO ELEGÍVEL FECHADO

**Data:** 9/ago/2026  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única:** `codex/integrar-bloco-f0`  
**PR:** #29 — open + draft + NÃO MESCLAR  
**Main protegida:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora deste fluxo.

> **FONTE OPERACIONAL MAIS NOVA.** Este arquivo sucede `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md` para fins de retomada. O anterior continua histórico e auditável.

## Estado remoto confirmado

Head funcional fechado:

`ae47e417332fb7c02134bdda871c853535863838`

CI #733 / run `31311494765`: **SUCCESS integral**.

Passaram na mesma cabeça:

- auditoria curricular;
- auditoria/conformidade das fichas;
- grafo;
- TypeScript;
- suíte completa;
- build;
- `pr:check`;
- higiene do diff;
- guarda de binários;
- Chrome real `Sonda real Sensei`.

Artefato visual: `9037510112`.

PR #29 continua open + draft + unmerged. `main` e Creature Engine permaneceram intocados.

## Blocos fechados — não reabrir sem falha objetiva

1. P17–P22/cânone: 90 competências, 94 fichas, cobertura autoral 90/90;
2. Radar/source/persistência/DAG/Oficina causal;
3. Tutor↔Dojo com origem explícita `manual | prescribed`;
4. QA Chrome real permanente;
5. Jardim causal;
6. banco composto por source + `review/sig`;
7. telemetria v2 + Leitner no source real;
8. `LENTO_DEDOS` sem autoridade conceitual;
9. timezone/dia civil unificado;
10. recomendador secundário por estrelas removido do Sensei;
11. **Misto por repertório elegível**.

## Fechamento do Misto

### Problema provado

O runtime antigo montava o Misto a partir de `tracks[kid.grade]` e `mixedChallenge.ts` misturava tudo que recebia: banco, pior precisão e tracks aleatórias. Série voltava a funcionar como teto curricular e conteúdo ainda não conquistado podia entrar no desafio.

### Regra canônica aplicada

Misto é **interleaving opcional do repertório conquistado**. Não ensina conteúdo novo, não faz placement e não governa mastery/unlock.

### Implementação

- `canonicalMixedUniverse()` expande qualquer slice legado para `ALL_MATH_TRACKS`;
- tracks recebidas com o mesmo id apenas sobrescrevem binding/test double;
- `mixedEligibleTracks()` exige simultaneamente:
  - `dom === true`;
  - `tot > 0`;
  - `contentStatus !== "fallback"`;
- mínimo de duas competências elegíveis;
- banco só entra se o próprio source é elegível;
- pior precisão só é calculada dentro do pool elegível;
- sorteio aleatório só usa o pool elegível;
- track fora da antiga série pode entrar se realmente dominada;
- track apenas desbloqueada/nível alto, nunca praticada ou fallback não entra;
- pool insuficiente produz rota sintética neutra `isFallback`, portanto não vira evidência curricular;
- Sensei esconde o Misto quando indisponível;
- Dojo mantém a descoberta visual, mas mostra `Treino Mestre bloqueado` sem CTA até haver repertório suficiente;
- consumidores diagnósticos que omitem `mixedAvailable` ficam **fail-closed** (`false`).

### Regressões

- universo canônico versus slice de série;
- dominada versus apenas desbloqueada;
- dominada mas nunca praticada;
- track fora da antiga série;
- banco inelegível;
- pior precisão inelegível;
- pool insuficiente;
- Sensei sem CTA quando bloqueado;
- Dojo bloqueado/CTA liberado.

### QA real

O Chrome #732 revelou que a sonda ainda exigia o card antigo `Mistura Total (Dojô Geral)` no Tutor. Isso era uma expectativa velha, não um bug do produto. A sonda foi fortalecida:

- falha se o Misto aparecer indevidamente no Sensei do fixture insuficiente;
- falha se `Treino Livre Sugerido` reaparecer;
- entra no Dojo;
- exige `Treino Mestre bloqueado`;
- exige ausência de CTA;
- captura screenshot em telefone/tablet;
- volta ao Tutor;
- executa o round Dojo prescrito;
- mantém Jardim causal.

CI #733 fechou tudo verde.

## Dívida curricular — não perdida

Fonte detalhada: `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`.

- Composer 26/90;
- servido sem placeholder 51/90;
- 25 fichas prontas em legado;
- 39 fichas prontas ainda em fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta a classificar;
- primitivas incompletas: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

**Não iniciar a fábrica curricular antes da Coverage Matrix.**

## Próxima tarefa exata — Matrícula sem grade rígida

Pré-auditoria já provou que o problema é maior que uma linha em `App.tsx`.

### Runtime atual

`App.tsx` ainda chama:

```ts
buildMatriculaTrack(SUBJECTS[mat].tracks[kid.grade])
```

Em `matricula.ts`:

- existe `CORE_IDS` com 9 âncoras;
- `MAX_TRACKS = 6` corta a lista;
- portanto `N1.10`, `N1.11` e `N2.01` nunca são sondadas na missão atual;
- são 2 questões por âncora;
- resultado é semeado por `seedFromResults()`;
- a sessão é curta e gentil, mas pode subposicionar uma criança avançada.

Trocar apenas o caller para `ALL_MATH_TRACKS` **não resolve** o subplacement.

### Descoberta arquitetural importante

O `GameLoop` chama `onCommit` da resposta **antes** de gerar a próxima questão. Logo, a Matrícula pode manter uma sessão adaptativa em closure: registrar a resposta da sonda e decidir qual âncora vem em seguida sem reescrever o GameLoop.

### Cadeia a fechar

`universo canônico/DAG → âncora de placement → pergunta → resultado → próxima âncora/early stop → seeds → prerequisites/Sensei`.

### Regras

1. idade/série pode contextualizar UX, nunca limitar o teto;
2. só sondar tracks com conteúdo realmente servido (`contentStatus != fallback`);
3. começar gentil;
4. acertos consistentes permitem saltar para âncoras mais avançadas;
5. erros fazem permanecer/descer para sondas fundacionais, não obrigam uma criança iniciante a atravessar conteúdo impossível;
6. não inferir domínio em massa sem evidência defensável;
7. placement não compra `dom`; ele semeia ponto de partida/proficiência inicial;
8. preservar a missão curta e sem cara de prova;
9. regressões para iniciante, intermediário, avançado e conteúdo fallback;
10. gates completos + Chrome se fluxo visual for afetado.

## Fila posterior

cloud reconciliation → simulação longitudinal → gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening.

## Prompt de retomada

> Continue o SAGA a partir de `AI_Studio_Lab/codex/CHECKPOINT_MISTO_FECHADO_2026-08-09.md`. Reancore PR #29 e a branch `codex/integrar-bloco-f0`; mantenha a PR draft/unmerged e não toque na main nem no Creature Engine. Tudo até o Misto elegível está fechado no head `ae47e417332fb7c02134bdda871c853535863838`, CI #733/run `31311494765` integralmente verde, inclusive Chrome real. Não reabra blocos fechados sem falha objetiva. Comece pela Matrícula do checkpoint: não faça apenas `kid.grade → ALL_MATH_TRACKS`; use o fato de que `GameLoop` chama `onCommit` antes da próxima geração para construir um placement adaptativo, curto e gentil, usando DAG/conteúdo explícito como fonte, sem idade como teto. Rode todos os gates e atualize o checkpoint. A fábrica dos 39 continua bloqueada até a Coverage Matrix.
