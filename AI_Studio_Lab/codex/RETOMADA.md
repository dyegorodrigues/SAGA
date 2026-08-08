# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21 concluída (P21.A + P21.1 + P21.2); próxima tarefa exata: P22, audit-first.**

## 1. Leia só isto antes de editar

1. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
2. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
3. [`AUDITORIA_P21_FONTES_DE_VERDADE.md`](./AUDITORIA_P21_FONTES_DE_VERDADE.md) — baseline histórico read-only da P21.A; não confundir números pré-P21.1/P21.2 com o estado atual.
4. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md) para a estratégia das fases grandes.
5. [`REGISTRO_LITERAL_RESPOSTA_POS_P20_P21.md`](./REGISTRO_LITERAL_RESPOSTA_POS_P20_P21.md) para o registro textual completo da resposta ao autor que definiu P21, P22, auditoria dos motores, mega auditoria pedagógica, auditoria JD/FD/PD e release hardening.

Os roadmaps de 5/ago são **históricos**. Não use contagens ou “próximo passo” deles como fila atual.

## 2. Git

- repo: `dyegorodrigues/SAGA`;
- branch desta linha: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: open + draft/no-merge;
- Creature Engine: não tocar;
- não criar branch auxiliar;
- bancada temporária se apaga no próprio lote.

## 3. Blocos já fechados

- P17 — N1.10/N1.11 e ponte perceptual→simbólica;
- P8 — Jardim real e automaticidade separada da Jornada;
- P18 — `KindType` sem promessa autoral falsa;
- P19 — migrador único + dependências auditadas/zeradas;
- P20 — identidade do save local/cloud por Firebase UID;
- **P21.1 — governança de registries, cobertura e proveniência**;
- **P21.2 — reconciliação do mapa autoral de primitivas com builder→kind→renderer real**.

Não reabrir sem falha objetiva.

## 4. P21.A — baseline histórico

Relatório:

`AUDITORIA_P21_FONTES_DE_VERDADE.md`

Antes das correções, a P21.A encontrou:

- grafo: **90/90** YAML↔JSON;
- cânone Markdown: **92 fichas / 88 competências em 90**;
- sem ficha Markdown: **N1.09, GM.02**;
- fichas TS de Jornada: **29**;
- registradas no Composer: **24**;
- canários ativos: **22**;
- registradas/inativas: **N4.09, GM.12**;
- `JOURNEY_FICHAS` administrativo em **19/29**;
- auditor autoral com expectativa histórica de 88;
- auditor agregado confundindo legado, Composer e fallback;
- mapa de primitivas com falsos negativos/aliases não explicitados.

## 5. P21.1 — CONCLUÍDA

Gate final: **run `31275660948` = success**.  
Bancada auto-removida: `ae28aacb2d1071489b53bec004568ea7edde6748`.

Estado:

- `JOURNEY_FICHAS`: **29/29 fichas TS de Jornada**;
- `AllFichas`: **29/29 fichas de Jornada expostas**, além do Dojo;
- teste permanente disco↔registry: `src/curriculum/fichas/journeyRegistry.test.ts`;
- Markdown: **92 fichas / 88 de 90 competências**;
- lacunas canônicas explícitas: **N1.09 e GM.02**;
- gerador legado explícito: **42/90**;
- Composer registrado: **24/90**;
- Composer ativo: **22/90**;
- registrado/inativo: **N4.09, GM.12**;
- servido sem placeholder (`legado ∪ Composer ativo`): **49/90**;
- fallback real: **41/90**.

## 6. P21.2 — CONCLUÍDA

Gate final: **run `31276118716` = success**.  
Bancada auto-removida: `e7206a5afe6c002c1daf4fe8ff86e822f09c0e8b`.

A P21.2 auditou ficha autoral → ficha TS/fonte → case do Composer → `kind` final → renderer/Stage e corrigiu somente falsos negativos/aliases comprovados.

### Realizações autorais explicitadas

- `DragGroup` → `draggroup` direto ou especializações `pareamento` / `classificacao`;
- `EmojiRow` → `emojirow` direto ou `fileira` / `moldura` por ficha-fonte;
- `Grupo` → `grandeza/GrandezaStage` em F49/GM.01; o `Grupo.tsx` genérico não é apresentado como dispatch canônico;
- `StoryPanel` → builder `storypanel` → normalização final `story-bars` → `StoryBarsStage` em F20/N3.10;
- `TenFrame` → `tenframe` direto ou `moldura` / `bond` / `plain` conforme a ficha/micro.

### Estado real do mapa após reconciliação

26 primitivas:

- **20 `executável`**;
- **4 `renderer-sem-builder`**: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`;
- **1 `componente-isolado`**: `Quadrado100`;
- **1 `ausente`**: `Regua`.

Essas seis entradas continuam dívida explícita. P21.2 **não construiu runtime por tabela** e **não promoveu ficha**.

Teste permanente: `src/curriculum/fichaRuntimeMap.test.ts` trava aliases comprovados e exige que as lacunas reais continuem visíveis.

Validação P21.2:

- `npm run fichas:auditar`: aprovado — **92 fichas / 88 de 90 / 26 primitivas**;
- `npm run auditar`: aprovado;
- `npm run fichas:conferir`: **9/9**;
- `npm run grafo:check`: aprovado;
- `npx tsc --noEmit`: aprovado;
- suíte: **125 arquivos / 2.132 testes**, todos aprovados;
- `npm run build`: aprovado;
- `npm run pr:check`: aprovado;
- `git diff --check`: aprovado.

## 7. PRÓXIMA TAREFA EXATA — P22, AUDIT-FIRST

**Decidir deliberadamente as dívidas curriculares; não preencher buracos por contagem e não promover canário sem prova.**

Itens já delimitados:

1. **N1.09** — nó do grafo sem ficha Markdown;
2. **GM.02** — Tempo cotidiano sem ficha Markdown;
3. **JD4 ↔ N1.07** — reconciliar cânone, catálogo `JARDIM`, ficha/serviço real e papel de automaticidade;
4. **N4.09** — ficha Composer registrada, porém inativa;
5. **GM.12** — ficha Composer registrada, porém inativa por observação deliberada.

Para cada item P22, antes de editar:

1. provar estado no cânone Markdown/grafo;
2. provar estado TS/runtime e proveniência atual;
3. provar pré-requisitos e papel pedagógico longitudinal;
4. provar impacto em Jornada vs Jardim/fluência;
5. registrar decisão explícita;
6. só então implementar/ativar, com testes e gate.

A saída de `fichas:conferir` continua sendo diagnóstico importante: existem competências legadas/vazias e divergências de tela conhecidas; não tratar a lista como autorização para migrar tudo de uma vez.

## 8. Depois de P22

- auditoria longitudinal dos motores adaptativos/meta-algoritmos;
- correções dos motores;
- mega auditoria de engenharia pedagógica;
- auditoria integrada JD/FD/PD;
- release hardening.

Detalhes: `MAPA_MESTRE_POS_P20.md` e `REGISTRO_LITERAL_RESPOSTA_POS_P20_P21.md`.

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

> **Existir não é estar certo. Ausência explícita pode ser dívida; ausência silenciosa é falha de governança.**
