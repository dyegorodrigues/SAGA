# CHECKPOINT — COVERAGE MATRIX FECHADA

Data: 2026-08-09

Branch única: `codex/integrar-bloco-f0`

PR de comparação/CI: #29 — **NÃO MESCLAR NA MAIN**

Base protegida: `main@68fad4c575e28959b2ca4776e9a541d6828b63f3`

Creature Engine: **não modificado** nesta frente.

## 1. Estado funcional verificável

**Head funcional que fecha a implementação da Coverage Matrix:**

`38d24c670fde6d432af01b47e09089d7df7c01dd`

**CI #832 / run `31334991192`: SUCCESS integral.**

Recibos do run:

- `npm run auditar`: verde, agora incluindo a Coverage Matrix executável;
- `npm run fichas:auditar`: verde;
- `npm run fichas:conferir`: verde;
- `npm run grafo:check`: verde;
- TypeScript: verde;
- **160 arquivos / 2.378 testes Vitest verdes**;
- build Vite/server: verde;
- `npm run pr:check`: verde;
- higiene do diff: verde;
- guarda de binários: verde;
- sonda real Sensei: verde;
- artefato da sonda: id **`9044053557`**, nome `sonda-sensei-38d24c670fde6d432af01b47e09089d7df7c01dd`.

A documentação de handoff pode avançar em commits posteriores. Por isso, como sempre, a próxima sessão deve reancorar PR/head remoto e o CI correspondente antes de editar.

## 2. O que foi construído

A Coverage Matrix deixou de ser uma planilha/manual snapshot e virou uma **projeção executável e reproduzível** das fontes reais do repositório.

Arquivos centrais:

