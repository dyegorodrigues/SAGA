# Checkpoint — Fábrica Curricular W1 / N1.04 FECHADA

**Data:** 9/ago/2026  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única:** `codex/integrar-bloco-f0`  
**PR de comparação/CI:** #29 — manter open + draft + unmerged  
**Head funcional da W1:** `4637d205bc6d5b144dddc926e9f669d835f40d70`  
**CI funcional:** #842 / run `31340827946` — success integral

## 1. O que foi fechado

A primeira incisão da fábrica curricular por ordem causal fechou **N1.04 — cardinalidade / contar tocando**, sem reabrir frentes já encerradas e sem tocar na `main` ou no Creature Engine.

O problema não era simplesmente “runtime errado”. A investigação mostrou duas verdades que precisavam ser reconciliadas:

1. a implementação ativa com `TouchCount` já preservava o ato pedagógico correto — um toque, um objeto, numeral como produto do ato, voz sincronizada e desmame da marcação;
2. a ficha autoral F03 ainda declarava `EmojiRow / ScatteredItems`, embora o próprio corpo da F03 mandasse executar a contagem **igual à F01**: toque acende, numeral salta e voz conta.

Forçar o runtime a voltar para as primitivas antigas teria piorado a experiência. A correção foi reconciliar cânone e runtime em torno de `TouchCount`, preservando o novo degrau cognitivo da F03 no campo `arranjo` — fila → grade → disperso — e não numa segunda gramática de interação.

## 2. Regression-first — ordem real dos commits

1. `00d21a3636818b41dc4be3b5b7c08f29c21d2917` — `test(curriculum): travar proveniência F01/F03 em N1.04`
   - nasce teste nominal antes da correção;
   - níveis 1–2 exigem fonte F01;
   - níveis 3–5 exigem fonte F03;
   - toda a escada permanece `touchcount`;
   - a voz pedagógica muda quando F03 assume;
   - nível 5 não promete marcação visual que já foi retirada.
2. `3be07c240f08661bfad8c144dd8aa5263ac84aba` — `fix(curriculum): separar fontes F01 e F03 em N1.04`
   - `fonte` explícita por micro;
   - falas F01/F03 separadas;
   - `params.howto/explain` coerentes por micro;
   - mecânica e domínio preservados.
3. `4b1c6b00783cabdcb1e5d74f96b4cfe2113468c4` — `docs(curriculum): reconciliar F03 com TouchCount`
   - identidade autoral da F03 passa a declarar `TouchCount`;
   - nota normativa explica por que o degrau novo é `arranjo`.
4. `2c68e9723f9a52e6912b7de560b3f6d6940a84a7` — `fix(docs): restaurar detalhe lateral de F07`
   - auditoria de diff detectou e restaurou imediatamente uma remoção lateral acidental de texto em F07 causada pela substituição integral via API;
   - efeito líquido do documento autoral voltou a ficar restrito à retificação F03.
5. `1741de46328af2971e6d74f98de6c784408b7010` — `refactor(coverage): versionar baseline por migrações causais`
   - fechamento P21.1 permanece imutável em `COVERAGE_CLOSED_BASELINE`;
   - nasce `COVERAGE_MIGRATIONS`;
   - `W1-N1.04` registra `divergences: -1` com causa nomeada;
   - baseline vigente passa a ser derivado do snapshot fechado + ledger.
6. `4637d205bc6d5b144dddc926e9f669d835f40d70` — `test(coverage): travar ledger da fábrica curricular`
   - teste garante fechamento histórico em 21 divergências;
   - garante a migração W1 e baseline vigente em 20;
   - impede apagar a história editando expectativa silenciosamente.

## 3. O vermelho saudável da Matrix

Após a fonte real mudar, CI #840 / run `31340687432` ficou vermelho **somente** porque a Coverage Matrix observou:

- divergências ficha↔screen: **21 → 20**.

