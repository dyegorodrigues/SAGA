# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21 e P22 concluídas. Próxima tarefa exata: auditoria longitudinal da máquina adaptativa.**

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
- P22.1 — GM.12 promovida;
- P22.2 — N4.09 promovida e telemetria de área corrigida;
- P22.3A — N1.07 reconciliada com sucessor, antecessor, ordenação e prereqs canônicos;
- P22.3B — JD4 registrada no Jardim como automaticidade de N1.07, separada da Jornada;
- P22.4 — N1.09 reconstruída como contagem flexível 10–20, início em N e regressiva;
- **P22.5 — GM.02 reconstruída como Tempo cotidiano pré-leitor e promovida.**

## 4. Estado final de P22

- grafo: **90/90**;
- fichas Markdown: **94**;
- cobertura autoral: **90/90 competências**;
- exceções autorais canônicas: **0**;
- Journey TS/registry/AllFichas: **31/31**;
- Composer registrado: **26/90**;
- Composer ativo: **26/90**;
- Composer registrado/inativo: **0/90**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- Jardim: **JD1–JD5 presentes**;
- mapa de primitivas: **20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente**.

Dívidas de primitiva ainda visíveis, não resolvidas por decreto:

- `LinkingCubes` — renderer sem builder;
- `Moedas` — renderer sem builder;
- `SingaporeBars` — renderer sem builder;
- `VisualAddition` — renderer sem builder;
- `Quadrado100` — componente isolado;
- `Regua` — ausente.

## 5. P22.4 — N1.09 CONCLUÍDA

Evidência:

- baseline semântico: `31286476155` = **success**;
- sonda pela rota real `track.gen`: `31286955931` = **success**;
- 390/320/900 px, cinco níveis, zero achados após correção de `ScatteredItems`;
- CI limpo pós-cleanup: `31287106974` = **success**.

Correção visual permanente: `ScatteredItems` deixou de aceitar colisões após esgotar tentativas aleatórias e passou a usar células invisíveis embaralhadas + jitter determinístico, com teste geométrico permanente.

## 6. P22.5 — GM.02 CONCLUÍDA

GM.02 permanece **Tempo cotidiano**, prereqs `[]`.

Entregue:

- 94ª ficha Markdown com nove seções;
- Journey TS + teste permanente;
- builder procedimental pré-leitor pela mesma porta autoral usada em produção;
- L1 manhã/tarde/noite;
- L2 ontem/hoje/amanhã;
- L3 dias da semana — antes/depois;
- L4 ordem de acontecimentos cotidianos;
- L5 recuperação mista;
- `audioPrompt + audibleOptions + Option.say` tornam texto apoio, não pré-requisito;
- `rt_alvo=12s` como metadado de fluência apenas;
- resposta correta sem misconception;
- diagnósticos causais `DIRECAO_ERRADA`, `OFF_BY_ONE`, `ORDEM_ERRADA`;
- GM.02 registrada em Journey/Composer e ativa;
- legado parcial preservado como rollback;
- última exceção autoral removida;
- auditor específico deixou de hardcodar 93/94 fichas;
- testes globais de Journey passaram a atravessar a mesma porta autoral da produção;
- builders especializados de N1.09 e GM.02 passaram a propagar `rt_alvo → rt_max_s`.

### Defeitos compartilhados descobertos pela sonda

A primeira sonda GM.02 encontrou:

1. contraste do aviso “Toque para OUVIR” em **4,22:1**, abaixo de AA 4,5:1;
2. selo 🔊 absoluto cobrindo conteúdo de uma alternativa de ordem temporal.

Correção compartilhada em `src/index.css`:

- selo audível passa a ocupar espaço no fluxo do botão;
- aviso audível escurecido localmente para `#475569`;
- nenhuma exceção específica de GM.02.

### Evidência de fechamento

- CI semântico final: `31287744035` = **success**;
- primeira sonda `31287813598`: detectou os dois defeitos compartilhados acima;
- sonda corrigida pela rota real: `31288014568` = **success**;
- CI limpo sem `postbuild`/injetor: `31288136803` = **success**;
- suíte final do lote: **131 arquivos / 2.205 testes**;
- nenhuma bancada temporária P22 permanece.

## 7. PRÓXIMA TAREFA EXATA — máquina longitudinal adaptativa

Traçar o caminho real antes de alterar algoritmo:

`GameLoop answer → misconception/evidence → mastery/progression → persistência → Radar/revisão → recomendação → unlock`.

Perguntas bloqueantes da auditoria:

1. quem é o proprietário de cada mutação de `Progress`;
2. se mutações em múltiplos nós sobrevivem de `GameLoop` até `App.persist`;
3. se `reviewForce/lastDay` realmente persistem;
4. se tags emitidas pelo runtime são as mesmas que o Radar roteia;
5. se revisões vencidas entram de fato na recomendação;
6. se resgates do Radar chegam à trilha correta;
7. se mastery/unlock seguem o DAG e não atalhos históricos;
8. se Jardim continua incapaz de conceder domínio conceitual à mãe;
9. se cloud/local reconciliation preserva todas essas dimensões.

**Não corrigir motor por intuição. Primeiro provar a discrepância com source→state→consumer e teste de regressão.**

## 8. Depois da auditoria longitudinal

Seguir `PLANO_POS_P22_FABRICA_CURRICULAR.md`:

1. Coverage Matrix executável;
2. fábrica curricular em ondas;
3. mega auditoria pedagógica;
4. Dojo completo;
5. release hardening.

## 9. Portões

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