# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`. Tudo até **Gamificação / Economia / Meta-jogo** está fechado; próxima tarefa única: **Coverage Matrix**.

## Leia primeiro

1. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md` — fonte operacional mais nova;
2. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md` — visão futura registrada, não fila atual;
3. `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md` — checkpoint histórico imediatamente anterior;
4. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — dívida curricular/visual/primitivas;
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia pedagógica;
6. `../pedagogia/BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md` e `DOJO_SAGA.md` — cânone pedagógico vigente.

Checkpoints antigos permanecem históricos. Não usar filas antigas como ordem vigente.

## Git — regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 deve permanecer **open + draft + unmerged**;
- não ready, não auto-merge, não rebase/merge na main;
- não tocar no Creature Engine nesta fila;
- não criar branch auxiliar;
- GitHub remoto é a fonte da verdade;
- antes de editar, reancorar PR/head remoto e verificar CI.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina causal; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; Simulação Longitudinal; **Gamificação / Economia / Meta-jogo**.

### Contratos permanentes da gamificação

- learner state é a verdade pedagógica;
- **Nível SAGA 1–100 pertence à criança/perfil, não ao mascote**;
- XP é vitalício e nunca compra mastery/unlock;
- moedas são gastáveis e compras são atômicas;
- velocidade não multiplica XP nem concede autoridade conceitual;
- criança lenta e correta recebe o mesmo XP de perfil;
- Misto dobra moedas, não XP/mastery;
- fallback não fornece evidência nem recompensa real;
- Atlas/insígnias curriculares derivam do Curriculum Graph/learner state;
- replay legítimo é prática nova, mas não repete o bônus único de primeira missão;
- double tap/retry/reload/materialização repetida não duplicam o mesmo evento técnico.

### Recibo remoto verificável da implementação

`98fb324ae20b20542120cea5edbd6982658bf6d2`, CI #812 / run `31325218446`: **159 arquivos / 2.377 testes**, auditorias, grafo, TypeScript, build, `pr:check`, higiene, binários e sonda real Sensei verdes. Artefato da sonda: `9041334019`.

Documentação de handoff pode estar em commits posteriores; por isso **sempre** verificar o head atual da PR e seu CI antes de editar, em vez de tratar o SHA acima como head eterno.

## Faça agora — COVERAGE MATRIX

Construir uma matriz executável, competência por competência:

`Curriculum Graph → ficha canônica → implementação real → screen/primitiva → Composer → testes/auditoria → status real → dívida/bloqueio → ação → ordem causal`.

Classificar pelo menos:

- servido real/canônico;
- legado aproveitável;
- fallback;
- divergência ficha↔screen;
- linguagem visual inadequada;
- ferramenta sem onboarding/estreia;
- primitiva bloqueadora;
- ausência/fragilidade de testes;
- bloqueio causal para outras competências.

**Não fabricar conteúdo antes de fechar a Coverage Matrix.** Primeiro transformar a dívida em mapa executável; depois atacar por ordem causal.

## Dívida curricular preservada

- 90 competências / 94 fichas autorais;
- Composer 26/90;
- servido sem placeholder 51/90;
- 25 legado;
- 39 fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

A fábrica continua **depois** da Coverage Matrix.

## Visão futura preservada — não executar agora

A visão do companheiro/NPC vivo, widget móvel, emoções/retratos, cuidados suaves, animais lutadores humanoides em HD pixel art, futuro fighting game/beat ’em up 2.5D e `Laboratório de Raciocínio / Thinking Lab` está registrada em `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`.

Esses itens podem ser aperfeiçoados depois. Não são absolutos e não autorizam tocar no Creature Engine nesta fila.

## Fila vigente

`Coverage Matrix → fábrica curricular → mega auditoria integrada → hardening/performance → release`.

Arte definitiva/Creature Engine/widget/jogo ficam em trilha futura separada até o núcleo matemático estar fechado.

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

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor. O meta-jogo celebra o caminho; ele nunca decide o que a criança sabe.**
