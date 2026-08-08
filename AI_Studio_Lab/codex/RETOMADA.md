# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21.1 concluída; próxima tarefa exata: P21.2.**

## 1. Leia só isto antes de editar

1. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
2. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
3. [`AUDITORIA_P21_FONTES_DE_VERDADE.md`](./AUDITORIA_P21_FONTES_DE_VERDADE.md) — baseline histórico read-only da P21.A; não confundir os números pré-P21.1 com o estado atual.
4. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md) para a estratégia das fases grandes.
5. [`REGISTRO_LITERAL_RESPOSTA_POS_P20_P21.md`](./REGISTRO_LITERAL_RESPOSTA_POS_P20_P21.md) para o registro textual completo da resposta ao autor que definiu P21.1, P21.2, P22, auditoria dos motores, mega auditoria pedagógica, auditoria JD/FD/PD e release hardening.

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
- **P21.1 — governança de registries, cobertura e proveniência.**

Não reabrir sem falha objetiva.

## 4. P21.A — baseline histórico já executado

Relatório:

`AUDITORIA_P21_FONTES_DE_VERDADE.md`

A P21.A encontrou, antes das correções de governança:

- grafo: **90/90** YAML↔JSON;
- cânone Markdown: **92 fichas / 88 competências em 90**;
- sem ficha Markdown: **N1.09, GM.02**;
- fichas TS de Jornada: **29**;
- registradas no Composer: **24**;
- canários ativos: **22**;
- registradas/inativas: **N4.09, GM.12**;
- `JOURNEY_FICHAS` administrativo atrasado em **19/29**;
- auditor autoral com expectativa histórica de 88;
- auditor agregado confundindo legado, Composer e fallback;
- mapa de primitivas com classificações ainda a reconciliar.

## 5. P21.1 — CONCLUÍDA

Gate transacional final: **run `31275660948` = success**.

A bancada temporária se auto-removeu no commit `ae28aacb2d1071489b53bec004568ea7edde6748`.

Estado comprovado pelo gate:

- `JOURNEY_FICHAS`: **29/29 fichas TS de Jornada**;
- `AllFichas`: **29/29 fichas de Jornada expostas**, além do Dojo;
- teste permanente disco↔registry: `src/curriculum/fichas/journeyRegistry.test.ts`;
- fichas autorais Markdown: **92**, cobrindo **88/90** competências;
- lacunas canônicas temporárias e justificadas: **N1.09 e GM.02**;
- qualquer nova competência sem ficha e sem exceção explícita quebra `fichas:auditar`;
- gerador legado explícito: **42/90**;
- Composer registrado: **24/90**;
- Composer ativo: **22/90**;
- Composer registrado e inativo: **2/90 — N4.09, GM.12**;
- servido sem placeholder (`legado ∪ Composer ativo`): **49/90**;
- fallback real sem conteúdo servido: **41/90**;
- comentários obsoletos de N1.10/N1.11 em `composerCanary.ts` corrigidos sem mudar runtime.

Validação final:

- `npm run auditar`: aprovado;
- `npm run fichas:auditar`: aprovado, **88/90** com N1.09/GM.02 explícitas;
- `npm run fichas:conferir`: **9/9**;
- `npm run grafo:check`: aprovado;
- `npx tsc --noEmit`: aprovado;
- suíte: **125 arquivos / 2.132 testes**, todos aprovados;
- `npm run build`: aprovado;
- `npm run pr:check`: aprovado;
- `git diff --check`: aprovado.

## 6. PRÓXIMA TAREFA EXATA — P21.2

**Reconciliar o mapa de primitivas com o runtime real. Não construir peças por tabela. Não promover ficha.**

Para cada entrada de `FICHA_RUNTIME_MAP`:

1. provar a ficha consumidora;
2. provar builder real no Composer/runtime;
3. provar `kind` final emitido;
4. provar renderer/Stage real;
5. distinguir alias legítimo de lacuna real;
6. corrigir somente falso negativo/falso positivo do mapa;
7. implementar primitiva apenas se a cadeia real provar ausência necessária.

Baseline atual do mapa, ainda não tratado pela P21.2:

- 26 primitivas;
- 18 `executável`;
- 4 `renderer-sem-builder`;
- 3 `componente-isolado`;
- 1 `ausente`;
- `Regua` é a lacuna ausente mais inequívoca;
- `Moedas`, `StoryPanel`, `Grupo`, `Quadrado100`, `SingaporeBars`, `LinkingCubes` e `VisualAddition` exigem reconciliação, não implementação automática.

## 7. Depois de P21

- P22: decidir pedagogicamente N1.09, GM.02, JD4, N4.09 e GM.12;
- auditoria longitudinal dos motores adaptativos/meta-algoritmos;
- correções dos motores;
- mega auditoria de engenharia pedagógica;
- auditoria integrada JD/FD/PD;
- release hardening.

Detalhes: `MAPA_MESTRE_POS_P20.md` e `REGISTRO_LITERAL_RESPOSTA_POS_P20_P21.md`.

## 8. Portões

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
