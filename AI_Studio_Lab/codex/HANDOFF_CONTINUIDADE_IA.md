# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`. Próximo bloqueante único: **Coverage Matrix**.

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main `68fad4c575e28959b2ca4776e9a541d6828b63f3` protegida;
- PR #29 open + draft + **não mesclar/ready/auto-merge**;
- não tocar Creature Engine nesta fila;
- não criar branch auxiliar;
- reancorar PR/head antes de editar;
- GitHub remoto é a fonte da verdade.

## Leia primeiro

1. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `BRIEFING_CODEX.md`
4. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`
5. `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md`
6. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
7. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`
8. cânone: `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `DOJO_SAGA.md`.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist; Sensei/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; Simulação Longitudinal; **Gamificação / Economia / Meta-jogo**.

### Recibo remoto verificável

Implementação revalidada no GitHub remoto em `98fb324ae20b20542120cea5edbd6982658bf6d2`.

CI #812 / run `31325218446`: **success integral** — 159 arquivos / 2.377 testes, auditorias, grafo, TypeScript, build, `pr:check`, higiene, binários e sonda real Sensei verdes; artefato da sonda `9041334019`.

Esse SHA é recibo verificável da implementação. A documentação de handoff pode avançar em commits posteriores, por isso o próximo agente deve reancorar o **head atual** da PR e seu CI, em vez de pressupor que qualquer SHA narrado é o head vigente.

### Contratos permanentes

- learner state é soberano para mastery/unlock;
- Nível SAGA 1–100 é do perfil da criança, não do mascote;
- XP é vitalício, não gastável e não compra aprendizagem;
- moedas são gastáveis e compras são atômicas;
- velocidade não multiplica XP nem streak conceitual;
- criança lenta e correta não recebe menos XP;
- Misto 2× afeta moedas, não XP/mastery;
- fallback não gera evidência nem recompensa real;
- Atlas/insígnias vêm do Curriculum Graph + learner state;
- retry/double tap/reload/materialização repetida não duplicam o mesmo evento técnico;
- replay legítimo é nova prática, sem repetir bônus único de primeira missão.

## Próxima tarefa — Coverage Matrix

Construir uma matriz executável de **todas as 90 competências**:

`grafo → ficha canônica → implementação real → screen/primitiva → Composer/Sensei → testes/auditoria → status → dívida/bloqueio → ação → ordem causal`.

A matriz precisa responder, sem inferência vaga:

- esta competência é realmente servida hoje?
- qual ficha governa a experiência?
- qual implementação/primitiva a criança recebe?
- existe fallback, legado ou divergência ficha↔screen?
- falta onboarding/estreia de ferramenta?
- existe primitiva bloqueadora?
- quais testes provam o comportamento?
- o que precisa ser feito antes dela por dependência causal?

Baseline revalidado no CI #812:

- 90 competências / 94 fichas autorais;
- 26 padrão-ouro / Composer 26/90;
- 25 legado;
- 39 fallback;
- 51/90 servidas sem placeholder;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

**Não fabricar conteúdo antes de a matriz fechar.** Se os números novos divergirem do baseline, investigar e reconciliar; não ajustar teste/relatório para bater com expectativa.

## Visão futura preservada

O documento `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md` guarda a direção de produto: companheiro/NPC persistente e meta-inteligente, widget móvel, emoções/retratos, necessidades suaves, cuidado/estudo/treino, animais lutadores humanoides em HD pixel art, futuro fighting game e beat ’em up 2.5D, além do `Laboratório de Raciocínio / Thinking Lab` para lógica, resolução de problemas, padrões, algoritmos, modelagem, dados, debugging, pensamento sistêmico/metacognição e ponte futura para programação/engenharia/robótica/IA.

Tudo isso pode ser refinado. Nada é absoluto. É visão de evolução e **não autoriza tocar no Creature Engine nesta fila**.

## Fila

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

**Uma competência só está pronta quando código, telemetria, persistência, ficha canônica e experiência real da criança concordam.**
