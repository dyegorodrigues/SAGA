---
name: nova-trilha
description: Criar uma trilha (gerador) nova em qualquer matéria do Matemágica seguindo a Constituição — contrato imutável, teste junto, kind existente, prereqs declarados. Usar sempre que o pedido for "nova trilha", "novo gerador" ou "novo exercício".
---

# Nova trilha — o ritual de nascimento

## Antes de escrever código
1. Ler `CLAUDE.md` (Constituição) e a seção da matéria em `docs/relatorio-expansao-pedagogica.md` / `docs/adendo-relatorio-expansao.md`.
2. Definir a progressão pedagógica dos 5 níveis ANTES do código, seguindo CPA: nível 1 concreto (figuras) → médios pictóricos → altos abstratos.
3. Escolher o `kind` (renderizador) entre os EXISTENTES. Kind novo só com 2+ usos previstos — e aí ele entra na Biblioteca de Cenas Vivas (ver `docs/mapa-mestre.md` §7).

## O contrato (imutável — Constituição regra 1)
```ts
gen(nível: 1-5) → { kind, prompt, ...visual, options[], answer }
```
- Resposta presente EXATAMENTE uma vez nas options; nunca opções duplicadas.
- Gerador é uma função pura de ~30 linhas; usa os helpers (`ri`, `pick`, `shuffle`, `numOpts`).
- Respostas numéricas nunca negativas (idade 4-7). Nada pune.

## Nascimento
1. Escrever o gerador no arquivo da matéria (≤15KB; passou, dividir).
2. Registrar na lista de trilhas com `prereqs` declarados (continuum vertical).
3. **Teste nasce junto**: adicionar a trilha ao padrão de `src/utils/generators.test.ts` (ela entra automática se registrada em TRACKS_*) e rodar `npm run test`.

## Ritual de fechamento (obrigatório)
`npm run build` ✅ → `npm run test` ✅ → commit `sessao-N-<nome>` → atualizar CLAUDE.md (estado atual).
