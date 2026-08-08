# Handoff de continuidade — SAGA

> **VIGENTE — 8/ago/2026. Checkpoint: P21.1 concluída; próximo passo P21.2.**

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
3. [`AUDITORIA_P21_FONTES_DE_VERDADE.md`](./AUDITORIA_P21_FONTES_DE_VERDADE.md) — baseline P21.A, anterior às correções P21.1.
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

P20 commit funcional:

`f45509ca73739d93fe32986c9cf7bcc5aaf6337a`

Gate transacional P20 run `31273869346`: **success** em testes focais, auditores, suíte inteira e build. O run `action_required` do commit auto-publicado tinha zero jobs e não representa falha de código.

## P21.A — inventário histórico concluído

Run `31274280464`: **success**; workflow/script temporários auto-removidos.

A P21.A identificou:

- 90 nós YAML / 90 JSON;
- 92 fichas Markdown cobrindo 88/90 competências;
- sem ficha Markdown: **N1.09, GM.02**;
- 29 fichas TS de Jornada;
- 24 registradas no Composer;
- 22 canários ativos;
- registradas/inativas: **N4.09, GM.12**;
- TS existentes fora do registro Composer: **AL.05, GM.04, N2.01, N3.11, N4.02** — classificar intenção antes de qualquer promoção;
- `JOURNEY_FICHAS` administrativo estava em 19/29;
- fiscais de cobertura/proveniência estavam semanticamente atrasados;
- mapa de primitivas tem 26 entradas e precisa reconciliar falsos negativos/positivos com o runtime real.

## P21.1 — concluída

Gate final `31275660948`: **success**.

Bancada temporária removida no próprio run; commit de limpeza:

`ae28aacb2d1071489b53bec004568ea7edde6748`

Mudanças de governança:

1. `JOURNEY_FICHAS` sincronizado com **29/29** fichas TS de Jornada;
2. `AllFichas` expõe as **29/29** fichas de Jornada e as fichas do Dojo;
3. teste `journeyRegistry.test.ts` prova disco↔registry dinamicamente;
4. `ficha_catalog_auditor.cjs` deriva cobertura do grafo;
5. **N1.09 e GM.02** são as únicas exceções canônicas explícitas/justificadas;
6. novo nó sem ficha + sem exceção quebra o fiscal; exceção resolvida que ficar stale também quebra;
7. `catalog_auditor.cjs` separa proveniência real:
   - legado explícito **42/90**;
   - Composer registrado **24/90**;
   - Composer ativo **22/90**;
   - registrado/inativo **2/90** — N4.09, GM.12;
   - servido sem placeholder **49/90**;
   - fallback real **41/90**;
8. comentários antigos de N1.10/N1.11 em `composerCanary.ts` foram atualizados sem mudança de runtime.

Validação final:

- `npm run auditar`: verde;
- `npm run fichas:auditar`: verde, **92 fichas / 88 de 90**, com as duas lacunas explícitas;
- `npm run fichas:conferir`: **9/9**;
- `npm run grafo:check`: verde;
- TypeScript: verde;
- suíte completa: **125 arquivos / 2.132 testes**;
- build: verde;
- `pr:check`: verde;
- `git diff --check`: verde.

## Próximo passo exato — P21.2

**Reconciliar `FICHA_RUNTIME_MAP` com builder→kind→renderer real.**

Não construir primitiva nova e não promover ficha apenas porque o mapa diz “incompleta”. Para cada entrada:

1. localizar ficha(s) consumidora(s);
2. localizar builder real;
3. registrar o `kind` efetivamente emitido;
4. localizar renderer/Stage que consome esse kind;
5. identificar aliases e dispatch indireto;
6. corrigir falsos negativos/positivos do mapa;
7. só implementar uma peça se a cadeia real provar lacuna necessária.

Baseline atual do mapa:

- 26 entradas;
- 18 `executável`;
- 4 `renderer-sem-builder`;
- 3 `componente-isolado`;
- 1 `ausente`;
- `Regua` segue como ausência mais inequívoca;
- `Moedas`, `StoryPanel`, `Grupo`, `Quadrado100`, `SingaporeBars`, `LinkingCubes` e `VisualAddition` precisam primeiro de reconciliação.

## Depois de P21

### P22 — decisões curriculares deliberadas

- N1.09;
- GM.02;
- JD4 e relação com N1.07;
- N4.09;
- GM.12.

Não preencher buracos por tabela: cada item entra com cânone, pedagogia, runtime e QA.

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