- `AI_Studio_Lab/tools/coverage_matrix.ts` — deriva a matriz completa;
- `src/curriculum/coverageMatrix.test.ts` — gate regression-first;
- `package.json` — `coverage:matrix`, `coverage:matrix:markdown`, `coverage:matrix:json`; `npm run auditar` executa a matriz;
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs` — ponte explícita ficha autoral → builder → renderer/runtime, reconciliada para o `area` de N4.09.

A matriz liga, para **cada uma das 90 competências**:

`Curriculum Graph → ficha canônica → implementação real → screen/primitiva → Composer/Sensei → testes/auditoria → status real → dívida/bloqueio → ação necessária → ordem causal`.

Cada linha carrega explicitamente:

- ID/nome/strand/faixa/pré-requisitos do grafo;
- ficha(s) autoral(is) e arquivo(s)-fonte;
- primitivas/mode exigidos pela ficha;
- proveniência real do gerador: `composer | legacy | fallback`;
- kinds e primitivas realmente entregues ao amostrar níveis 1→5;
- relação com Composer/Sensei sem criar autoridade paralela ao learner state;
- testes nominais encontrados + gates globais;
- divergência ficha↔screen;
- troca de linguagem visual;
- estreia de ferramenta;
- onboarding visual: `presente | nao-comprovado | pendente-com-implementacao | n/a`;
- primitiva ausente;
- dívida consolidada;
- ação necessária;
- onda causal + impacto por descendentes no DAG.

## 3. Baseline reconciliado — confirmado pela matriz real

A matriz reproduz o inventário vigente sem ajuste cosmético:

- **90 competências**;
- **94 fichas autorais**;
- **26 padrão-ouro / Composer ativo**;
- **25 legado**;
- **39 fallback**;
- **51/90 servidas sem placeholder**;
- **21 divergências ficha↔screen**;
- **12 trocas de linguagem visual**;
- **44 estreias de ferramenta sem precedente**;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

O gate falha se esses invariantes mudarem sem reconciliação. A mensagem é deliberada: **não ajustar baseline para ficar verde; investigar a divergência e reconciliar a fonte real**.

## 4. Divergências ficha ↔ tela — dívida real preservada

As 21 continuam explícitas, não foram mascaradas:

`N1.04, N1.05, N1.12, N2.01, N2.03, N3.02, N3.03, N3.04, N3.05, N3.06, N3.08, AL.03, GM.03, PE.01, N2.04, N3.13, N4.01, N4.03, N4.06, N4.07, N2.05`.

A matriz não transforma CI verde em afirmação falsa de paridade visual. Ela usa o verde para provar que a **dívida está corretamente observada e classificada**.

## 5. Linguagem visual e onboarding

As 12 trocas de modo permanecem:

`N1.08, N1.11, N3.02, GE.04, GE.05, PE.02, N2.06, N4.09, GE.06, N5.05, GE.10, GM.11`.

A Coverage Matrix acrescenta uma classificação que faltava ao inventário anterior: **a estreia/troca tem onboarding comprovado no runtime ou não?**

Para Composer ativo, a prova procura tutorial explícito na ficha runtime. Para legado, a matriz não presume que a ficha autoral governa o gerador antigo: marca onboarding como não comprovado. Para fallback, onboarding fica pendente junto da implementação.

Isso transforma as 44 estreias de uma contagem genérica em dívida executável por competência, sem confundir “ferramenta nova” com “bug”: a fábrica deverá decidir se a estreia é autoinstrutiva, se requer ponte/microtutorial ou se é divergência real.

## 6. Ordem causal executável

A ordem não é uma lista arbitrária por faixa escolar.

A matriz calcula:

1. **onda causal** pela profundidade real no DAG (`W0 → Wn`);
2. dentro da mesma onda, **impacto por número de descendentes** — uma base que destrava muitos nós vem antes de uma folha;
3. **primitiva bloqueadora precede ativação** da competência que depende dela;
4. dependente não entra na fábrica antes de seus bloqueios causais relevantes.

Faixa/idade continua sendo referência de UX, nunca catraca curricular.

## 7. Falhas encontradas durante a própria construção — e como foram tratadas

A frente foi regression-first e encontrou falhas do **novo auditor**, não do currículo. Nenhuma foi resolvida relaxando expectativa:

### A. Ambiente `tsx` standalone

Primeira versão importava runtime que depende de `import.meta.glob`, disponível no ambiente Vite/Vitest e não no Node/tsx standalone.

Correção: o gate roda no **Vitest/Vite**, isto é, no mesmo contexto de transformação usado pelo runtime testado.

### B. Contador ingênuo enxergava 92, não 94 fichas

A leitura inicial não seguia exatamente o formato do catálogo autoral.

Correção: a matriz passou a usar o mesmo contrato de identidade de bloco do `ficha_catalog_auditor.cjs`; resultado: **94 fichas / 90 competências**.

### C. Kinds recentes pareciam desconhecidos

`grandeza`, `shapecanvas`, `moldura`, `touchplace` e `area` já existiam no Composer/runtime, mas a primeira matriz mantinha tradução duplicada e incompleta.

Correção: deixou de criar uma segunda verdade e passou a reaproveitar a observação de conformidade vigente + `ficha_runtime_map.cjs` como ponte explícita.

### D. `area` de N4.09 estava atrasado no mapa runtime

N4.09 já era Composer ativo e entregava `kind: area` via `AreaStage`, mas o mapa ficha→runtime ainda declarava apenas o array direto.

Correção legítima: `ArrayGrid` passou a registrar `area`/`area-model`, builder `area` e renderer `area`. O auditor de fichas continua verde e agora descreve o runtime real.

### E. N1.11 apareceu como 22ª divergência

Diagnóstico mostrou que as 21 históricas estavam intactas; a “22ª” era N1.11, já conhecida como **troca visual TenFrame → flash**. A matriz não estava reconhecendo que `moldura` em modo `faltam` executa o flash da TenFrame antes da pergunta.

Correção: reconciliada a semântica da entrega. N1.11 volta a não ser falsa divergência, **sem apagar sua dívida de troca visual/onboarding**.

## 8. Arquitetura viva sem criar uma segunda autoridade

A Coverage Matrix é “viva” porque é derivada de grafo, fichas, runtime, componentes e testes a cada execução. Ela **não** autoriza telemetria, IA ou meta-jogo a reescrever o Curriculum Graph automaticamente.

Contrato permanente:

- Curriculum Graph/cânone define a ontologia curricular;
- learner state muda com a evidência da criança e decide mastery/unlock/prescrição;
- telemetria observa e pode revelar defeitos de ficha, aresta, interface ou implementação;
- IA/agentes podem propor mudanças e testes no fluxo de engenharia;
- mudança curricular só entra depois de decisão explícita + testes + CI + reconciliação canônica.

Assim a matriz pode ganhar métricas reais no futuro sem transformar telemetria em fonte de verdade pedagógica.

## 9. Contratos preservados

Nada desta frente reabre sem falha objetiva:

- P17–P22/cânone;
- Radar/source/persist/DAG/Oficina;
- Tutor↔Dojo;
- QA Chrome;
- Jardim causal;
- banco composto;
- telemetria/Leitner;
- `LENTO_DEDOS`;
- timezone;
- recomendador por estrelas removido;
- Misto elegível;
- Matrícula adaptativa;
- Cloud Reconciliation;
- Simulação Longitudinal;
- Gamificação / Economia / Meta-jogo.

E permanecem imutáveis os contratos centrais:

- learner state é a única autoridade para mastery/unlock/prescrição;
- Nível SAGA 1–100 é do perfil da criança;
- XP não compra competência;
- velocidade/RT não concede autoridade conceitual;
- fallback não gera evidência/recompensa real;
- Dojo/Jardim mantêm automaticidade separada do domínio conceitual;
- Creature Engine permanece desacoplado e fora desta fila.

## 10. Dívida que a matriz tornou executável — não foi “resolvida” por relatório

Continuam reais:

- 25 competências servidas por legado;
- 39 competências em fallback;
- 21 paridades ficha↔screen por corrigir;
- 12 trocas visuais a tratar conscientemente;
- 44 estreias a classificar/onboardar;
- `Moedas` para GM.03;
- `Regua` para GM.05;
- `Quadrado100` ainda componente isolado no mapa autoral;
- `LinkingCubes`, `SingaporeBars` e `VisualAddition` ainda renderer-sem-builder na cadeia autoral;
- N1.04 ainda tem F01+F03 com micros sem `fonte` separada;
- bundle grande e avisos jsdom de canvas permanecem dívida de hardening, não bloqueio curricular atual.

## 11. Próxima tarefa única

**Fábrica curricular por ondas pedagógicas guiadas pela Coverage Matrix.**

Ela deve atacar dívida por ordem causal, preservando regression-first e sem massificar conteúdo em cima de primitivas/linguagem visual ainda quebradas.

A fila passa a ser:

`Coverage Matrix FECHADA → fábrica curricular → mega auditoria integrada → hardening/performance → release`.

**Não iniciar a fábrica dentro deste checkpoint.** Primeiro fechar este recibo documental no GitHub remoto e revalidar o novo head.

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor. O meta-jogo celebra o caminho; ele nunca decide o que a criança sabe.**
