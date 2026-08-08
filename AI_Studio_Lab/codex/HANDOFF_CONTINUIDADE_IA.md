# Handoff de continuidade — SAGA

> **VIGENTE — 8/ago/2026. Checkpoint: P21 concluída; próximo passo P22 audit-first.**

## Regra de ouro

- Repo: `dyegorodrigues/SAGA`.
- Branch: **`codex/integrar-bloco-f0`**.
- `main` protegida/imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- PR #29: open + draft, somente comparação/CI; **não mesclar / não auto-merge**.
- Não tocar:
  - `agent/creature-engine-tamagotchi`
  - `codex/criar-branch-para-creature-engine-tamagotchi`
- Não criar branch auxiliar desta linha.
- Workflow/script temporário deve desaparecer no lote que publica.

## Fontes de verdade — leia nesta ordem

1. [`RETOMADA.md`](./RETOMADA.md)
2. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
3. [`AUDITORIA_P21_FONTES_DE_VERDADE.md`](./AUDITORIA_P21_FONTES_DE_VERDADE.md) — baseline P21.A, anterior às correções P21.1/P21.2.
4. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md)
5. decisão P específica se for tocar naquele bloco.

`ROTEIRO_ATE_O_FIM.md` e `PLANO_DO_BLOCO_F0.md` são análise histórica. Não executar números/fila deles sem recalcular o runtime.

## Blocos fechados — não redescobrir

- **P17:** N1.10/N1.11; `SEM_MOLDURA`; ponte perceptual→NumberBond; tempo não coroa Jornada.
- **P8:** Jardim JD1/JD2/JD3/JD5; estado em `dojoTracks`; automático ≠ compreensão; UI/sonda validadas; JD4 continua separada.
- **P18:** kind autoral só quando existe builder.
- **P19:** migrador único; npm audit completo/produção = 0 após remediação conservadora.
- **P20:** save local por Firebase UID + bootstrap único + sync com UID de origem + link anônimo→Google.
- **P21.1:** registries, cobertura autoral e proveniência executável reconciliados.
- **P21.2:** mapa autoral de primitivas reconciliado com builder→kind→renderer real.

## P21.A — inventário histórico

Run `31274280464`: **success**; workflow/script temporários auto-removidos.

Baseline pré-correção:

- 90 nós YAML / 90 JSON;
- 92 fichas Markdown cobrindo 88/90 competências;
- sem ficha Markdown: **N1.09, GM.02**;
- 29 fichas TS de Jornada;
- 24 registradas no Composer;
- 22 canários ativos;
- registradas/inativas: **N4.09, GM.12**;
- TS fora do Composer: **AL.05, GM.04, N2.01, N3.11, N4.02**;
- `JOURNEY_FICHAS` estava em 19/29;
- fiscais de cobertura/proveniência e mapa de primitivas estavam semanticamente atrasados.

## P21.1 — concluída

Gate `31275660948`: **success**.  
Limpeza: `ae28aacb2d1071489b53bec004568ea7edde6748`.

Estado:

- `JOURNEY_FICHAS`: **29/29**;
- Jornada em `AllFichas`: **29/29**;
- `journeyRegistry.test.ts`: disco↔registry permanente;
- Markdown: **92 fichas / 88 de 90**;
- lacunas explícitas: **N1.09, GM.02**;
- legado explícito: **42/90**;
- Composer registrado: **24/90**;
- Composer ativo: **22/90**;
- registrado/inativo: **N4.09, GM.12**;
- servido sem placeholder: **49/90**;
- fallback real: **41/90**.

## P21.2 — concluída

Gate `31276118716`: **success**.  
Workflow temporário auto-removido no commit `e7206a5afe6c002c1daf4fe8ff86e822f09c0e8b`.

A investigação não tomou a tabela como verdade. Ela cruzou ficha autoral, ficha TS/fonte, `Composer.ts`, normalização do `kind` e renderers.

Aliases/substituições comprovados e agora explícitos em `FICHA_RUNTIME_MAP`:

- `DragGroup` → `draggroup` / `pareamento` / `classificacao`;
- `EmojiRow` → `emojirow` / `fileira` / `moldura`;
- `Grupo` → `grandeza` em F49/GM.01;
- `StoryPanel` → builder `storypanel` → final `story-bars` → `StoryBarsStage`;
- `TenFrame` → `tenframe` / `moldura` / `bond` / `plain` conforme fonte/micro.

Mapa final da P21:

- 26 primitivas;
- **20 executáveis**;
- **4 renderer-sem-builder**: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`;
- **1 componente-isolado**: `Quadrado100`;
- **1 ausente**: `Regua`.

As seis entradas incompletas continuam dívida explícita; nenhuma foi implementada por tabela e nenhuma ficha foi promovida.

Contrato permanente: `src/curriculum/fichaRuntimeMap.test.ts`.

Gate final P21.2 aprovou:

- `fichas:auditar` — 92 fichas, 88/90, 26 primitivas;
- `auditar`;
- `fichas:conferir` — **9/9**;
- `grafo:check`;
- TypeScript;
- suíte completa — **125 arquivos / 2.132 testes**;
- build;
- `pr:check`;
- `git diff --check`.

## Próximo passo exato — P22 audit-first

P22 é decisão curricular deliberada. Não preencher buracos por contagem e não ativar Composer só porque existe ficha.

Itens delimitados:

1. **N1.09** — nó do grafo sem ficha Markdown;
2. **GM.02** — Tempo cotidiano sem ficha Markdown;
3. **JD4 ↔ N1.07** — reconciliar cânone, catálogo do Jardim, runtime e papel de automaticidade;
4. **N4.09** — ficha Composer registrada/inativa;
5. **GM.12** — ficha Composer registrada/inativa por observação deliberada.

Para cada item:

1. provar cânone/grafo;
2. provar TS/runtime/proveniência;
3. provar pré-requisitos e progressão longitudinal;
4. separar compreensão da Jornada de fluência/Jardim;
5. registrar decisão;
6. só depois editar/ativar com testes e gate.

O diagnóstico `fichas:conferir` ainda mostra legado, vazio e divergências de tela conhecidas; não tratar isso como fila cega de migração.

## Depois de P22

### Auditoria dos motores adaptativos

Longitudinal: Progress Engine, Composer/Minha Aula, Radar, Oficina, Jardim, FD/PD, matrícula, mixed challenge, Leitner/retenção, domínio/evidências, unlock e telemetria.

### Mega auditoria pedagógica

Quatro lentes:

1. currículo/grafo;
2. ficha/atividade;
3. primitivas/design pedagógico;
4. trajetória completa da criança do zero ao avançado.

### Fechamento

Auditoria integrada do Dojo → release hardening técnico/pedagógico/visual → somente então o autor decide integração.

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
git diff --check
```

Tela afetada também exige sonda/prints reais.

**Existir não é estar certo. Ausência explícita é dívida gerenciável; ausência silenciosa é falha de governança.**
