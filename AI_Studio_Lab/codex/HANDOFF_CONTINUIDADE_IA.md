# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** O handoff anterior de 8/ago foi superado e permanece no histórico Git. P21/P22, auditorias longitudinais iniciais, reconciliação canônica, Tutor↔Dojo, QA real e Jardim causal estão fechados. Próximo bloqueante: **identidade do banco de erros composto**.

## Regra de ouro

- Repo: `dyegorodrigues/SAGA`.
- Branch única: `codex/integrar-bloco-f0`.
- `main` protegida/imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- PR #29: open + draft; não mesclar, não ready, não auto-merge.
- Não tocar no Creature Engine.
- Não criar branch auxiliar.
- Workflow/script temporário não pode permanecer.
- Reancorar PR/head remoto antes de editar.

## Leia nesta ordem

1. `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `AUDITORIA_MOTORES_ADAPTATIVOS.md`
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Checkpoints/roadmaps anteriores são histórico quando falarem em P21, P22, reconciliação, origem do Dojo, sonda pendente ou Jardim causal como próximo passo.

## Fechado

- P17/P8/P18/P19/P20/P21/P22;
- 90 competências / 94 fichas / cobertura autoral 90/90;
- Radar tag→nó;
- Aula composta persiste no source real;
- Sensei full DAG, sem série como trilho;
- Oficina causal;
- reconciliação canônica + guard documental;
- Dojo `manual | prescribed` explícito de ponta a ponta;
- missão Dojo prescrita separada da Aula;
- QA real Chrome integrado ao CI;
- Jardim causal com prioridade `pré-requisito conceitual → Jardim provado → Oficina → Aula`.

Head funcional de fechamento: `15f73542ddb1f005fd228ac02461c5a71ea8adec`.

CI #671 / run `31307946962`: **SUCCESS integral**.

- 142 arquivos de teste;
- 2.278 testes;
- build;
- auditores;
- higiene;
- binários;
- Chrome real telefone + tablet.

Artefato da sonda: `9036527545`.

## Dívida curricular não perdida

- padrão-ouro: 26/90;
- servido sem placeholder: 51/90;
- 25 fichas prontas servidas por legado;
- 39 fichas prontas sem conteúdo servido;
- 21 divergências ficha↔tela observadas;
- 12 trocas de linguagem visual sem aviso;
- 44 estreias de ferramenta a classificar;
- primitivas incompletas: LinkingCubes, Moedas, SingaporeBars, VisualAddition, Quadrado100, Regua.

A lista exata está em `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`.

**Não iniciar a fábrica curricular ainda.** Ela volta depois da Coverage Matrix e dos motores de identidade/estado.

## Próxima tarefa — banco de erros composto

Pré-auditoria já encontrou uma hipótese concreta:

- `composeAula()` agrega bancos de vários tracks em `bankQs` global;
- embaralha o pool;
- cria uma closure por `RescuePlanItem`;
- para `error-bank`, a closure usa `bankQs.pop()` sem filtrar pelo source que originou o resgate.

Pode existir a cadeia incorreta:

`resgate planejado para A → item de banco de B → sourceTrackId=B`.

A persistência final pode acertar B, mas a agenda/razão que colocou o item na Aula fica incoerente.

### Método obrigatório

1. construir teste determinístico com bancos de pelo menos A e B;
2. provar/refutar a mistura antes de editar produção;
3. se provada, manter pool por source/rescue ou outra identidade explícita;
4. provar que retry/review remove ou atualiza o banco do source correto;
5. testar duas fontes na mesma Aula;
6. rodar todos os gates;
7. atualizar checkpoint.

Não misturar ainda com telemetria/Leitner. A identidade da telemetria da Aula é o bloco imediatamente seguinte.

## Fila posterior

1. telemetria/Leitner da Aula composta;
2. `LENTO_DEDOS`;
3. timezone/`lastDay`;
4. recomendador paralelo por estrelas;
5. Misto por repertório elegível;
6. Matrícula sem grade rígida;
7. cloud reconciliation;
8. simulação longitudinal;
9. gamificação/economia/mascote;
10. Coverage Matrix executável;
11. fábrica curricular por ondas;
12. mega auditoria pedagógica;
13. hardening/performance/release.

## Portões

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
