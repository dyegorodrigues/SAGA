# Checkpoint — Simulação longitudinal fechada

> **VIGENTE em 9/ago/2026.** Substitui `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md` como fonte operacional mais nova. Não reabrir contratos pedagógicos, de cloud ou desta simulação sem falha objetiva.

## 1. Âncora Git e governança

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- PR #29 **open + draft + unmerged**;
- base protegida `main` em `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- Creature Engine intocado;
- nenhuma branch auxiliar;
- nenhum merge/rebase/ready/auto-merge.

### Cabeça funcional

`1353dcd515d2f0dcb44abbc67de6f7fafc24cf9d`

CI **#778**, run **`31321595071`**, success integral:

- **152 arquivos / 2.340 testes**;
- TypeScript;
- build;
- auditores/fichas/grafo;
- `pr:check`;
- higiene do diff;
- guarda de binários;
- Chrome real/Sensei.

Artefato Chrome: **`9040333829`**, `sonda-sensei-1353dcd515d2f0dcb44abbc67de6f7fafc24cf9d`.

Diff auditado desde o recibo final da Cloud `6ed04c69794d758661cec180f4db56eb9382cc87`:

- 7 commits à frente, 0 atrás;
- somente 4 arquivos funcionais/testes: `composer.ts`, `progressEngine.ts` e duas suítes longitudinais;
- nenhum Creature Engine;
- nenhuma ficha/fábrica curricular;
- `App.tsx` intocado.

### Cabeça documental consolidada

`b042b6f5906709af46321604e7b468147369e4b6`

CI **#782**, run **`31321837493`**, success integral. Esse head contém este checkpoint, `RETOMADA.md`, `BRIEFING_CODEX.md` e `HANDOFF_CONTINUIDADE_IA.md` repontados para a próxima tarefa.

O SHA do próprio commit-recibo não pode ser escrito no conteúdo que o gera. Portanto o **head remoto final + CI terminal deste recibo** é registrado no corpo da PR #29 após seu CI, sem falsa auto-referência.

## 2. Método da simulação

Não foi criado Tutor paralelo. As regressões chamam motores reais:

`estado inicial → Sensei/planAula → source/answer → progress/mastery/Radar/Leitner → Dojo/Jardim/Oficina/Misto → JSON/migrate/reload → próxima decisão`.

Suítes permanentes:

- `src/curriculum/motores/longitudinalSenseiSimulation.test.ts`;
- `src/curriculum/motores/longitudinalAutomaticitySimulation.test.ts`.

Cenários provados:

1. iniciante absoluto recebe fronteira realmente ensinável;
2. ritmo típico tolera erro isolado sem distorcer a escada;
3. alta facilidade chega ao nível 5 sem comprar domínio;
4. domínio multidimensional exige sessão madura + confirmação espaçada;
5. acerto lento e rápido têm a mesma autoridade conceitual;
6. esquecimento/retorno agenda revisão por dia civil;
7. Oficina causal tem saída;
8. Misto só usa repertório dominado e praticado;
9. Matrícula não concede `dom=true`;
10. Dojo livre fortalece fatos/estatística sem mover ponteiro adaptativo;
11. Dojo prescrito pode mover apenas o estado do Dojo;
12. Jardim só entra com fraqueza já observada e sai após recuperação;
13. `prerequisite-gap` conceitual continua vencendo Jardim;
14. JSON → migrate → reload preserva a próxima decisão e a separação conceito × automaticidade.

## 3. Bugs realmente provados

### L1 — fallback podia virar fronteira dominante

Regressão-only `3247669146753913f51e5bda92d3e2e96abf17e8`.

CI **#772**, run `31320433584`: vermelho com 1 única falha nova; 2.330 testes vizinhos verdes.

Depois de dominar todo conteúdo realmente servido anterior, `planAula()` podia escolher `contentStatus="fallback"` como fronteira dominante. Isso permitia repetir “Em construção” sem gerar ensino/evidência.

Correção mínima em `composer.ts`:

- todo o DAG continua no universo de estado/prerequisitos;
- aquecimento/fronteira escolhem somente conteúdo não-fallback;
- resgate/revisão/fluência/fábrica não foram reabertos.

Primeira prova verde: `2cded104d67304c0a8e68bc52bddf85abcab9901`, CI **#773**, run `31320649668`.

### L2 — Oficina recuperada podia reaparecer indefinidamente

Regressão `4488a031a85f34d452d568e81725c788834ced2b`.

CI **#774**, run `31320811968`: vermelho no cenário de saída; auditores/grafo/TypeScript/Chrome continuaram verdes.

Causa: o resgate zerava `rescueAttempts`, mas mantinha a misconception já resolvida no alvo; o Radar voltava a prescrever a mesma Oficina.

Correção mínima em `progressEngine.ts`:

- a saída é calculada pelo próprio `mode.kind="rescue"` + `requiredLevel`;
- ao atingir a saída, limpa misconceptions e `rescueAttempts` **somente do alvo**;
- se o resgate trabalha pré-requisito, a misconception do source permanece em outro `Progress`;
- no nível 5, quem já entra no 5 confirma a saída com dois acertos, coerente com GameLoop.

Prova verde: `98618455b64550949860194745c0f0226f0f49cb`, CI **#775**, run `31321152902`.

## 4. Hipóteses descartadas como bug

- **RT/velocidade:** não concede nem retira domínio conceitual.
- **Alta facilidade:** atingir nível 5 não coroa; repetir no mesmo dia não compra sessão espaçada.
- **Revisão:** `lastDay`/reviewForce reespaçam corretamente por dia civil.
- **Misto:** exige `dom=true`, prática real e conteúdo não-fallback.
- **Matrícula:** placement continua `dom=false`.
- **Dojo livre:** altera facts/volume/RT, não `currentStep`.
- **Dojo prescrito:** pode avançar `currentStep/highestStep` sem mutar `Progress` conceitual.
- **Jardim:** ausência de fraqueza observada impede prescrição; recuperação real o retira.
- **Prioridade:** resgate conceitual de pré-requisito vence Jardim.
- **Reload:** learner state e `dojoTracks` sobrevivem e produzem a mesma próxima prescrição.

## 5. Incidente de teste preservado

Commit `ef6bca4c1be3e7df1486318a0c3cf96fc8067644`, CI **#776**, run `31321310910`, ficou vermelho em Vitest.

A investigação mostrou premissa errada do teste, não bug: `N3.01` nível 3 já libera duas faixas do Dojo; com ponteiro inicial em 1, a prioridade correta é `fluency-gap`, não `newly-unlocked`.

A expectativa foi corrigida **sem mudança de produção** em `3762d506eed4fd0072f5cecbf0f2a6ac84bc3f66`; CI **#777** verde. O run vermelho foi preservado.

## 6. Decisões arquiteturais

- testes longitudinais usam os motores reais, sem segunda inteligência;
- fallback é dívida curricular, não experiência ensinável/evidência;
- Sensei mantém uma fronteira dominante;
- RT/fluência continuam separados de compreensão;
- Dojo manual/prescrito continuam semanticamente separados;
- Jardim depende de causa e fraqueza observada;
- Oficina precisa de saída causal;
- Misto permanece opcional/elegível;
- placement não concede domínio;
- persistência não muda a decisão pedagógica por acidente.

## 7. Riscos residuais

1. A simulação cobre invariantes críticas, não cada uma das 90 competências; Coverage Matrix/fábrica continuam responsáveis por cobertura de conteúdo.
2. Ainda não há property/model-based simulation de milhares de alunos; pode entrar em hardening sem substituir os cenários canônicos.
3. Clock skew da Cloud permanece risco já documentado no checkpoint anterior.
4. Fadiga/carga emocional ainda usam sinais limitados; qualquer política mais rica exige especificação/regressão própria.

## 8. DEPLOYMENT-ONLY

**Nenhum item novo.**

## 9. Dívida curricular intacta

- Composer 26/90;
- servido sem placeholder 51/90;
- 25 fichas prontas em legado;
- 39 fichas prontas em fallback;
- 21 divergências ficha↔tela;
- 12 trocas visuais;
- 44 estreias a classificar;
- primitivas incompletas: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`;
- `Moedas` bloqueia GM.03; `Regua` bloqueia GM.05.

**Não iniciar fábrica das 39 antes da Coverage Matrix.**

## 10. Próxima tarefa única

**Auditoria sistêmica de gamificação / economia / mascote.**

Trace:

`answer/terminal → estrelas/moedas/XP/eventos → carteira/economia → álbum/mascote → UI/consumo → persistência → efeitos sobre progressão`.

Primeiro inventário + regressões. Provar que recompensas não compram currículo/mastery/Dojo; retry/warmup/review/remount não duplicam prêmio; economia não altera learner state; saldos/álbum sobrevivem reload/cloud/UID. Qualquer vínculo com Creature Engine é só inventariado — **não tocar nele**.

Depois:

`gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release`.

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
