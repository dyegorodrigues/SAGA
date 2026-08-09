# Decisão P22 — dívidas curriculares deliberadas

**Data:** 8/ago/2026
**Branch:** `codex/integrar-bloco-f0`
**Pré-requisito:** P21 fechada e governança de fontes de verdade estabilizada.

## Estado

P22 audit-first foi aberta no run `31276442048` = success.

Ordem deliberada:

1. P22.1 — GM.12;
2. P22.2 — N4.09;
3. P22.3A — N1.07 Jornada;
4. P22.3B — JD4 Jardim;
5. P22.4 — N1.09;
6. P22.5 — GM.02.

**P22.1–P22.4 estão concluídas. P22.5/GM.02 é o último lote antes do fechamento de P22.**

## 1. N1.09 — decisão executada em P22.4

`N1.09` permanece **Contagem até 20 e a partir de qualquer número**, prereqs `N1.04 + N1.02`.

O legado cobre somente continuação parcial de sequência e foi preservado como rollback. A ficha autoral agora mede conjuntos 10–20, início em N, regressiva e recuperação mista.

**Decisão executada:** não reutilizar N1.13; não devolver N1.09 ao JD4.

## 2. GM.02 — decisão mantida e agora em execução

`GM.02` é **Tempo cotidiano**: partes do dia, ontem/hoje/amanhã, dias da semana e ordenação de eventos.

O legado atual reduz a competência a “Manhã ou Noite?” e não cobre o nó inteiro.

**Decisão:** manter Tempo cotidiano e construir ficha autoral + TS pré-leitora, com áudio/iconografia/ordenação como linguagem primária. Massa/capacidade permanece em GM.12.

## 3. N1.07 ↔ JD4 — decisão executada

- Jornada N1.07 = compreensão conceitual;
- JD4 = treino posterior de automaticidade de sucessor/antecessor;
- `dojoTracks` separado do progresso da Jornada;
- `rt_alvo` nunca concede domínio conceitual.

## 4. P22.1 — GM.12 CONCLUÍDA

Gate final `31276881058`: **success**.

## 5. P22.2 — N4.09 CONCLUÍDA

Gate final `31277213310`: **success**.

Defeito corrigido: gabarito de área deixou de carregar misconception sentinela; somente distratores carregam hipótese diagnóstica.

## 6. P22.3A — N1.07 CONCLUÍDA

Commit permanente: `d233591dcb7aa4b5a7883430fa769c5e9dae3823`.
Gate transacional: `31281685349`: **success**.
Clean follow-up: `31281842046`: **success**.

N1.07 passou a cobrir sucessor, antecessor e ordenação conforme o grafo, com prereqs canônicos `N1.02 + N1.06`.

## 7. P22.3B — JD4 CONCLUÍDA

Gate transacional: `31282358997`: **success**.

JD4 entrou no Jardim com estado em `dojoTracks`, sem entrar no grafo/Journey registry e sem poder conceder domínio conceitual a N1.07.

## 8. P22.4 — N1.09 CONCLUÍDA

Entregue:

- 93ª ficha Markdown com nove seções;
- Journey TS + teste permanente;
- builder procedimental pela porta autoral de produção;
- L1 contar 10–15;
- L2 contar 10–20;
- L3 continuar três termos a partir de N interno;
- L4 regressiva simples, inclusive até zero;
- L5 recuperação mista;
- `rt_alvo=20s` como metadado de fluência apenas;
- telemetria causal `NAO_CONTA_A_PARTIR_DE` e `DIRECAO_ERRADA`;
- N1.09 ativa no Composer, legado preservado como rollback;
- exceção autoral N1.09 removida;
- auditor agregado deixou de hardcodar contagem de fichas;
- teste do mapa runtime deixou de hardcodar fotografia histórica do catálogo.

### Defeito real descoberto pela sonda

O `ScatteredItems` aceitava a última posição mesmo colidida depois de 50 tentativas aleatórias. Com 10–20 objetos, a sonda encontrou colisões reais.

Correção:

- grade invisível embaralhada determinística;
- jitter pequeno e limitado;
- tamanho responsivo;
- teste geométrico permanente.

### Evidência

- CI semântico `31286476155`: **success**;
- sonda pela rota real `track.gen` `31286955931`: **success**;
- 390/320/900 px, cinco níveis, zero vazamento/colisão/texto invisível/coberto;
- clean CI após remover `postbuild` e injetor `31287106974`: **success**.

Estado após P22.4:

- 90 nós;
- 93 fichas;
- 89/90 competências com cobertura autoral;
- Journey 30/30;
- Composer 25 registrados / 25 ativos / 0 inativos;
- único gap autoral: GM.02;
- mapa de primitivas continua 20 / 4 / 1 / 1.

## 9. P22.5 — GM.02 EM EXECUÇÃO

Contrato:

1. `prereqs: []`;
2. L1 manhã/tarde/noite;
3. L2 ontem/hoje/amanhã;
4. L3 sequência dos dias da semana;
5. L4 ordem de eventos cotidianos;
6. L5 recuperação mista;
7. áudio/iconografia são linguagem primária; texto é apoio;
8. `rt_alvo` positivo no L5 como metadado de fluência, nunca mastery;
9. ficha Markdown + Journey TS + teste permanente;
10. registro Journey/Composer + promoção ativa;
11. legado parcial preservado como rollback;
12. remover a exceção GM.02 somente quando a ficha existir;
13. eliminar estruturalmente `EXPECTED_FICHAS = 93` do auditor específico, não atualizar para 94;
14. resposta correta sem misconception; diagnóstico apenas quando causal;
15. sonda real + gates completos.

## 10. Regra de fechamento P22

P22 só termina quando:

- N1.07 e JD4 permanecerem semanticamente separados;
- N1.09 e GM.02 não forem mais lacunas autorais;
- cobertura autoral for 90/90 sem exceção canônica;
- registries e proveniência estiverem sincronizados;
- todos os auditores, testes, sondas afetadas, TypeScript, build e guards estiverem verdes;
- nenhuma bancada temporária restar na branch.

> **Promoção e automaticidade são consequências de evidência; não atalhos para uma tabela verde.**