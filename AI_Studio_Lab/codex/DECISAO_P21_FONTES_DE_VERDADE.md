# Decisão P21 — fontes de verdade e backlog derivado

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Baseline histórico:** `AUDITORIA_P21_FONTES_DE_VERDADE.md`

## Estado

A fase **P21.A — inventário read-only** e a fase **P21.1 — governança de registries/auditores** estão concluídas.

- P21.A: run `31274280464` = **success**;
- P21.1 final: run `31275660948` = **success**;
- bancada temporária P21.1 removida no próprio run, commit `ae28aacb2d1071489b53bec004568ea7edde6748`;
- `main` não foi alterada;
- nenhuma promoção de ficha foi feita pela P21.1;
- nenhuma decisão pedagógica de P22 foi antecipada.

A próxima execução é **P21.2 — reconciliar `FICHA_RUNTIME_MAP` com builder→kind→renderer real**.

## 1. Números derivados atuais

### Grafo

- 90 nós no YAML;
- 90 nós no JSON;
- zero divergência YAML↔JSON.

### Cânone Markdown

- 92 fichas em 5 blocos;
- 88 competências únicas cobertas em 90;
- lacunas canônicas temporárias explícitas: **N1.09 e GM.02**.

A P21.1 mudou a governança: o auditor deriva o universo do grafo. Qualquer nova competência sem ficha e sem exceção explícita quebra o fiscal; exceção que fique stale depois de a lacuna ser resolvida também quebra.

### Jornada TS / catálogos / Composer

- 29 fichas TS de Jornada no disco;
- `JOURNEY_FICHAS`: **29/29**;
- Jornada exposta em `AllFichas`: **29/29**;
- fichas de Dojo no disco/registradas: **4/4**;
- fichas do disco fora de `AllFichas`: **0**;
- 24 fichas registradas em `COMPOSER_FICHAS`;
- 22 canários ativos;
- registradas e inativas: **N4.09, GM.12**;
- fichas TS ainda fora do registro Composer: **AL.05, GM.04, N2.01, N3.11, N4.02**.

Estar no catálogo administrativo não ativa produção. Estar fora do Composer não implica bug nem autoriza promoção automática.

## 2. Decisão P21.1 sobre `AllFichas/JOURNEY_FICHAS` — realizada

A P21.A encontrou 29 fichas TS de Jornada e apenas 19 em `JOURNEY_FICHAS`, deixando dez autorias invisíveis para a bancada administrativa.

A P21.1:

- sincronizou `JOURNEY_FICHAS` com as 29 fichas existentes;
- fez `AllFichas` expor integralmente `JOURNEY_FICHAS`;
- adicionou `src/curriculum/fichas/journeyRegistry.test.ts`;
- o teste compara dinamicamente IDs no disco com o registry, sem hardcode de “29”;
- duplicação, omissão ou entrada sem correspondente no disco passa a quebrar o gate.

**Regra:** catálogo administrativo e ativação de Composer são conceitos separados.

## 3. Decisão P21.1 sobre cobertura autoral — realizada

Antes, `ficha_catalog_auditor.cjs` tratava 88 como expectativa histórica. Agora:

1. o denominador vem do grafo atual;
2. **N1.09** e **GM.02** ficam em mapa explícito de exceções com justificativa;
3. novo nó sem ficha e sem exceção quebra o fiscal;
4. exceção apontando para nó inexistente quebra;
5. exceção resolvida que permanecer no mapa quebra;
6. justificativa vazia/insuficiente quebra.

Estado atual comprovado:

- **92 fichas**;
- **88/90 competências cobertas**;
- exatamente **2 lacunas explícitas**: N1.09 e GM.02.

Essas duas permanecem para P22 e não devem ser “consertadas por contagem”.

## 4. Decisão P21.1 sobre proveniência — realizada

O auditor agregado deixou de usar o binário histórico “explícito/fallback” como se descrevesse o runtime inteiro.

