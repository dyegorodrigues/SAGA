# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** O briefing antigo de P21 foi superado e permanece recuperável pelo histórico Git. P21/P22, cânone, Tutor↔Dojo, QA real e Jardim causal estão fechados. Próxima execução: **identidade do banco de erros composto**.

## Antes de tocar código

Leia nesta ordem:

1. `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `AUDITORIA_MOTORES_ADAPTATIVOS.md`
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`.  
`main` = `68fad4c575e28959b2ca4776e9a541d6828b63f3`, **não tocar**.  
PR #29 = open + draft + no-merge. Creature Engine = fora deste fluxo. Não criar branch auxiliar.

Sempre reancore PR/head remoto antes de editar.

## Fechado

Não reabrir sem falha objetiva:

- P17/P8/P18/P19/P20/P21/P22;
- grafo 90 + 94 fichas + cobertura autoral 90/90;
- Radar tag→nó;
- `sourceTrackId` da Aula composta até persistência;
- Sensei full DAG sem grade como trilho;
- Oficina causal;
- reconciliação canônica + guard documental;
- Dojo `manual | prescribed` de ponta a ponta;
- QA real Chrome integrado ao CI;
- Jardim causal por DAG + fraqueza JD comprovada.

Head funcional de fechamento: `15f73542ddb1f005fd228ac02461c5a71ea8adec`.  
CI #671 / run `31307946962` = SUCCESS integral.  
Artefato visual: `9036527545`.

## Estado de conteúdo — dívida declarada

- Composer/padrão-ouro: 26/90;
- servido sem placeholder: 51/90;
- ficha pronta servida por legado: 25;
- ficha pronta sem conteúdo: 39;
- divergência ficha↔tela observada: 21;
- troca de linguagem visual sem aviso: 12;
- primitivas: 20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente.

**Não começar a fábrica dos 39 agora.** A lista exata está em `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` e entra depois da Coverage Matrix.

## Faça agora — identidade do banco de erros composto

Pré-auditoria encontrou a hipótese a seguir em `composer.ts`:

- os itens de banco de múltiplos tracks entram em um `bankQs` global e embaralhado;
- há uma closure por `RescuePlanItem`;
- para `error-bank`, a closure usa `bankQs.pop()` sem amarrar o item ao source do resgate.

Pode ocorrer:

> resgate de A consumir questão armazenada no banco de B.

Não corrigir por intuição. Primeiro trace e teste:

`planAula(error-bank source) → bankQs/rescueQueue → questão/source → GameLoop/review → progressEngine/materialize → bank mutation → próximo planAula`.

### Sequência obrigatória

1. regressão determinística com dois bancos-fonte;
2. provar ou refutar a mistura;
3. se provada, corrigir identidade por source/rescue;
4. provar que retry/review altera o bank do source correto;
5. gates completos;
6. checkpoint.

A etapa **telemetria/Leitner da Aula composta é a seguinte**, não misture os dois bugs no mesmo lote.

## Depois

telemetria/Leitner → `LENTO_DEDOS` → timezone → recomendador paralelo → Misto elegível → Matrícula → cloud reconciliation → simulação longitudinal → gamificação/economia → Coverage Matrix → fábrica curricular → mega auditoria → hardening.

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

**Comece pela regressão de dois bancos-fonte.**
