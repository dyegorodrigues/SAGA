# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21 concluída; P22.1–P22.4 concluídas. Próxima tarefa exata: P22.5/GM.02.**

## 1. Leia antes de editar

1. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
2. [`DECISAO_P22_DIVIDAS_CURRICULARES.md`](./DECISAO_P22_DIVIDAS_CURRICULARES.md)
3. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
4. [`PLANO_POS_P22_FABRICA_CURRICULAR.md`](./PLANO_POS_P22_FABRICA_CURRICULAR.md)
5. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md)

Roadmaps de 5/ago são históricos. Não usar fila ou contagens antigas sem recalcular o runtime.

## 2. Git — regra de ouro

- repo: `dyegorodrigues/SAGA`;
- branch: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: open + draft/no-merge;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- workflow/script temporário deve se apagar no próprio lote.

## 3. Fechado — não reabrir sem falha objetiva

- P17 — N1.10/N1.11 e ponte perceptual→simbólica;
- P8 — Jardim e automaticidade separada da Jornada;
- P18 — `KindType` sem promessa autoral falsa;
- P19 — migrador único e dependências saneadas;
- P20 — save/sync por Firebase UID;
- P21.1 — registries, cobertura e proveniência;
- P21.2 — mapa de primitivas reconciliado com builder→kind→renderer real;
- **P22.1 — GM.12 promovida como estreia Composer**;
- **P22.2 — N4.09 promovida e telemetria de área corrigida**;
- **P22.3A — N1.07 reconciliada com sucessor, antecessor, ordenação e prereqs canônicos**;
- **P22.3B — JD4 registrada no Jardim como automaticidade de N1.07, separada da Jornada**;
- **P22.4 — N1.09 reconstruída como contagem flexível 10–20, início em N e regressiva, com rollout autoral completo**.

## 4. Estado após P22.4

- grafo: **90/90**;
- fichas Markdown: **93**;
- cobertura autoral: **89/90 competências**;
- única lacuna autoral: **GM.02**;
- Journey TS/registry: **30/30**;
- Composer registrado: **25/90**;
- Composer ativo: **25/90**;
- Composer registrado/inativo: **0/90**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- Jardim: **JD1–JD5 presentes**;
- mapa de primitivas: **20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente**.

N1.09 já possuía legado, por isso a união “servido sem placeholder” não cresce ao trocar a rota ativa para a ficha autoral.

## 5. P22.1 — GM.12 CONCLUÍDA

Gate final `31276881058`: **success**.

## 6. P22.2 — N4.09 CONCLUÍDA

Gate final `31277213310`: **success**.

Correção causal preservada: gabarito de área sem tag diagnóstica; somente distratores carregam misconception.

## 7. P22.3A — N1.07 CONCLUÍDA

Commit permanente: `d233591dcb7aa4b5a7883430fa769c5e9dae3823`.
Gate transacional: `31281685349`: **success**.
Clean follow-up: `31281842046`: **success**.

N1.07 cobre sucessor até 5/10, antecessor até 5/10 e ordenação de 3–4 numerais, com prereqs `N1.02 + N1.06`.

## 8. P22.3B — JD4 CONCLUÍDA

Commit permanente: `40c571e2d642f80deabb697ebe1d24e3ece450e7`.
Gate transacional: `31282358997`: **success**.

JD4 permanece em `dojoTracks`; `rt_alvo` mede fluência, nunca domínio conceitual da Jornada.

## 9. P22.4 — N1.09 CONCLUÍDA

N1.09 canônica é **Contagem até 20 e a partir de qualquer número**, prereqs `N1.04 + N1.02`.

Entregue:

- ficha Markdown autoral com nove seções;
- Journey TS + teste permanente;
- builder procedimental `contagem20Contract.ts` pela mesma porta usada em produção;
- L1 contar 10–15 objetos;
- L2 contar 10–20 objetos;
- L3 continuar três passos a partir de N interno;
- L4 regressiva de três passos, inclusive até zero;
- L5 mistura as três famílias;
- `rt_alvo = 20s` apenas como metadado de fluência, nunca como gate de mastery;
- telemetria causal: `NAO_CONTA_A_PARTIR_DE` e `DIRECAO_ERRADA`; erro sem hipótese forte não fabrica diagnosis;
- N1.09 registrada em Journey/Composer e ativa; legado `gVis_Sequence` preservado como rollback;
- exceção autoral N1.09 removida;
- auditor agregado restaurado sem contagem manual de fichas;
- teste de mapa runtime deixou de hardcodar fotografia histórica de contagem.

### Defeito visual descoberto pela sonda

O `ScatteredItems` aceitava uma posição ainda colidida depois de 50 tentativas aleatórias. Em conjuntos de 10–20 isso produziu sobreposição real.

Correção permanente:

- posições determinísticas em células invisíveis embaralhadas;
- jitter pequeno e limitado;
- objetos responsivos para 10–20 itens;
- teste geométrico permanente `ScatteredItems.layout.test.ts`.

### Evidência de fechamento

- baseline semântico completo: CI `31286476155` = **success**;
- sonda pela rota real `track.gen`: CI `31286955931` = **success**;
- sonda N1.09 L1–L5: 390/320/900 px, zero vazamento/colisão/texto invisível/coberto;
- suíte nessa rodada: **130 arquivos / 2.197 testes**;
- cleanup: `postbuild` e injetor P22.4 removidos;
- CI limpo pós-cleanup: `31287106974` = **success**.

## 10. PRÓXIMA TAREFA EXATA — P22.5 GM.02

GM.02 canônica é **Tempo cotidiano** e não pode ser sequestrada por massa/capacidade (GM.12).

Contrato do lote:

1. manter `prereqs: []` conforme grafo;
2. linguagem pré-leitora: áudio e iconografia carregam a instrução; texto é apoio;
3. L1 partes do dia — manhã/tarde/noite;
4. L2 ontem/hoje/amanhã;
5. L3 sequência dos dias da semana;
6. L4 ordenar eventos cotidianos;
7. L5 recuperação mista;
8. ficha Markdown + Journey TS + teste permanente;
9. registro Journey/Composer + promoção, preservando legado como rollback;
10. remover a última exceção autoral apenas quando a ficha existir;
11. nenhuma resposta correta pode carregar misconception;
12. `rt_alvo` do L5 é metadado de fluência, nunca domínio;
13. sonda real + gates completos antes de declarar P22 encerrada.

Antes de adicionar a 94ª ficha, remover estruturalmente o `EXPECTED_FICHAS = 93` do auditor específico — não trocar 93 por 94.

## 11. Depois de P22

Sequência já persistida em `PLANO_POS_P22_FABRICA_CURRICULAR.md`:

1. auditoria longitudinal da máquina de estados adaptativa — `GameLoop answer → evidence → mastery/progression → persistence → Radar/review → recommendation → unlock`;
2. Coverage Matrix executável;
3. fábrica curricular em ondas pedagógicas;
4. mega auditoria pedagógica;
5. Dojo completo;
6. release hardening.

## 12. Portões

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check
```

Tela afetada exige sonda real.

> **Automaticidade treina o que já foi compreendido; existir no catálogo não basta — o caminho real da criança precisa estar provado.**