# Checkpoint — Simulação longitudinal fechada

> **VIGENTE em 9/ago/2026.** Este checkpoint substitui `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md` como fonte operacional mais nova. Não reabrir os contratos pedagógicos, de cloud ou desta simulação sem falha objetiva.

## 1. Âncora Git e governança

- repo: `dyegorodrigues/SAGA`;
- branch única: `codex/integrar-bloco-f0`;
- PR #29: **open + draft + unmerged**;
- base protegida: `main` em `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- Creature Engine intocado;
- nenhuma branch auxiliar;
- nenhum merge/rebase/ready/auto-merge.

Cabeça funcional fechada:

`1353dcd515d2f0dcb44abbc67de6f7fafc24cf9d`

CI funcional terminal:

- CI **#778**;
- run **`31321595071`**;
- conclusão: **success**;
- **152 arquivos / 2.340 testes**;
- TypeScript verde;
- build verde;
- auditores/fichas/grafo verdes;
- `pr:check` verde;
- higiene do diff verde;
- guarda de binários verde;
- Chrome real/Sensei verde;
- artefato Chrome **`9040333829`**, `sonda-sensei-1353dcd515d2f0dcb44abbc67de6f7fafc24cf9d`.

Diff auditado desde o recibo final da Cloud `6ed04c69794d758661cec180f4db56eb9382cc87`:

- 7 commits à frente;
- 0 atrás;
- 4 arquivos somente;
- dois arquivos de simulação/teste;
- `composer.ts` e `progressEngine.ts` com patches mínimos de bugs provados;
- nenhum Creature Engine;
- nenhuma ficha/conteúdo curricular/fábrica;
- nenhuma alteração em `App.tsx`.

## 2. Método da simulação

A simulação não criou um Tutor paralelo. Ela costura motores reais e estado real:

`estado inicial → Sensei/planAula → source/answer → progress/mastery/Radar/Leitner → Dojo/Jardim/Oficina/Misto → JSON/migrate/reload → próxima decisão`.

Perfis/cenários cobertos permanentemente:

1. iniciante absoluto;
2. ritmo típico com erro isolado;
3. alta facilidade/avanço rápido;
4. domínio multidimensional em sessões espaçadas;
5. resposta correta lenta sem punição conceitual;
6. esquecimento/retorno e revisão por dia civil;
7. dificuldade persistente e Oficina com saída;
8. Misto apenas por repertório dominado/praticado;
9. Matrícula sem `dom=true`;
10. Dojo livre sem mover ponteiro adaptativo;
11. Dojo prescrito movendo somente estado do Dojo;
12. Jardim causal: só entra com fraqueza já observada e sai após recuperação;
13. pré-requisito conceitual mantendo prioridade sobre Jardim;
14. persistência/reload mantendo a mesma próxima prescrição e a separação conceito × automaticidade.

Arquivos permanentes:

- `src/curriculum/motores/longitudinalSenseiSimulation.test.ts`;
- `src/curriculum/motores/longitudinalAutomaticitySimulation.test.ts`.

## 3. Bugs realmente provados

### L1 — fallback podia virar fronteira dominante do Sensei

Regressão-only:

`3247669146753913f51e5bda92d3e2e96abf17e8`

CI **#772**, run `31320433584`: vermelho com **1 única falha nova**; os 2.330 testes vizinhos passaram.

Cenário: depois de dominar todo conteúdo realmente servido anterior, `planAula()` podia escolher um track `contentStatus="fallback"` como fronteira dominante. Como fallback não produz ensino/evidência real, a criança podia reencontrar “Em construção” em sessões sucessivas e ficar sem próxima meta ensinável.

Correção mínima em `composer.ts`:

- o DAG/status continua vendo todo o universo canônico;
- aquecimento/fronteira escolhem somente `contentStatus !== "fallback"`;
- histórico/prerequisitos não foram apagados;
- resgate, revisão, fluência e fábrica curricular não foram alterados sem regressão própria.

Primeira prova verde: `2cded104d67304c0a8e68bc52bddf85abcab9901`, CI **#773**, run `31320649668`.

### L2 — Oficina bem-sucedida podia reaparecer indefinidamente

Regressão longitudinal:

`4488a031a85f34d452d568e81725c788834ced2b`

CI **#774**, run `31320811968`: vermelho no cenário de saída da Oficina; auditores/grafo/TypeScript/Chrome permaneceram verdes.

Causa: o terminal de resgate zerava `rescueAttempts`, mas a coleção de misconception do alvo mantinha os eventos antigos. Na sessão seguinte, o Radar reconhecia novamente o mesmo padrão e podia prescrever a mesma Oficina mesmo depois de a criança atingir o nível de saída.

Correção mínima em `progressEngine.ts`:

- recuperação é calculada pelo próprio `mode.kind="rescue"` + `requiredLevel`;
- ao atingir a condição real de saída, limpa misconceptions **somente da competência-alvo do resgate** e zera `rescueAttempts`;
- se o resgate desceu para um pré-requisito, a misconception da competência-source vive em outro `Progress` e não é apagada;
- regra especial de saída no nível 5 permanece coerente com GameLoop: confirmação por dois acertos quando já entra no 5.

Prova verde: `98618455b64550949860194745c0f0226f0f49cb`, CI **#775**, run `31321152902`.

## 4. Hipóteses testadas e não confirmadas como bug

### Velocidade × domínio

Resposta correta lenta e rápida percorrem a mesma escada conceitual. RT continua dado de fluência, sem poder de conceder/retirar mastery.

### Domínio por alta facilidade

Chegar rapidamente ao nível 5 não coroa. O teste longitudinal exige sessão madura no nível 5 e confirmação em outro dia elegível; repetição no mesmo dia não compra segunda sessão.

### Revisão/retorno

`lastDay`/reviewForce produzem revisão por dia civil e um acerto de revisão reespaça o próximo vencimento sem alterar a regra conceitual.

### Misto

Só entram tracks `dom=true`, realmente praticados e não-fallback. Um track avançado sem domínio ou um `dom` sem prática real não entra.

### Matrícula

Placement semeia nível/evidência observada, mas permanece `dom=false`.

### Dojo manual × prescrito

Dojo livre atualiza fatos/estatística/volume, mas não move `currentStep`. Se a lacuna continua, o Sensei volta a prescrevê-la no dia seguinte. Duas boas rodadas **prescritas** podem mover somente o `currentStep/highestStep` do Dojo; o `Progress` conceitual fica byte-equivalente no teste.

### Jardim causal

Sem fraqueza JD observada não há Jardim. Com fraqueza real e mãe conceitualmente elegível ele pode entrar; duas rodadas fortes recuperam o JD, fazem o Jardim sair e não alteram o progresso conceitual da mãe.

### Prioridade

`prerequisite-gap` conceitual continua vencendo Jardim elegível no `chooseSenseiEntry`.

### Persistência/reload

`Progress` conceitual e `dojoTracks` sobrevivem JSON → migrate e geram a mesma prescrição do dia seguinte. Reload não muda a decisão apenas por efeito de persistência.

## 5. Incidente de teste — não mascarado

A primeira bateria de automaticidade, commit `ef6bca4c1be3e7df1486318a0c3cf96fc8067644`, CI **#776**, run `31321310910`, ficou vermelha em Vitest.

A investigação mostrou **premissa incorreta do teste**, não bug do runtime: com `N3.01` em nível conceitual 3, as faixas 1 e 2 do Dojo já são elegíveis; como o ponteiro nasce na 1, a política corretamente classifica a primeira prescrição como `fluency-gap` antes da categoria genérica `newly-unlocked`.

O teste foi corrigido, sem mudança de produção, em `3762d506eed4fd0072f5cecbf0f2a6ac84bc3f66`. CI **#777** ficou verde. O histórico vermelho foi preservado.

## 6. Decisões arquiteturais preservadas

- não existe simulador com inteligência paralela: testes chamam motores reais;
- Sensei continua autoridade prescritiva e mantém uma fronteira dominante;
- fallback é nó do currículo/dívida, não experiência ensinável nem evidência;
- velocidade/fluência continuam separadas de compreensão;
- Dojo manual e prescrito têm semânticas distintas;
- Jardim continua causal e dependente de fraqueza observada;
- Oficina precisa de condição de saída e agora materializa essa saída no alvo correto;
- Misto continua opcional e elegível por repertório real;
- placement continua sem conceder domínio;
- persistência não pode alterar decisão pedagógica por acidente.

## 7. Riscos residuais

1. A simulação é determinística e cobre contratos críticos, mas não enumera cada uma das 90 competências; Coverage Matrix/fábrica continuam responsáveis pela cobertura executável de conteúdo.
2. Não foi criada simulação estocástica de milhares de crianças; hardening futuro pode acrescentar property-based/model-based tests sem substituir estes cenários canônicos.
3. Clock skew da Cloud continua risco já documentado no checkpoint anterior e não pertence à semântica pedagógica da simulação.
4. Duração/carga emocional/fadiga ainda usam sinais limitados no runtime; uma política mais rica só deve entrar com especificação/regressão própria.

## 8. DEPLOYMENT-ONLY

**Nenhum item novo.**

## 9. Dívida curricular permanece intacta

- Composer ativo: 26/90;
- servido sem placeholder: 51/90;
- 25 fichas prontas ainda em legado;
- 39 fichas prontas ainda em fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta a classificar;
- primitivas incompletas: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

**Não iniciar fábrica das 39 antes da Coverage Matrix.**

## 10. Próxima tarefa única

**Auditoria sistêmica de gamificação / economia / mascote.**

Objetivo: mapear eventos pedagógicos → recompensa/economia/mascote e provar que nenhuma camada de motivação ganhou autoridade sobre currículo, unlock, mastery, Dojo, Oficina, Jardim ou Matrícula.

Trace inicial:

`answer/terminal → estrelas/moedas/XP/eventos → carteira/economia → álbum/mascote → UI/consumo → persistência → efeitos colaterais sobre progressão`.

Primeiro inventário e regressões. Não redesenhar economia por preferência e não abrir Creature Engine.

Depois:

`gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release`.

## 11. Recibo documental

Como o SHA de um commit não pode existir dentro do conteúdo que o produz, este arquivo registra agora a cabeça funcional/CI. A cabeça documental consolidada e seu CI serão registrados por recibo posterior e no corpo da PR #29, sem falsa auto-referência.

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