Estado atual derivado:

- gerador legado explícito: **42/90**;
- Composer registrado: **24/90**;
- Composer ativo: **22/90**;
- Composer registrado e inativo: **2/90 — N4.09, GM.12**;
- servido sem placeholder (`legado ∪ Composer ativo`): **49/90**;
- fallback real sem conteúdo servido: **41/90**.

O fallback real é calculado por **sem gerador legado explícito && sem Composer ativo**. Uma ficha apenas registrada, mas inativa, não é contada como conteúdo servido.

O auditor também verifica:

- canário ativo precisa estar registrado;
- IDs de Composer precisam existir no grafo;
- duplicações nos registries quebram o fiscal.

## 5. Comentários N1.10/N1.11 — corrigidos

Os comentários históricos em `composerCanary.ts` foram atualizados para refletir o estado pós-P17:

- N1.10/N1.11 são fichas correntes já promovidas;
- ativação declarativa continua em `composerCanaryIds.ts`;
- estado mutável/rollback continua em `COMPOSER_CANARIES`.

Nenhuma lógica de runtime foi alterada nesse ajuste.

## 6. Gate final P21.1

Run `31275660948`: **success**.

Validações executadas:

```text
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check e2ee44d1d79d910ebbfcb3411d5f65c836616a47..HEAD
```

Asserts adicionais do gate exigiram explicitamente:

- `JOURNEY_FICHAS: 29/90`;
- Jornada em `AllFichas: 29/90`;
- Composer registrado: `24/90`;
- Composer ativo: `22/90`;
- fallback real: `41/90`.

Resultados:

- `fichas:conferir`: **9/9**;
- suíte completa: **125 arquivos / 2.132 testes**, todos aprovados;
- build: aprovado;
- text guard: aprovado;
- diff check: aprovado.

## 7. P21.2 — próxima sequência exata

O mapa atual contém **26 primitivas** e ainda é um inventário que pode ter falso negativo/falso positivo.

Baseline reportado:

- 18 `executável`;
- 4 `renderer-sem-builder`;
- 3 `componente-isolado`;
- 1 `ausente`.

Marcadas como não plenamente executáveis no mapa atual:

- `Grupo`;
- `LinkingCubes`;
- `Moedas`;
- `Quadrado100`;
- `Regua`;
- `SingaporeBars`;
- `StoryPanel`;
- `VisualAddition`.

**Isso não é uma lista para construir oito componentes.** P21.A já mostrou que classificações podem estar atrasadas em relação ao runtime; `StoryPanel`, por exemplo, participa de N3.10 ativo no Composer.

Para cada primitiva na P21.2:

1. provar ficha(s) consumidora(s);
2. provar builder real;
3. provar `kind` final emitido;
4. provar renderer/Stage real;
5. identificar aliases/dispatch indireto;
6. corrigir somente falso negativo/falso positivo do `FICHA_RUNTIME_MAP`;
7. implementar peça apenas se a cadeia real provar ausência necessária.

`Regua` permanece a ausência mais inequívoca. `Moedas` possui renderização conhecida, mas builder/contrato deve ser classificado antes de qualquer implementação.

## 8. Dívidas pedagógicas confirmadas — deixar para P22

- N1.09 sem ficha Markdown;
- GM.02 sem ficha Markdown;
- JD4 ausente do catálogo `JARDIM`;
- N4.09 registrada e não ativa;
- GM.12 registrada e não ativa por observação deliberada.

P22 deve ser audit-first, não “preencher buraco porque a tabela ficou vermelha”.

## 9. Depois de P22

Seguir `MAPA_MESTRE_POS_P20.md`:

1. auditoria dos motores adaptativos/meta-algoritmos;
2. correções dos motores;
3. mega auditoria de engenharia pedagógica;
4. auditoria integrada do Dojo;
5. release hardening.

**P21 fixa a regra de governança: ausência explícita é aceitável temporariamente; ausência silenciosa não é.**