Os demais contadores estruturais permaneceram estáveis. Isso provou que uma dívida real foi removida e que a Matrix estava funcionando como sensor, não como planilha decorativa.

A resposta não foi “trocar 21 por 20”. Foi criar um ledger de migrações que conserva o snapshot histórico e explica causalmente o baseline vigente.

## 4. Baseline vigente após W1

- competências: **90**;
- fichas autorais: **94**;
- Composer/padrão-ouro: **26**;
- legado: **25**;
- fallback: **39**;
- servidas sem placeholder: **51**;
- divergências ficha↔screen: **20**;
- trocas de linguagem visual: **12**;
- estreias de ferramenta: **44**;
- primitivas bloqueadoras ausentes: **`Moedas`, `Regua`**.

O fechamento histórico da Coverage Matrix continua sendo 21 divergências. O número 20 é o **estado vigente derivado** após `W1-N1.04`.

## 5. Gates e recibo funcional

No head `4637d205bc6d5b144dddc926e9f669d835f40d70`, CI #842 / run `31340827946` concluiu com sucesso:

- Higiene do diff;
- Guarda de binários;
- Gates do SAGA, incluindo Coverage Matrix, catálogo/fichas, conformidade, grafo, TypeScript, testes, build e `pr:check`;
- Sonda real Sensei.

O conector GitHub confirmou o sucesso integral do workflow. Nesta sessão ele não expôs de forma confiável o corpo detalhado do log para transcrever a nova contagem total de testes; por isso este checkpoint **não inventa** esse número. O run #842 é o recibo canônico do gate.

## 6. Dívida que permanece — não mascarar

- **25** competências ainda em legado;
- **39** em fallback;
- **20** divergências ficha↔screen;
- **12** trocas de linguagem visual;
- **44** estreias de ferramenta a classificar/ensinar conscientemente;
- `Moedas` continua bloqueando GM.03;
- `Regua` continua bloqueando GM.05;
- `Quadrado100` segue componente isolado;
- `LinkingCubes`, `SingaporeBars` e `VisualAddition` seguem com renderer sem builder completo;
- hardening de bundle/jsdom-canvas permanece fora do bloqueio pedagógico desta onda enquanto não houver falha objetiva.

## 7. Regra nova da fábrica — baseline como ledger

Daqui em diante:

1. `COVERAGE_CLOSED_BASELINE` é histórico e não é reescrito;
2. cada mudança intencional de contagem nasce da fonte real e primeiro deve aparecer como divergência observada;
3. só depois entra uma migração nomeada em `COVERAGE_MIGRATIONS`, com competência, causa e delta;
4. mudar expectativa sem fonte real correspondente continua proibido.

Isso transforma a Matrix numa trilha de auditoria evolutiva: dá para reconstruir de onde cada melhoria veio.

## 8. Próxima tarefa única

Continuar a **fábrica curricular por ondas pedagógicas e ordem causal**, reancorando PR/head/CI antes da próxima edição.

A próxima competência não deve ser escolhida por série nem por conveniência. Usar:

1. profundidade no DAG;
2. impacto em descendentes;
3. bloqueio de primitiva/builder;
4. status legado/fallback;
5. divergência ficha↔screen;
6. necessidade de onboarding;
7. risco de propagar uma representação pedagógica errada.

Candidatos precisam ser investigados antes de alterar cânone ou runtime. N1.04 demonstrou a regra: às vezes o runtime está errado; às vezes o cânone está stale; a fábrica deve descobrir qual é o caso.

## 9. Proibições confirmadas

Nesta W1:

- nenhuma alteração na `main`;
- nenhum merge/rebase;
- PR #29 não foi marcada ready;
- auto-merge não foi habilitado;
- nenhuma branch auxiliar criada;
- nenhum arquivo do Creature Engine tocado.

**W1/N1.04 está fechada. A fábrica pode avançar para o próximo nó causal somente a partir deste estado verde.**
