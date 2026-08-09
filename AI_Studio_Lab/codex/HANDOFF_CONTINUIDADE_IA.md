# Handoff de continuidade — SAGA

> **VIGENTE — 8/ago/2026. P21 concluída; P22.1–P22.4 concluídas; próximo passo P22.5/GM.02.**

## Regra de ouro

- Repo: `dyegorodrigues/SAGA`.
- Branch: `codex/integrar-bloco-f0`.
- `main` protegida/imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- PR #29: open + draft, comparação/CI; não mesclar e não ativar auto-merge.
- Não tocar no Creature Engine.
- Não criar branch auxiliar desta linha.
- Bancada temporária deve desaparecer no lote que publica.

## Leia nesta ordem

1. `RETOMADA.md`
2. `DECISAO_P22_DIVIDAS_CURRICULARES.md`
3. `DECISAO_P21_FONTES_DE_VERDADE.md`
4. `PLANO_POS_P22_FABRICA_CURRICULAR.md`
5. `MAPA_MESTRE_POS_P20.md`

Roadmaps de 5/ago são históricos.

## Fechado

- P17 — N1.10/N1.11;
- P8 — Jardim/automaticidade;
- P18 — `KindType`;
- P19 — migrador/dependências;
- P20 — save/sync por UID;
- P21.1 — registries/cobertura/proveniência;
- P21.2 — mapa autoral de primitivas;
- P22.1 — GM.12 promovida;
- P22.2 — N4.09 promovida e telemetria de área corrigida;
- P22.3A — N1.07 completa segundo o grafo;
- P22.3B — JD4 automática, separada da Jornada;
- P22.4 — N1.09 autoral completa e ativa.

## Estado após P22.4

- 90 nós canônicos;
- **93 fichas Markdown / 89 competências cobertas**;
- única lacuna autoral: **GM.02**;
- Journey TS: **30/30**;
- Composer: **25 registrados / 25 ativos / 0 inativos**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- primitivas: **20 executáveis, 4 renderer-sem-builder, 1 isolada, 1 ausente**.

## Evidências recentes

- P22.1 GM.12: `31276881058` = success.
- P22.2 N4.09: `31277213310` = success.
- P22.3A N1.07: `31281685349` = success; clean follow-up `31281842046`.
- P22.3B JD4: `31282358997` = success.
- P22.4 N1.09 baseline semântico: `31286476155` = success.
- P22.4 sonda pela rota real de produção: `31286955931` = success.
- P22.4 cleanup sem bancada: `31287106974` = success.

A sonda P22.4 encontrou e corrigiu uma falha real de `ScatteredItems`: 10–20 objetos podiam colidir quando o sorteio esgotava 50 tentativas. O palco agora usa células invisíveis embaralhadas + jitter determinístico, com teste geométrico permanente.

## Próximo passo — P22.5 GM.02

GM.02 continua sendo **Tempo cotidiano**: partes do dia, ontem/hoje/amanhã, dias da semana e ordem de eventos.

O legado “Manhã ou Noite?” é rollback parcial, não a competência inteira.

Contrato obrigatório:

1. prereqs vazios, conforme grafo;
2. pré-leitor: áudio/iconografia são linguagem primária;
3. cinco níveis: partes do dia → relativos temporais → semana → ordem de eventos → misto;
4. `rt_alvo` positivo no L5 como metadado de fluência, nunca mastery;
5. ficha Markdown com nove seções + Journey TS + teste permanente;
6. registro Journey/Composer + ativação declarativa;
7. legado preservado para rollback;
8. remover a exceção GM.02 somente quando a ficha existir;
9. corrigir o `EXPECTED_FICHAS = 93` do auditor específico estruturalmente — nunca trocar por 94;
10. resposta correta sem misconception e diagnósticos apenas quando causais;
11. sonda real + gates completos;
12. só então declarar P22 encerrada.

## Depois de P22

Seguir `PLANO_POS_P22_FABRICA_CURRICULAR.md`:

1. máquina longitudinal dos motores adaptativos;
2. Coverage Matrix executável;
3. fábrica curricular por ondas;
4. mega auditoria pedagógica;
5. Dojo completo;
6. release hardening.

## Portões padrão

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

**Automaticidade treina o que já foi compreendido; uma ficha só está pronta quando código, telemetria e experiência real da criança concordam.**